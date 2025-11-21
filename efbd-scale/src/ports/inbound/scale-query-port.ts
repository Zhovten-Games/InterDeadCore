import { ScaleSnapshot } from "../../core/scale-snapshot.js";

export interface IScaleQueryPort {
  fetchSnapshot(profileId: string): Promise<ScaleSnapshot>;
}
