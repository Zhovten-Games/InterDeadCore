<pre>
╔═════════════════════════════════════════════════════════════════════╗
║                     INTERDEAD :: REPOSITORIES                       ║
╠═════════════════════════════════════════════════════════════════════╣
║ ○ <a href="https://github.com/Zhovten-Games/InterDeadReferenceLibrary">InterDead Reference Library (public)</a>                              ║
║   Public reference library: documents and notes that are safe       ║
║   to share outside the private workspace.                           ║
║                                                                     ║
║ ○ <a href="https://github.com/Zhovten-Games/InterDeadProto">InterDeadProto (NOIR)</a>                                             ║
║   InterDeadProto is a narrative-driven interface prototype.         ║
║   NOIR: Nectosphere-Oriented Interface Relay.                       ║
║                                                                     ║
║ ○ <a href="https://github.com/Zhovten-Games/InterDeadIT">InterDeadIT (website / entry point)</a>                               ║
║   The website: the public entry point into the InterDead meta-verse.║
║   Hosts the “About” and related public-facing materials.            ║
║                                                                     ║
║ > InterDeadCore (identity + EFBD core)                              ║
║   Core modules used by the website: identity/auth and EFBD logic.   ║
║   Published as packages and consumed by InterDeadIT.                ║
║                                                                     ║
║ ○ <a href="https://github.com/Zhovten-Games/PsyFramework">PsyFramework</a> (research / tooling)                                 ║
║   Research and tooling repo referenced by the project; supporting   ║
║   framework work that may be mentioned from public docs.            ║
╠═════════════════════════════════════════════════════════════════════╣
║                           INTERDEADCORE                             ║
║═════════════════════════════════════════════════════════════════════║
║ InterDeadCore is the monorepo for shared InterDead domain packages. ║
║ It keeps identity and EFBD scoring logic decoupled from             ║
║ presentation, follows hexagonal architecture boundaries, and        ║
║ ships reusable building blocks for downstream runtimes. Each        ║
║ package is versioned independently, while the repository maintains  ║
║ shared data contracts and operational notes so adapters remain      ║
║ consistent across deployments. This layout differs from InterDeadIT,║
║ which hosts a single website surface while consuming these packages ║
║ as dependencies.                                                    ║
║═════════════════════════════════╦═══════════════════════════════════║
║    ECHO OF AN UNFADING MEMORY   ║   INTERDEAD WIKI (ALL LANGUAGES)  ║
╠═════════════════════════════════╬═══════════════════════════════════╣
║ <a href="https://interdead.phantom-draft.com/about/">READ (EN)</a>                       ║ <a href="https://interdead.fandom.com/wiki/InterDead_Wiki">READ (EN)</a>                         ║
╠═════════════════════════════════╬═══════════════════════════════════╣
║ <a href="https://interdead.phantom-draft.com/ru/about/">READ (RU)</a>                       ║ <a href="https://interdead.fandom.com/ru/wiki/Interdead_%D0%92%D0%B8%D0%BA%D0%B8">READ (RU)</a>                         ║
╠═════════════════════════════════╬═══════════════════════════════════╣
║ <a href="https://interdead.phantom-draft.com/uk/about/">READ (UK)</a>                       ║ <a href="https://interdead.fandom.com/uk/wiki/Main_Page">READ (UK)</a>                         ║
╠═════════════════════════════════╬═══════════════════════════════════╣
║ <a href="https://interdead.phantom-draft.com/ja/about/">READ (JA)</a>                       ║ <a href="https://interdead.fandom.com/ja/wiki/InterDead_Wiki">READ (JA)</a>                         ║
║═════════════════════════════════╩═══════════════════════════════════║
║                            CONTACT                                  ║
╠═════════════════════════════════════════════════════════════════════╣
║ <a href="https://www.linkedin.com/company/zhovten-games/">Zhovten Games — LinkedIn</a>                                            ║
╚═════════════════════════════════════════════════════════════════════╝
</pre>

Packages:
- `@interdead/identity-core`: Discord-authenticated identity kernel with pluggable storage.
- `@interdead/efbd-scale`: EFBD scoring domain for adaptive horror design.

## Stack

- TypeScript domain packages
- Cloudflare Workers + D1 + KV (host-provided bindings)
- Hexagonal architecture with ports-and-adapters

## Local dev

- Install dependencies per package: `npm install` inside `identity-core/` and `efbd-scale/`.
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
