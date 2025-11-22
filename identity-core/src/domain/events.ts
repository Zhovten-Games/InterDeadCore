export type IdentityEventType =
  | "IDENTITY_LINKED"
  | "IDENTITY_UNLINKED"
  | "PROFILE_UPDATED";

export interface DomainEvent<TPayload = unknown> {
  readonly type: IdentityEventType;
  readonly occurredAt: Date;
  readonly payload: TPayload;
}

export interface DiscordLinkedPayload {
  readonly profileId: string;
  readonly discordId: string;
  readonly username: string;
}

export interface DiscordUnlinkedPayload {
  readonly profileId: string;
}

export interface ProfileUpdatedPayload {
  readonly profileId: string;
  readonly changes: Record<string, unknown>;
}

export const createEvent = <TPayload>(
  type: IdentityEventType,
  payload: TPayload,
  clock: () => Date = () => new Date(),
): DomainEvent<TPayload> => ({
  type,
  payload,
  occurredAt: clock(),
});
