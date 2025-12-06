╭────────────────────────╮  ╭────────╮  ╭──────────╮
│ [Proto](../../InterDeadProto) │  │  Core  │  │ [IT](../../InterDeadIT) │
╰────────────────────────╯  ╰════════╯  ╰──────────╯

## Introduction

`@interdead/identity-core` is a headless identity kernel that wires Discord OAuth with portable storage adapters using a hexagonal/ports-and-adapters layout. The package keeps presentation concerns out of the core while exposing services and factories that host applications can register in their own containers.

## Installation

```bash
npm install @interdead/identity-core
```

## Usage Examples

```ts
import { createIdentityCore, ProfileMetadata } from '@interdead/identity-core';

const identity = createIdentityCore({
  discord: {
    clientId: process.env.IDENTITY_DISCORD_CLIENT_ID!,
    clientSecret: process.env.IDENTITY_DISCORD_CLIENT_SECRET!,
    redirectUri: process.env.IDENTITY_DISCORD_REDIRECT_URI!
  },
  cloudflare: bindings,
  sessionStore,
  eventBus,
  logger
});

const profile = new ProfileMetadata({ profileId: 'player-123', displayName: 'Visitor' });
await identity.linkService.beginDiscordLogin('discord_state', 'nonce');
const aggregate = await identity.linkService.completeDiscordLogin('player-123', 'code-from-callback', profile);
```

## Additional Notes

- Features: Discord login with optional Cloudflare persistence or local-only storage; domain-driven aggregate tracking; ports for prompts, events, and EFBD scale sync; factory helper `createIdentityCore` to wire services quickly.
- Configuration:
  - **Discord**: provide OAuth client credentials and redirect URI via `IDENTITY_DISCORD_CLIENT_ID`, `IDENTITY_DISCORD_CLIENT_SECRET`, and `IDENTITY_DISCORD_REDIRECT_URI`. Custom endpoints are supported for staging.
  - **Cloudflare**: D1 database name `interdead_core` with shared Worker binding `INTERDEAD_CORE`; pass D1/KV bindings to enable persistence. Omit to rely on in-memory local storage.
  - **Feature flags**: skip Discord or scale synchronization by omitting those adapters when calling `createIdentityCore`.
- Cloudflare schema:

```sql
CREATE TABLE profiles (
  profile_id TEXT PRIMARY KEY,
  data TEXT NOT NULL
);
```

- Testing: `npm test`.
- Errors are wrapped in `IdentityCoreError` to avoid leaking raw fetch/D1 exceptions. Consumers can catch and map these errors to UI states.
