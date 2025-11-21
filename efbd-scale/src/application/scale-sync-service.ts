import { ScaleSnapshot } from '../core/scale-snapshot.js';
import { ILogger } from '../ports/outbound/logger.js';
import { IScaleRepository } from '../ports/outbound/scale-repository.js';

export interface ScaleSyncOptions {
  maxAttempts?: number;
  backoffMs?: number;
}

export class ScaleSyncService {
  private readonly maxAttempts: number;
  private readonly backoffMs: number;

  constructor(
    private readonly repository: IScaleRepository,
    private readonly logger: ILogger,
    options?: ScaleSyncOptions,
  ) {
    this.maxAttempts = options?.maxAttempts ?? 3;
    this.backoffMs = options?.backoffMs ?? 50;
  }

  async syncSnapshot(snapshot: ScaleSnapshot): Promise<void> {
    let attempt = 0;
    let lastError: unknown;
    while (attempt < this.maxAttempts) {
      attempt += 1;
      try {
        await this.repository.saveSnapshot(snapshot);
        return;
      } catch (error) {
        lastError = error;
        this.logger.warn('Failed to sync EFBD snapshot, retrying', {
          attempt,
          profileId: snapshot.profileId,
          error: error instanceof Error ? error.message : String(error),
        });
        if (attempt < this.maxAttempts) {
          await this.delay(this.backoffMs * attempt);
        }
      }
    }
    this.logger.error('Sync attempts exhausted for EFBD snapshot', {
      profileId: snapshot.profileId,
      error: lastError instanceof Error ? lastError.message : String(lastError),
    });
    throw lastError instanceof Error ? lastError : new Error('Failed to sync EFBD snapshot');
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
