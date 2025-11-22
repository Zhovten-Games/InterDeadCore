import { DiscordProfileLink } from '../domain/valueObjects.js';
import { IDiscordOAuthPort, ILogger } from '../ports/index.js';
import { mapError } from '../utils/errorMapper.js';

export interface DiscordOAuthConfig {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly redirectUri: string;
  readonly tokenEndpoint?: string;
  readonly userEndpoint?: string;
  readonly fetchImpl?: typeof fetch;
}

interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface DiscordUserResponse {
  id: string;
  username: string;
  discriminator?: string;
  global_name?: string;
  avatar?: string;
}

export class DiscordOAuthAdapter implements IDiscordOAuthPort {
  private readonly fetch: typeof fetch;
  private readonly tokenEndpoint: string;
  private readonly userEndpoint: string;

  constructor(private readonly config: DiscordOAuthConfig, private readonly logger: ILogger) {
    this.fetch = config.fetchImpl ?? fetch;
    this.tokenEndpoint = config.tokenEndpoint ?? 'https://discord.com/api/oauth2/token';
    this.userEndpoint = config.userEndpoint ?? 'https://discord.com/api/users/@me';
  }

  async exchangeCode(code: string): Promise<DiscordProfileLink> {
    try {
      const token = await this.requestToken(code);
      const user = await this.fetchUser(token.access_token);
      this.logger.info('Fetched Discord profile', { discordId: user.id });
      return new DiscordProfileLink({
        discordId: user.id,
        username: user.global_name ?? user.username,
        discriminator: user.discriminator,
        avatarUrl: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : undefined
      });
    } catch (error) {
      const mapped = mapError(error, 'Failed to exchange Discord code');
      this.logger.error(mapped.message);
      throw mapped;
    }
  }

  private async requestToken(code: string): Promise<DiscordTokenResponse> {
    const response = await this.fetch(this.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.config.redirectUri
      })
    });

    if (!response.ok) {
      throw new Error(`Discord token request failed with status ${response.status}`);
    }
    return (await response.json()) as DiscordTokenResponse;
  }

  private async fetchUser(accessToken: string): Promise<DiscordUserResponse> {
    const response = await this.fetch(this.userEndpoint, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!response.ok) {
      throw new Error(`Discord user request failed with status ${response.status}`);
    }
    return (await response.json()) as DiscordUserResponse;
  }
}
