# Versioning and tags

InterDeadCore packages are versioned and published independently. Use semantic versioning for each package and tag releases so downstream repositories can track updates.

## Release flow

1. Update the package version using `npm version patch` (or `minor` / `major`) inside the package directory.
2. Build and test the package locally.
3. Create a git tag that includes the package name and version, for example:
   - `identity-core-v0.1.6`
   - `efbd-scale-v0.1.3`
4. Push the tag and publish the package.

## Why tags matter

Downstream repositories track specific tags to understand which package changed. In a monorepo, tags keep package releases explicit even when unrelated files share the same git history.
