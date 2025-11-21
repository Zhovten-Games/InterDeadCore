import { ScaleSnapshot } from '../../core/scale-snapshot.js';

export interface IScaleRepository {
  getSnapshot(profileId: string): Promise<ScaleSnapshot | null>;
  saveSnapshot(snapshot: ScaleSnapshot): Promise<void>;
}
