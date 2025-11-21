import { describe, expect, it } from 'vitest';
import { InMemoryScaleRepository } from '../src/adapters/in-memory-scale-repository.js';
import { InMemoryTriggerLogRepository } from '../src/adapters/in-memory-trigger-log.js';
import { AxisCode } from '../src/core/axis-code.js';
import { ScaleIngestionService } from '../src/application/scale-ingestion-service.js';
import { ScaleQueryService } from '../src/application/scale-query-service.js';
import { IClock } from '../src/ports/outbound/clock.js';
import { NullLogger } from '../src/ports/outbound/logger.js';

class FixedClock implements IClock {
  constructor(private readonly value: Date) {}
  now(): Date {
    return this.value;
  }
}

describe('ScaleIngestionService', () => {
  it('increments each axis independently and logs triggers', async () => {
    const clock = new FixedClock(new Date('2024-01-01T00:00:00.000Z'));
    const repository = new InMemoryScaleRepository();
    const triggerLog = new InMemoryTriggerLogRepository();
    const logger = new NullLogger();
    const service = new ScaleIngestionService(repository, triggerLog, clock, logger);
    const query = new ScaleQueryService(repository, clock);

    await service.recordTriggers({
      profileId: 'player-123',
      triggers: [
        { axis: AxisCode.EBF_SOCIAL, source: 'mini-alpha' },
        { axis: AxisCode.EBF_MIND, source: 'mini-beta' },
        { axis: AxisCode.EBF_SOCIAL, source: 'mini-alpha' },
      ],
    });

    const snapshot = await query.fetchSnapshot('player-123');
    expect(snapshot.axisScores.get(AxisCode.EBF_SOCIAL)?.value).toBe(2);
    expect(snapshot.axisScores.get(AxisCode.EBF_MIND)?.value).toBe(1);

    const logs = triggerLog.getLogs();
    expect(logs).toHaveLength(3);
    expect(logs[0].axis).toBe(AxisCode.EBF_SOCIAL);
    expect(logs[1].axis).toBe(AxisCode.EBF_MIND);
  });
});
