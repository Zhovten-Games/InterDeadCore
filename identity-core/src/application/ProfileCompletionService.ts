import { IdentityAggregate } from '../core/IdentityAggregate.js';
import { ProfileMetadata } from '../domain/valueObjects.js';
import { IIdentityRepository, IProfileCompletionPort, ILogger } from '../ports/index.js';

export class ProfileCompletionService {
  constructor(
    private readonly repository: IIdentityRepository,
    private readonly completionPort: IProfileCompletionPort | undefined,
    private readonly logger: ILogger
  ) {}

  async ensureComplete(metadata: ProfileMetadata): Promise<ProfileMetadata> {
    if (!this.completionPort) {
      this.logger.warn('Profile completion port missing; returning metadata as-is', {
        profileId: metadata.profileId
      });
      return metadata;
    }
    const missing = await this.completionPort.requestMissingFields(metadata);
    const updated = metadata.withOverrides(missing);
    this.logger.info('Profile completion resolved', { profileId: metadata.profileId });
    return updated;
  }

  async updateAndPersist(profileId: string, changes: Partial<Omit<ProfileMetadata, 'profileId'>>): Promise<IdentityAggregate> {
    const currentState = await this.repository.findById(profileId);
    if (!currentState) {
      throw new Error('Profile not found');
    }
    const aggregate = new IdentityAggregate(currentState);
    aggregate.updateProfile(changes);
    await this.repository.save(aggregate.state);
    this.logger.info('Profile persisted after completion', { profileId });
    return aggregate;
  }
}
