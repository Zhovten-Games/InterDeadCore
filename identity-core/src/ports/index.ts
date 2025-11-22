import { IdentityStateProps } from "../core/IdentityAggregate.js";
import {
  DiscordProfileLink,
  ProfileMetadata,
  ScaleSnapshotRef,
} from "../domain/valueObjects.js";
import { DomainEvent } from "../domain/events.js";

export interface IDiscordOAuthPort {
  exchangeCode(code: string): Promise<DiscordProfileLink>;
}

export interface IIdentityRepository {
  findById(profileId: string): Promise<IdentityStateProps | undefined>;
  save(state: IdentityStateProps): Promise<void>;
  delete(profileId: string): Promise<void>;
}

export interface IProfileCompletionPort {
  requestMissingFields(
    metadata: ProfileMetadata,
  ): Promise<Partial<ProfileMetadata>>;
}

export interface IEventBusPort {
  publish(events: DomainEvent[]): Promise<void>;
}

export interface ISessionStore {
  set<T>(key: string, value: T): Promise<void>;
  get<T>(key: string): Promise<T | undefined>;
  delete(key: string): Promise<void>;
}

export interface IClock {
  now(): Date;
}

export interface ILogger {
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
}

export interface IScaleAdapter {
  attachSnapshot(profileId: string, snapshot: ScaleSnapshotRef): Promise<void>;
}
