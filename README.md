<pre>
╔═════════════════════════════════════════════════════════════════════════════╗
║                          INTERDEAD :: REPOSITORIES                          ║
╠═════════════════════════════════════════════════════════════════════════════╣
║                                                                             ║
║ ○ <a href="https://github.com/Zhovten-Games/InterDeadReferenceLibrary">InterDead Reference Library (public)</a>                                      ║
║   Public reference library: research, engineering standards and notes.      ║
║   Materials are prepared for reuse outside the private workspace.           ║
║                                                                             ║
║ ○ <a href="https://github.com/Zhovten-Games/InterDeadProto">InterDeadProto (NOIR)</a>                                                     ║
║   Narrative interface prototype: Nectosphere-Oriented Interface Relay.      ║
║   A browser application with its own verified distribution pipeline.        ║
║                                                                             ║
║ ○ <a href="https://github.com/Zhovten-Games/InterDeadIT">InterDeadIT (website / entry point)</a>                                       ║
║   The public website: localized articles, artifacts and project entry.      ║
║   Connects visitors with InterDead and the shared web-side services.        ║
║                                                                             ║
║ > <a href="https://github.com/Zhovten-Games/InterDeadCore">InterDeadCore (identity + EFBD)</a>                                           ║
║   Shared identity, EFBD scoring and interface contracts for the web.        ║
║   Published packages are consumed by the website and related tools.         ║
║                                                                             ║
║ ○ <a href="https://github.com/Zhovten-Games/PsyFramework">PsyFramework (research / tooling)</a>                                         ║
║   Configurable research and scoring tools supporting the project.           ║
║   Browser presentation and methodology data retain separate roles.          ║
║                                                                             ║
║ ○ <a href="https://github.com/Zhovten-Games/InterDead">InterDead (private game repository)</a>                                       ║
║   Portable C++20 narrative core, playable projections and Workshop.         ║
║   Private production sources retain their own publication boundary.         ║
║                                                                             ║
║ ○ <a href="https://github.com/Zhovten-Games/SPIDER">SPIDER (methodology / contracts)</a>                                          ║
║   Literary pseudocode for attributed intent and consistent projections.     ║
║   Public contracts connect the method with reviewed project examples.       ║
║                                                                             ║
╠═════════════════════════════════════════════════════════════════════════════╣
║                                INTERDEADCORE                                ║
╠═════════════════════════════════════════════════════════════════════════════╣
║ InterDeadCore supplies the identity, EFBD scoring and interface packages    ║
║ used across the project’s web surfaces. Each package maintains its own      ║
║ public contract and release version; the portable C++ game core belongs to  ║
║ InterDead.                                                                  ║
║                                                                             ║
╠═════════════════════════════════════════════════════════════════════════════╣
║                ECHO OF AN UNFADING MEMORY  /  INTERDEAD WIKI                ║
║                                                                             ║
║ <a href="https://interdead.zhovten.games/about/">ABOUT (EN)</a>                          <a href="https://interdead.fandom.com/wiki/InterDead_Wiki">WIKI (EN)</a>                               ║
║ <a href="https://interdead.zhovten.games/ru/about/">ABOUT (RU)</a>                          <a href="https://interdead.fandom.com/ru/wiki/Interdead_%D0%92%D0%B8%D0%BA%D0%B8">WIKI (RU)</a>                               ║
║ <a href="https://interdead.zhovten.games/uk/about/">ABOUT (UK)</a>                          <a href="https://interdead.fandom.com/uk/wiki/Main_Page">WIKI (UK)</a>                               ║
║ <a href="https://interdead.zhovten.games/ja/about/">ABOUT (JA)</a>                          <a href="https://interdead.fandom.com/ja/wiki/InterDead_Wiki">WIKI (JA)</a>                               ║
║                                                                             ║
╠═════════════════════════════════════════════════════════════════════════════╣
║                                   CONTACT                                   ║
║ <a href="https://www.linkedin.com/company/zhovten-games/">Zhovten Games — LinkedIn</a>                                                    ║
╚═════════════════════════════════════════════════════════════════════════════╝
</pre>

# InterDeadCore

Shared TypeScript identity, EFBD and UI framework packages.

[Governance](governance/README.md)

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

## Verification

Install the locked dependencies in `identity-core`, `efbd-scale` and `framework` with `npm ci`. Run `node tools/warden.mjs` from the repository root to test and build all three packages. Release workflows use the same check boundary.
