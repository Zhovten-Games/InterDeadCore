# Downstream upgrades

InterDeadIT and other downstream repositories explicitly install core packages. After publishing a new version, update downstream packages intentionally to avoid unplanned changes.

## Recommended workflow

1. Announce the new core package version to downstream maintainers.
2. Update the dependency in the downstream repo, for example:
   ```bash
   npm install @interdead/identity-core@0.1.6
   ```
3. Verify that runtime adapters still satisfy the ports in the updated package.
4. Run downstream test and deployment checks.

## Monorepo note

Because InterDeadCore is a monorepo, tags and release notes are the primary signals for downstream teams. Avoid assuming that every commit is ready for consumption outside the core packages.
