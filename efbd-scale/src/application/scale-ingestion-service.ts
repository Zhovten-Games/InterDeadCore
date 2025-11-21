import { AxisCode } from "../core/axis-code.js";
import { DomainEvent, DomainEventType } from "../core/domain-events.js";
import { ScaleSnapshot } from "../core/scale-snapshot.js";
import { IScaleTriggerPort, TriggerIngestionRequest } from "../ports/inbound/scale-trigger-port.js";
import { IClock } from "../ports/outbound/clock.js";
import { ILogger } from "../ports/outbound/logger.js";
import { IScaleRepository } from "../ports/outbound/scale-repository.js";
import { ITriggerLogRepository, TriggerLogEntry } from "../ports/outbound/trigger-log-repository.js";

export interface ScaleIngestionOptions {
  maxIncrementPerEvent?: number;
}

export interface IngestionResult {
  snapshot: ScaleSnapshot;
  events: DomainEvent[];
}

export class ScaleIngestionService implements IScaleTriggerPort {
  private readonly maxIncrementPerEvent: number;

  constructor(
    private readonly repository: IScaleRepository,
    private readonly triggerLogRepository: ITriggerLogRepository,
    private readonly clock: IClock,
    private readonly logger: ILogger,
    options?: ScaleIngestionOptions
  ) {
    this.maxIncrementPerEvent = options?.maxIncrementPerEvent ?? 1;
  }

  async recordTriggers(request: TriggerIngestionRequest): Promise<ScaleSnapshot> {
    const now = request.occurredAt ?? this.clock.now();
    const events: DomainEvent[] = [];
    let snapshot =
      (await this.repository.getSnapshot(request.profileId)) ??
      ScaleSnapshot.createEmpty(request.profileId, now);

    for (const trigger of request.triggers) {
      this.validateTrigger(trigger.axis);
      snapshot = snapshot.withIncrementedAxis(
        trigger.axis,
        this.maxIncrementPerEvent,
        trigger.source,
        now
      );
      const triggerEntry: TriggerLogEntry = {
        profileId: request.profileId,
        axis: trigger.axis,
        source: trigger.source,
        metadata: trigger.metadata,
        occurredAt: now
      };
      await this.triggerLogRepository.logTrigger(triggerEntry);
      events.push({
        type: DomainEventType.TRIGGER_RECORDED,
        payload: triggerEntry,
        occurredAt: now
      });
    }

    await this.repository.saveSnapshot(snapshot);
    events.push({ type: DomainEventType.SCALE_UPDATED, payload: snapshot, occurredAt: now });

    this.logger.info("EFBD scale updated", {
      profileId: request.profileId,
      axes: request.triggers.map((t) => t.axis)
    });

    return snapshot;
  }

  private validateTrigger(axis: AxisCode): void {
    if (!Object.values(AxisCode).includes(axis)) {
      throw new Error(`Unrecognized axis code: ${axis}`);
    }
  }
}
