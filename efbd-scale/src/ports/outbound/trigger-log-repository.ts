import { AxisCode } from "../../core/axis-code.js";

export interface TriggerLogEntry {
  profileId: string;
  axis: AxisCode;
  source: string;
  metadata?: Record<string, unknown>;
  occurredAt: Date;
}

export interface ITriggerLogRepository {
  logTrigger(entry: TriggerLogEntry): Promise<void>;
}
