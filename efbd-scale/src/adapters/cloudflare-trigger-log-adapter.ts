import { ITriggerLogRepository, TriggerLogEntry } from "../ports/outbound/trigger-log-repository.js";

export interface KvNamespace {
  put(key: string, value: string): Promise<void>;
}

export class CloudflareTriggerLogAdapter implements ITriggerLogRepository {
  constructor(private readonly kv: KvNamespace, private readonly namespace: string = "efbd-trigger-log") {}

  async logTrigger(entry: TriggerLogEntry): Promise<void> {
    const key = `${this.namespace}:${entry.profileId}:${entry.occurredAt.toISOString()}:${entry.axis}`;
    await this.kv.put(
      key,
      JSON.stringify({
        profileId: entry.profileId,
        axis: entry.axis,
        source: entry.source,
        metadata: entry.metadata ?? {},
        occurredAt: entry.occurredAt.toISOString()
      })
    );
  }
}
