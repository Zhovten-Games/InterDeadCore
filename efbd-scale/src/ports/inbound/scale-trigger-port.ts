import { AxisCode } from "../../core/axis-code.js";
import { ScaleSnapshot } from "../../core/scale-snapshot.js";

export interface ScaleTrigger {
  axis: AxisCode;
  source: string;
  metadata?: Record<string, unknown>;
}

export interface TriggerIngestionRequest {
  profileId: string;
  triggers: ScaleTrigger[];
  occurredAt?: Date;
}

export interface IScaleTriggerPort {
  recordTriggers(request: TriggerIngestionRequest): Promise<ScaleSnapshot>;
}
