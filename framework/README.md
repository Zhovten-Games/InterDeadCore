## Introduction

`@interdead/framework` is the shared UI runtime package for InterDead hosts. It provides a modular feature registry and a stable API for enabling only the needed interactive effects.

Current shipped feature set:

- `membrane` (interactive horizontal membrane lines with hover/click/touch/focus pulse reaction).

## Installation

```bash
npm install @interdead/framework
```

## Build targets

The package builds in three formats:

- ESM: `dist/esm`
- CJS: `dist/cjs`
- Browser global bundle: `dist/browser/interdead-framework.global.js` (`window.InterdeadFramework`)

## Usage (JavaScript host / InterDeadProto style)

```ts
import {
  FrameworkRuntime,
  JsObjectConfigSourceAdapter,
} from '@interdead/framework';

const runtime = new FrameworkRuntime(
  new JsObjectConfigSourceAdapter({
    enabledFeatures: { membrane: true },
    featureOptions: {
      membrane: {
        interactionSelectors: ['button', '[data-action]'],
        activeBodyClass: 'proto-membrane-active',
        canvasClassName: 'proto-membrane-canvas',
        reducedMotionMode: 'minimal',
      },
    },
  }),
);

runtime.boot();
```

## Usage (Hugo host / InterDeadIT style)

```ts
import { FrameworkRuntime, HugoConfigSourceAdapter } from '@interdead/framework';

const runtime = new FrameworkRuntime(new HugoConfigSourceAdapter(document));
runtime.boot();
```

Provide config marker in HTML (recommended on `<body>`):

```html
<body
  data-interdead-framework="true"
  data-framework-membrane="true"
  data-framework-membrane-selectors="[data-modal-trigger], [data-auth-button], .gm-slider__arrow"
  data-framework-reduced-motion-mode="minimal"
></body>
```

## Reduced motion

- `disable`: do not mount the feature when `prefers-reduced-motion: reduce` is active.
- `minimal`: mount with reduced membrane profile (lower line count and amplitude).
- `full`: mount with unchanged profile.

## API

- `createInterdeadFramework(config, options)`
- `FrameworkRuntime` (`boot`, `destroy`)
- `HugoConfigSourceAdapter`
- `JsObjectConfigSourceAdapter`

## Release

- Tag format: `framework-v0.1.0`
- Build and tests:
  - `npm run build`
  - `npm test`
