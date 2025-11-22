import { IdentityAggregate } from '../core/IdentityAggregate.js';
import { DiscordLinkPolicy } from '../domain/policies/DiscordLinkPolicy.js';
import { DiscordProfileLink, ProfileMetadata } from '../domain/valueObjects.js';
import { IDiscordOAuthPort, IIdentityRepository, IEventBusPort, ILogger, ISessionStore } from '../ports/index.js';

export interface IdentityLinkOptions {
  readonly allowUsernameOverride?: boolean;
  readonly policy?: DiscordLinkPolicy;
}

export class IdentityLinkService {
  constructor(
    private readonly repository: IIdentityRepository,
    private readonly discordPort: IDiscordOAuthPort | undefined,
    private readonly eventBus: IEventBusPort | undefined,
    private readonly sessionStore: ISessionStore | undefined,
    private readonly logger: ILogger
  ) {}

  async beginDiscordLogin(stateKey: string, stateValue: string): Promise<void> {
    if (!this.sessionStore) {
      throw new Error('Session store is required to begin a login flow');
    }
    await this.sessionStore.set(stateKey, stateValue);
    this.logger.info('Stored Discord login state token');
  }

  async completeDiscordLogin(
    profileId: string,
    code: string,
    metadata: ProfileMetadata,
    options: IdentityLinkOptions = {}
  ): Promise<IdentityAggregate> {
    if (!this.discordPort) {
      throw new Error('Discord OAuth is disabled for this runtime');
    }

    const linkPayload: DiscordProfileLink = await this.discordPort.exchangeCode(code);
    const policy = options.policy ?? new DiscordLinkPolicy();
    const identity = new IdentityAggregate({ metadata });

    identity.linkDiscord(linkPayload, policy, options.allowUsernameOverride ?? true);
    await this.repository.save(identity.state);
    await this.eventBus?.publish(identity.pullEvents());
    this.logger.info('Discord login completed', { profileId });
    return identity;
  }

  async disconnect(profileId: string): Promise<IdentityAggregate> {
    const currentState = await this.repository.findById(profileId);
    if (!currentState) {
      throw new Error('Profile not found');
    }
    const aggregate = new IdentityAggregate(currentState);
    aggregate.unlinkDiscord();
    await this.repository.save(aggregate.state);
    await this.eventBus?.publish(aggregate.pullEvents());
    this.logger.info('Discord account disconnected', { profileId });
    return aggregate;
  }
}
