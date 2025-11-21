import { ScaleSnapshot } from '../core/scale-snapshot.js';
import { IScaleRepository } from '../ports/outbound/scale-repository.js';

export class InMemoryScaleRepository implements IScaleRepository {
  private readonly store = new Map<string, ScaleSnapshot>();

  async getSnapshot(profileId: string): Promise<ScaleSnapshot | null> {
    const snapshot = this.store.get(profileId);
    return snapshot ? this.clone(snapshot) : null;
  }

  async saveSnapshot(snapshot: ScaleSnapshot): Promise<void> {
    this.store.set(snapshot.profileId, this.clone(snapshot));
  }

  private clone(snapshot: ScaleSnapshot): ScaleSnapshot {
    return new ScaleSnapshot({
      profileId: snapshot.profileId,
      axisScores: new Map(snapshot.axisScores),
      updatedAt: new Date(snapshot.updatedAt.getTime()),
    });
  }
}
