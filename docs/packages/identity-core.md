# Identity core package

`@interdead/identity-core` is the headless identity kernel that wires Discord OAuth with pluggable storage adapters. It keeps presentation concerns out of the core while exposing services and factories that host applications can register in their own containers.

## Responsibilities

- Authenticate players via Discord OAuth.
- Maintain the profile aggregate that stores identity metadata.
- Emit events for downstream services (EFBD scale, UI, analytics).

## Key services

- `createIdentityCore` factory that composes domain services and adapters.
- `LinkService` for OAuth entry and completion flows.
- `ProfileMetadata` aggregate for player identity state.

## Expected adapters

- OAuth adapter for Discord (or custom OAuth provider in staging).
- Profile repository adapter backed by D1 or equivalent storage.
- Session store adapter for OAuth state and nonce persistence.
- Event bus and logger adapters for runtime integration.

## Integration notes

- Store OAuth credentials in environment variables.
- Use adapters to enforce task separation between domain logic and platform-specific infrastructure.
- Review the D1 schema details in [Data contracts](../data/schemas.md).
