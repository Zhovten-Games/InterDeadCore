╭────────────────────────╮  ╭────────╮  ╭──────────╮
│ [Proto](../InterDeadProto) │  │  Core  │  │ [IT](../InterDeadIT) │
╰────────────────────────╯  ╰════════╯  ╰──────────╯

## Introduction

InterDeadCore is the monorepo that harmonizes the shared services of the metaverse once the prototype branched into independent packages. It keeps domain kernels decoupled from presentation, follows the hexagonal architecture, and ships reusable building blocks for identity, EFBD scoring, and auxiliary tooling.

## Installation

Each package is versioned and published independently. Refer to the package-level README files for installation commands:
- `efbd-scale`: D1/KV-aware EFBD scoring domain for adaptive horror design.
- `identity-core`: Discord-authenticated identity kernel with pluggable storage.

## Usage Examples

See the package READMEs for runnable snippets. A typical host registers the identity core and EFBD scale adapters in its IoC container, then wires presentation controllers in the site repo (`InterDeadIT`).

## Additional Notes

- The Fear Inversion Matrix reference is now kept in `wiki/fear_inversion_matrix.md` for easier cross-linking across packages.
- Aligns with the narrative and deployment orchestrated by the landing site (`InterDeadIT`) and the prototype lore (`InterDeadProto`).
- Contributions should preserve the ports-and-adapters layering to keep packages swappable across runtimes.
- Release flow: bump a package with `npm version patch`, create and push a tag matching the package name (for example `identity-core-v0.1.6` or `efbd-scale-v0.1.3`), and ask downstream repos to upgrade explicitly (e.g., `npm install @interdead/identity-core@0.1.6`).
- Shared D1 schema: the `profiles` table should exist with `profile_id TEXT PRIMARY KEY`, `data TEXT NOT NULL` (JSON identity aggregate plus auxiliary fields like `completedGames`), `last_cleanup_at TEXT`, `last_cleanup_timezone TEXT`, and `delete_count INTEGER DEFAULT 0`.
