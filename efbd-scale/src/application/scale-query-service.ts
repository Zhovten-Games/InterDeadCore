import { ScaleSnapshot } from "../core/scale-snapshot.js";
import { IScaleQueryPort } from "../ports/inbound/scale-query-port.js";
import { IClock } from "../ports/outbound/clock.js";
import { IScaleRepository } from "../ports/outbound/scale-repository.js";

export class ScaleQueryService implements IScaleQueryPort {
  constructor(private readonly repository: IScaleRepository, private readonly clock: IClock) {}

  async fetchSnapshot(profileId: string): Promise<ScaleSnapshot> {
    const snapshot = await this.repository.getSnapshot(profileId);
    if (snapshot) {
      return snapshot;
    }
    return ScaleSnapshot.createEmpty(profileId, this.clock.now());
  }
}
