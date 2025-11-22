export interface DiscordProfileLinkProps {
  readonly discordId: string;
  readonly username: string;
  readonly discriminator?: string;
  readonly avatarUrl?: string;
}

export class DiscordProfileLink {
  readonly discordId: string;
  readonly username: string;
  readonly discriminator?: string;
  readonly avatarUrl?: string;

  constructor(props: DiscordProfileLinkProps) {
    if (!/^\d+$/.test(props.discordId)) {
      throw new Error("Discord ID must be a numeric snowflake");
    }
    this.discordId = props.discordId;
    this.username = props.username.trim();
    this.discriminator = props.discriminator;
    this.avatarUrl = props.avatarUrl;
  }
}

export interface ProfileMetadataProps {
  readonly profileId: string;
  readonly displayName: string;
  readonly location?: string;
  readonly avatarUrl?: string;
}

export class ProfileMetadata {
  readonly profileId: string;
  readonly displayName: string;
  readonly location?: string;
  readonly avatarUrl?: string;

  constructor(props: ProfileMetadataProps) {
    if (!props.displayName.trim()) {
      throw new Error("Display name is required");
    }
    this.profileId = props.profileId;
    this.displayName = props.displayName.trim();
    this.location = props.location?.trim();
    this.avatarUrl = props.avatarUrl;
  }

  withOverrides(
    overrides: Partial<Omit<ProfileMetadataProps, "profileId">>,
  ): ProfileMetadata {
    return new ProfileMetadata({
      profileId: this.profileId,
      displayName: overrides.displayName ?? this.displayName,
      location: overrides.location ?? this.location,
      avatarUrl: overrides.avatarUrl ?? this.avatarUrl,
    });
  }
}

export interface ScaleSnapshotRefProps {
  readonly axisCode: string;
  readonly snapshotId: string;
}

export class ScaleSnapshotRef {
  readonly axisCode: string;
  readonly snapshotId: string;

  constructor(props: ScaleSnapshotRefProps) {
    if (!props.axisCode.trim()) {
      throw new Error("Axis code is required");
    }
    if (!props.snapshotId.trim()) {
      throw new Error("Snapshot id is required");
    }
    this.axisCode = props.axisCode;
    this.snapshotId = props.snapshotId;
  }
}
