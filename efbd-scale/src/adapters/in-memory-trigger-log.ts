import { ITriggerLogRepository, TriggerLogEntry } from "../ports/outbound/trigger-log-repository.js";

export class InMemoryTriggerLogRepository implements ITriggerLogRepository {
  private readonly entries: TriggerLogEntry[] = [];

  async logTrigger(entry: TriggerLogEntry): Promise<void> {
    this.entries.push({ ...entry });
  }

  getLogs(): TriggerLogEntry[] {
    return [...this.entries];
  }
}
