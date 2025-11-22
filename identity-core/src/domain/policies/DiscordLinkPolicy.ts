import { DiscordProfileLink, ProfileMetadata } from '../valueObjects.js';

export interface DiscordLinkPolicyContext {
  readonly existingMetadata: ProfileMetadata;
  readonly incomingLink: DiscordProfileLink;
  readonly allowUsernameOverride: boolean;
}

export class DiscordLinkPolicy {
  constructor(private readonly allowAvatarOverride: boolean = true) {}

  canOverrideMetadata(context: DiscordLinkPolicyContext): ProfileMetadata {
    if (!this.allowAvatarOverride) {
      return context.existingMetadata;
    }

    const overriddenAvatar = context.incomingLink.avatarUrl ?? context.existingMetadata.avatarUrl;
    const overriddenName = context.allowUsernameOverride
      ? `${context.incomingLink.username}${context.incomingLink.discriminator ? '#' + context.incomingLink.discriminator : ''}`
      : context.existingMetadata.displayName;

    return context.existingMetadata.withOverrides({
      displayName: overriddenName,
      avatarUrl: overriddenAvatar
    });
  }
}
