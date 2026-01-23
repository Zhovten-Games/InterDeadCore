# InterDeadCore Documentation

InterDeadCore is a monorepo of domain packages. This documentation expands on the short README and keeps architecture, data contracts, and release operations in a single place so downstream repos can adopt the core without copying infrastructure assumptions.

## Architecture
- [Overview](architecture/overview.md)
- [Ports and events](architecture/ports-and-events.md)

## Packages
- [EFBD scale](packages/efbd-scale.md)
- [Identity core](packages/identity-core.md)

## Data contracts
- [D1 schemas](data/schemas.md)
- [KV conventions](data/kv-conventions.md)

## Release
- [Versioning and tags](release/versioning-and-tags.md)
- [Downstream upgrades](release/downstream-upgrades.md)

## Operations
- [Cloudflare bindings](operations/cloudflare-bindings.md)

## Deployment scope

InterDeadCore ships as npm packages; the deployment surface is release + publish. Hosting details (Workers, Pages, and runtime secrets) live in downstream applications such as InterDeadIT, which consume the published packages.
