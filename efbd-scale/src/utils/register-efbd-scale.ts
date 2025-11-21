import { ScaleIngestionService } from '../application/scale-ingestion-service.js';
import { ScaleQueryService } from '../application/scale-query-service.js';
import { SystemClock } from '../ports/outbound/clock.js';
import { ILogger, NullLogger } from '../ports/outbound/logger.js';
import { IScaleRepository } from '../ports/outbound/scale-repository.js';
import { ITriggerLogRepository } from '../ports/outbound/trigger-log-repository.js';

export interface EfbdScaleContainer {
  register<T>(token: string, factory: () => T): void;
}

export interface RegisterEfbdScaleOptions {
  repository: IScaleRepository;
  triggerLogRepository: ITriggerLogRepository;
  logger?: ILogger;
}

export function registerEfbdScale(
  container: EfbdScaleContainer,
  options: RegisterEfbdScaleOptions,
): void {
  const clock = new SystemClock();
  const logger = options.logger ?? new NullLogger();
  container.register(
    'ScaleIngestionService',
    () =>
      new ScaleIngestionService(options.repository, options.triggerLogRepository, clock, logger),
  );
  container.register('ScaleQueryService', () => new ScaleQueryService(options.repository, clock));
}
