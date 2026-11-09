<pre>
╔════════════════════════════════════════════════════════════════════════════╗
║ INTERDEAD :: REPOSITORIES                                                  ║
╠════════════════════════════════════════════════════════════════════════════╣
║ ○ <a href="https://github.com/Zhovten-Games/InterDeadReferenceLibrary">InterDeadReferenceLibrary</a>                                                ║
║ ○ <a href="https://github.com/Zhovten-Games/InterDeadProto">InterDeadProto</a>                                                           ║
║ ○ <a href="https://github.com/Zhovten-Games/InterDeadIT">InterDeadIT</a>                                                              ║
║ ▶ <a href="https://github.com/Zhovten-Games/InterDeadCore">InterDeadCore</a>                                                            ║
║ ○ <a href="https://github.com/Zhovten-Games/PsyFramework">PsyFramework</a>                                                             ║
║ ○ <a href="https://github.com/Zhovten-Games/InterDead">InterDead</a> (private)                                                      ║
║ ○ <a href="https://github.com/Zhovten-Games/SPIDER">SPIDER</a>                                                                   ║
╚════════════════════════════════════════════════════════════════════════════╝
</pre>

# InterDeadCore

Shared TypeScript identity, EFBD and UI framework packages.

[Governance](governance/README.md) · [Technical registry](governance/ecosystem.json)

Packages:
- `@interdead/identity-core`: Discord-authenticated identity kernel with pluggable storage.
- `@interdead/efbd-scale`: EFBD scoring domain for adaptive horror design.
- `@interdead/framework`: modular UI framework runtime for host integrations (membrane first).

## Stack

- TypeScript domain packages
- Cloudflare Workers + D1 + KV (host-provided bindings)
- Hexagonal architecture with ports-and-adapters

## Local dev

- Install dependencies per package: `npm install` inside `identity-core/`, `efbd-scale/`, and `framework/`.
- Run tests per package: `npm test` (and `npm run typecheck` where available).

## Deployment (high-level)

- Packages are released independently from the monorepo.
- Downstream repositories (such as InterDeadIT) explicitly upgrade package versions.
- See release details in the documentation index below.

## Conventions

- Keep adapters thin and let domain services own the business logic.
- Use object-oriented aggregates and shared base errors to keep responsibilities separated.
- Preserve ports-and-adapters layering so packages remain swappable across runtimes.

## Engineering standards

Engineering standards: Canonical project-wide engineering ideals and development standards are maintained in the InterDead Reference Library (public): https://github.com/Zhovten-Games/InterDeadReferenceLibrary/tree/main/standards/development. This repository follows that canon; local notes here must not override or fork the shared standards.

## Docs

Start here: [docs/README.md](docs/README.md)

Key references:

- [Architecture overview](docs/architecture/overview.md)
- [Ports and events](docs/architecture/ports-and-events.md)
- [Data contracts](docs/data/schemas.md)
- [Release flow](docs/release/versioning-and-tags.md)

## Verification and domain migration

Run `node tools/warden.mjs` for the complete declared repository check corpus. The operator runbook and variable registry accompany the 2026-11-07 local migration delivery. Public site: https://interdead.zhovten.games/; prototype: https://noir.zhovten.games/. Cloudflare and Discord settings are applied separately from repository edits.
