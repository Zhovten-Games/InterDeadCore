import { createEvent, DiscordLinkedPayload, DiscordUnlinkedPayload, ProfileUpdatedPayload } from '../domain/events.js';
import { DiscordProfileLink, ProfileMetadata, ScaleSnapshotRef } from '../domain/valueObjects.js';
import { DiscordLinkPolicy } from '../domain/policies/DiscordLinkPolicy.js';

export interface IdentityStateProps {
  readonly metadata: ProfileMetadata;
  readonly discordLink?: DiscordProfileLink;
  readonly scaleSnapshots?: ScaleSnapshotRef[];
}

export class IdentityAggregate {
  private events: ReturnType<typeof createEvent>[] = [];
  private discordLink?: DiscordProfileLink;
  private metadata: ProfileMetadata;
  private scaleSnapshots: ScaleSnapshotRef[];

  constructor(props: IdentityStateProps) {
    this.metadata = props.metadata;
    this.discordLink = props.discordLink;
    this.scaleSnapshots = props.scaleSnapshots ?? [];
  }

  get state(): IdentityStateProps {
    return {
      metadata: this.metadata,
      discordLink: this.discordLink,
      scaleSnapshots: [...this.scaleSnapshots]
    };
  }

  linkDiscord(link: DiscordProfileLink, policy: DiscordLinkPolicy, allowUsernameOverride: boolean): void {
    const updatedMetadata = policy.canOverrideMetadata({
      existingMetadata: this.metadata,
      incomingLink: link,
      allowUsernameOverride
    });

    this.metadata = updatedMetadata;
    this.discordLink = link;
    this.events.push(
      createEvent<DiscordLinkedPayload>('IDENTITY_LINKED', {
        profileId: this.metadata.profileId,
        discordId: link.discordId,
        username: link.username
      })
    );
  }

  unlinkDiscord(): void {
    if (!this.discordLink) return;
    this.discordLink = undefined;
    this.events.push(
      createEvent<DiscordUnlinkedPayload>('IDENTITY_UNLINKED', {
        profileId: this.metadata.profileId
      })
    );
  }

  updateProfile(changes: Partial<Omit<ProfileMetadata, 'profileId'>>): void {
    const previous = this.metadata;
    this.metadata = this.metadata.withOverrides(changes);
    this.events.push(
      createEvent<ProfileUpdatedPayload>('PROFILE_UPDATED', {
        profileId: this.metadata.profileId,
        changes: {
          before: previous,
          after: this.metadata
        }
      })
    );
  }

  attachSnapshot(ref: ScaleSnapshotRef): void {
    this.scaleSnapshots = [...this.scaleSnapshots.filter((existing) => existing.axisCode !== ref.axisCode), ref];
  }

  pullEvents(): ReturnType<typeof createEvent>[] {
    const flushed = [...this.events];
    this.events = [];
    return flushed;
  }
}
