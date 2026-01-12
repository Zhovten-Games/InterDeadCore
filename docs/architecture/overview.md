# Architecture overview

InterDeadCore contains the domain kernels that are shared across the InterDead ecosystem. Unlike InterDeadIT, which is a single website repository, Core is a monorepo where each package ships independently while still sharing the same architectural boundaries and data contracts.

## Principles

- **Hexagonal architecture**: domain services live at the center and communicate through ports that are implemented by adapters in host runtimes.
- **Object-oriented modeling**: aggregates encapsulate state, inheritance is reserved for shared domain behavior, and explicit interfaces define what adapters must provide.
- **Separation of tasks**: identity, EFBD scoring, and orchestration are kept in separate packages, each with its own service layer and persistence adapters.

## What Core owns

- Domain logic and services for identity and EFBD scoring.
- Ports and event contracts consumed by host applications.
- Canonical data shapes for D1 and KV storage.

## What Core does not own

- UI controllers, templates, or localized content.
- Deployment pipelines for the public website.
- Downstream orchestration code outside the core packages.

## Reference artifacts

The Fear Inversion Matrix is stored in the repository wiki at [`wiki/fear_inversion_matrix.md`](../../wiki/fear_inversion_matrix.md). Treat it as a reference asset that informs EFBD scoring and trigger definitions rather than an executable specification.
