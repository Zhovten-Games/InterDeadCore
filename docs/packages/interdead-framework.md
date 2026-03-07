# InterDead framework package

`@interdead/framework` is a modular UI runtime package intended for host applications such as InterDeadIT (Hugo) and InterDeadProto (JavaScript application shell).

## Current features

- `membrane`: canvas-based horizontal line membrane with hover/click/touch/focus pulse reaction.

## Core API

- `createInterdeadFramework(config, options)`
- `FrameworkRuntime` (`boot`, `destroy`)
- `HugoConfigSourceAdapter`
- `JsObjectConfigSourceAdapter`

## Configuration model

The runtime is configuration-driven and supports selective feature loading.

```ts
{
  enabledFeatures: {
    membrane: true,
  },
  featureOptions: {
    membrane: {
      interactionSelectors: ['button', '[data-action]'],
      reducedMotionMode: 'minimal',
    },
  },
}
```

## Integration targets

- InterDeadIT: adapter-based configuration through `HugoConfigSourceAdapter` (marker on `body` is canonical).
- InterDeadProto: adapter-based configuration through `JsObjectConfigSourceAdapter`.

## Accessibility

Reduced-motion behavior:

- `disable`: skip runtime mount.
- `minimal`: apply reduced membrane profile.
- `full`: run with unchanged profile.

## Release by tag

Framework package releases are triggered by Git tags in the format `framework-vX.Y.Z`.

1. Update `InterDeadCore/framework/package.json` version.
2. Run local validation: `npm ci`, `npm run format:check`, `npm test`, `npm run build`.
3. Create and push the tag, for example: `framework-v0.1.0`.
4. GitHub Actions workflow `.github/workflows/framework-release.yml` validates the tag version against `package.json` and publishes to npm.

Manual pipeline checks can be run with `workflow_dispatch` using dry-run mode (`npm publish --dry-run`).
