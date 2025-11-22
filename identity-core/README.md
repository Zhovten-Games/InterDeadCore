# @interdead/identity-core

Headless identity kernel that wires Discord OAuth with portable storage adapters using a hexagonal/ports-and-adapters layout. The package keeps presentation concerns out of the core while exposing services and factories that host applications can register in their own containers.

## Features
- Discord login with optional Cloudflare persistence or local-only storage.
- Domain-driven aggregate tracking profile metadata, Discord linkage, and EFBD scale references.
- Ports for profile completion prompts, event bus notifications, and optional EFBD scale sync.
- Factory helper `createIdentityCore` to quickly wire the services based on runtime capabilities.

## Installation
```
npm install @interdead/identity-core
```

## Usage
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

## Configuration
- **Discord**: provide OAuth client credentials and redirect URI via `IDENTITY_DISCORD_CLIENT_ID`, `IDENTITY_DISCORD_CLIENT_SECRET`, and `IDENTITY_DISCORD_REDIRECT_URI`. Custom endpoints are supported for staging.
- **Cloudflare**: D1 database name `interdead_core` with shared Worker binding `INTERDEAD_CORE`; pass D1/KV bindings to enable persistence. Omit to rely on in-memory local storage.
- **Feature flags**: skip Discord or scale synchronization by omitting those adapters when calling `createIdentityCore`.

## Cloudflare schema
```
CREATE TABLE profiles (
  profile_id TEXT PRIMARY KEY,
  data TEXT NOT NULL
);
```

## Testing
```
npm test
```

## Error handling
Errors are wrapped in `IdentityCoreError` to avoid leaking raw fetch/D1 exceptions. Consumers can catch and map these errors to UI states.
