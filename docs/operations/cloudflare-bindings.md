# Cloudflare bindings

InterDeadCore packages expect certain Cloudflare bindings when hosted in Workers or Pages functions. Align the binding names below with your deployment configuration.

## Required bindings

- **D1**: `INTERDEAD_CORE` for the shared database (`profiles` and `efbd_scale`).
- **KV**: `INTERDEAD_CORE_KV` for trigger logs and session state (if enabled).

## Environment variables

- `IDENTITY_DISCORD_CLIENT_ID`
- `IDENTITY_DISCORD_CLIENT_SECRET`
- `IDENTITY_DISCORD_REDIRECT_URI`

## Optional bindings

- Alternate D1 bindings for staging or localized testing.
- Custom KV namespaces for analytics retention experiments.

## Downstream notes (InterDeadIT)

- The InterDeadIT `interdead-auth` worker expects the KV binding name `IDENTITY_KV` for the same trigger-log persistence and caching behaviors.
