# npm token management for releases

This note explains how npm tokens are used by InterDeadCore GitHub Actions workflows.

## Where token is used

Release workflows publish packages to npm using a repository secret named `NPM_TOKEN`.

- `.github/workflows/efbd-scale-release.yml`
- `.github/workflows/identity-core-release.yml`

In both workflows, the publish step sets:

```yaml
env:
  NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

This means GitHub Actions reads the token value from repository secrets and injects it for `npm publish`.

## Does token name in npm matter?

No. The display name of a granular token in npm UI is just metadata for humans.

- You can create a new token with the same name for clarity.
- You can also create it with a different name.
- What matters for CI is updating GitHub secret `NPM_TOKEN` with the new token value.

## Is this token for build or publish?

For this repository it is for publish, not for regular CI build/test jobs.

- CI workflows (`*-ci.yml`) run install/test/build and do not use `NPM_TOKEN`.
- Release workflows (`*-release.yml`) publish to npm and require `NPM_TOKEN`.

## Recommended permissions for granular token

Grant the minimum required scope:

1. Package publish permission for the specific `@interdead/*` package(s).
2. Optional package read permission if needed by other automation.
3. Short expiration and rotation policy.

After creating a replacement token:

1. Open GitHub repository settings → Secrets and variables → Actions.
2. Replace `NPM_TOKEN` value.
3. Trigger a release workflow with a test tag to validate publish.
