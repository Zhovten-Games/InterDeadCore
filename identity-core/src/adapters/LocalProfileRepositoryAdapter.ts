import { IdentityStateProps } from "../core/IdentityAggregate.js";
import { IIdentityRepository } from "../ports/index.js";

export class LocalProfileRepositoryAdapter implements IIdentityRepository {
  private readonly store = new Map<string, IdentityStateProps>();

  async findById(profileId: string): Promise<IdentityStateProps | undefined> {
    return this.store.get(profileId);
  }

  async save(state: IdentityStateProps): Promise<void> {
    this.store.set(state.metadata.profileId, state);
  }

  async delete(profileId: string): Promise<void> {
    this.store.delete(profileId);
  }
}
