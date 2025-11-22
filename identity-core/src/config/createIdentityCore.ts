import { IdentityLinkService } from '../application/IdentityLinkService.js';
import { IdentitySyncService } from '../application/IdentitySyncService.js';
import { ProfileCompletionService } from '../application/ProfileCompletionService.js';
import { LocalProfileRepositoryAdapter } from '../adapters/LocalProfileRepositoryAdapter.js';
import { DiscordOAuthAdapter, DiscordOAuthConfig } from '../adapters/DiscordOAuthAdapter.js';
import { CloudflareProfileRepositoryAdapter, CloudflareBindings } from '../adapters/CloudflareProfileRepositoryAdapter.js';
import { IClock, IEventBusPort, IProfileCompletionPort, ILogger, ISessionStore, IScaleAdapter } from '../ports/index.js';

export interface IdentityCoreOptions {
  readonly discord?: DiscordOAuthConfig;
  readonly cloudflare?: CloudflareBindings;
  readonly completionPort?: IProfileCompletionPort;
  readonly eventBus?: IEventBusPort;
  readonly sessionStore?: ISessionStore;
  readonly scaleAdapter?: IScaleAdapter;
  readonly logger?: ILogger;
  readonly clock?: IClock;
}

const defaultLogger: ILogger = {
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined
};

export const createIdentityCore = (options: IdentityCoreOptions) => {
  const logger = options.logger ?? defaultLogger;
  const repository = options.cloudflare
    ? new CloudflareProfileRepositoryAdapter(options.cloudflare, logger)
    : new LocalProfileRepositoryAdapter();

  const discordPort = options.discord ? new DiscordOAuthAdapter(options.discord, logger) : undefined;
  const linkService = new IdentityLinkService(repository, discordPort, options.eventBus, options.sessionStore, logger);
  const syncService = new IdentitySyncService(repository, options.scaleAdapter, logger);
  const completionService = new ProfileCompletionService(repository, options.completionPort, logger);

  return {
    linkService,
    syncService,
    completionService,
    repository,
    logger,
    clock: options.clock ?? { now: () => new Date() }
  };
};
