import { describe, expect, it } from 'vitest';
import { ScaleSnapshot } from '../src/core/scale-snapshot.js';
import { ALL_AXIS_CODES } from '../src/core/axis-code.js';
import { ScaleSyncService } from '../src/application/scale-sync-service.js';
import { ILogger, NullLogger } from '../src/ports/outbound/logger.js';
import { IScaleRepository } from '../src/ports/outbound/scale-repository.js';
import { AxisScore } from '../src/core/axis-score.js';

class FailingRepository implements IScaleRepository {
  private attempts = 0;
  constructor(private readonly failUntil: number) {}

  async getSnapshot(): Promise<null> {
    return null;
  }

  async saveSnapshot(_snapshot: ScaleSnapshot): Promise<void> {
    this.attempts += 1;
    if (this.attempts <= this.failUntil) {
      throw new Error('Transient failure');
    }
  }
}

class MemoryLogger extends NullLogger implements ILogger {
  warnings: string[] = [];
  infoMessages: string[] = [];
  errors: string[] = [];

  warn(message: string): void {
    this.warnings.push(message);
  }

  info(message: string): void {
    this.infoMessages.push(message);
  }

  error(message: string): void {
    this.errors.push(message);
  }
}

describe('ScaleSyncService', () => {
  it('retries saving snapshot before failing', async () => {
    const repo = new FailingRepository(2);
    const logger = new MemoryLogger();
    const sync = new ScaleSyncService(repo, logger, { backoffMs: 0 });
    const snapshot = new ScaleSnapshot({
      profileId: 'player-99',
      axisScores: new Map(
        ALL_AXIS_CODES.map((axis) => [
          axis,
          new AxisScore({ axis, value: 0, lastUpdated: new Date() }),
        ]),
      ),
      updatedAt: new Date(),
    });

    await sync.syncSnapshot(snapshot);
    expect(logger.warnings.length).toBe(2);
    expect(logger.errors.length).toBe(0);
  });
});
