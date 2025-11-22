import { describe, it, expect, vi } from "vitest";
import { IdentityLinkService } from "../src/application/IdentityLinkService.js";
import { LocalProfileRepositoryAdapter } from "../src/adapters/LocalProfileRepositoryAdapter.js";
import {
  ProfileMetadata,
  DiscordProfileLink,
} from "../src/domain/valueObjects.js";
import { IdentityAggregate } from "../src/core/IdentityAggregate.js";
import { DiscordLinkPolicy } from "../src/domain/policies/DiscordLinkPolicy.js";

const createLogger = () => ({
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

describe("IdentityLinkService", () => {
  it("links a Discord account and persists the aggregate", async () => {
    const repository = new LocalProfileRepositoryAdapter();
    const logger = createLogger();
    const discordPort = {
      exchangeCode: vi
        .fn()
        .mockResolvedValue(
          new DiscordProfileLink({ discordId: "123", username: "Echo" }),
        ),
    };
    const service = new IdentityLinkService(
      repository,
      discordPort,
      undefined,
      undefined,
      logger,
    );

    const metadata = new ProfileMetadata({
      profileId: "profile-1",
      displayName: "Player One",
    });
    await service.completeDiscordLogin("profile-1", "auth-code", metadata, {
      allowUsernameOverride: false,
    });

    const stored = await repository.findById("profile-1");
    expect(stored?.discordLink?.discordId).toBe("123");
    expect(logger.info).toHaveBeenCalled();
  });

  it("removes a Discord account and publishes events", async () => {
    const repository = new LocalProfileRepositoryAdapter();
    const logger = createLogger();
    const discordPort = {
      exchangeCode: vi
        .fn()
        .mockResolvedValue(
          new DiscordProfileLink({ discordId: "999", username: "Mind" }),
        ),
    };
    const events: ReturnType<IdentityAggregate["pullEvents"]> = [];
    const eventBus = {
      publish: vi.fn(async (payload) => events.push(...payload)),
    };

    const service = new IdentityLinkService(
      repository,
      discordPort,
      eventBus,
      undefined,
      logger,
    );
    const metadata = new ProfileMetadata({
      profileId: "profile-2",
      displayName: "Player Two",
    });
    await service.completeDiscordLogin("profile-2", "code", metadata, {
      allowUsernameOverride: true,
      policy: new DiscordLinkPolicy(),
    });
    await service.disconnect("profile-2");

    expect(events.some((evt) => evt.type === "IDENTITY_UNLINKED")).toBe(true);
  });
});
