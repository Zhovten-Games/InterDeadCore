import { IdentityAggregate } from "../core/IdentityAggregate.js";
import { ProfileMetadata, ScaleSnapshotRef } from "../domain/valueObjects.js";
import { IIdentityRepository, IScaleAdapter, ILogger } from "../ports/index.js";

export interface SyncProfileOptions {
  readonly allowScaleSync?: boolean;
}

export class IdentitySyncService {
  constructor(
    private readonly repository: IIdentityRepository,
    private readonly scaleAdapter: IScaleAdapter | undefined,
    private readonly logger: ILogger,
  ) {}

  async pull(
    profileId: string,
    metadataFactory: () => ProfileMetadata,
  ): Promise<IdentityAggregate> {
    const existing = await this.repository.findById(profileId);
    if (existing) {
      this.logger.info("Loaded existing identity profile", { profileId });
      return new IdentityAggregate(existing);
    }
    const aggregate = new IdentityAggregate({ metadata: metadataFactory() });
    await this.repository.save(aggregate.state);
    this.logger.info("Initialized new identity profile", { profileId });
    return aggregate;
  }

  async pushSnapshots(
    profileId: string,
    snapshots: ScaleSnapshotRef[],
    options: SyncProfileOptions = {},
  ): Promise<void> {
    if (!options.allowScaleSync || !this.scaleAdapter) {
      this.logger.warn("Scale adapter is disabled; skipping snapshot sync", {
        profileId,
      });
      return;
    }
    for (const snapshot of snapshots) {
      await this.scaleAdapter.attachSnapshot(profileId, snapshot);
    }
    this.logger.info("Synced scale snapshots", {
      profileId,
      count: snapshots.length,
    });
  }
}
