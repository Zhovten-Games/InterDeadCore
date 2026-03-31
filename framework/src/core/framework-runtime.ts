import { JsObjectConfigSourceAdapter } from "../adapters/js-object-config-source-adapter.js";
import type {
  FrameworkConfig,
  MembraneConfig,
} from "../contracts/framework-config.js";
import type { FrameworkFeature } from "../contracts/framework-feature.js";
import { DecorativeTitleFeature } from "../features/decorative-title/decorative-title-feature.js";
import { MembraneFeature } from "../features/membrane/membrane-feature.js";
import type { ConfigSourcePort } from "../ports/config-source-port.js";
import { FeatureRegistry } from "./feature-registry.js";

export interface RuntimeOptions {
  windowRef?: Window;
  documentRef?: Document;
}

export class FrameworkRuntime {
  private readonly registry = new FeatureRegistry();
  private readonly features: FrameworkFeature[] = [];
  private config: FrameworkConfig = {};
  private booted = false;

  constructor(
    private readonly configSource: ConfigSourcePort,
    private readonly options: RuntimeOptions = {},
  ) {
    const windowRef = this.options.windowRef || window;
    const documentRef = this.options.documentRef || document;

    this.registry.register(
      "membrane",
      () => new MembraneFeature(windowRef, documentRef),
    );
    this.registry.register(
      "decorativeTitle",
      () => new DecorativeTitleFeature(windowRef, documentRef),
    );
  }

  boot(): void {
    if (this.booted) {
      return;
    }

    this.config = this.configSource.load();

    const windowRef = this.options.windowRef || window;
    const reducedMotionPreferred = windowRef.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;

    const reducedMode =
      this.config.featureOptions?.membrane?.reducedMotionMode || "minimal";
    if (reducedMotionPreferred && reducedMode === "disable") {
      this.config = {
        ...this.config,
        enabledFeatures: {
          ...this.config.enabledFeatures,
          membrane: false,
        },
      };
    }

    if (reducedMotionPreferred && reducedMode === "minimal") {
      this.applyMinimalMembraneProfile();
    }

    const instances = this.registry.createEnabled(
      this.config.enabledFeatures || {},
    );
    this.features.push(...instances);

    for (const feature of this.features) {
      feature.updateConfig(this.config);
      feature.mount();
    }

    this.booted = true;
  }

  destroy(): void {
    this.booted = false;
    while (this.features.length > 0) {
      const feature = this.features.pop();
      feature?.destroy();
    }
  }

  private applyMinimalMembraneProfile(): void {
    const membraneConfig = this.config.featureOptions?.membrane || {};
    const reducedConfig: MembraneConfig = {
      ...membraneConfig,
      lineCount: Math.max(
        8,
        Math.round((membraneConfig.lineCount || 18) * 0.55),
      ),
      amplitude: (membraneConfig.amplitude || 5) * 0.45,
      pulseDecay: Math.min(0.95, (membraneConfig.pulseDecay || 0.9) + 0.04),
    };

    this.config = {
      ...this.config,
      featureOptions: {
        ...this.config.featureOptions,
        membrane: reducedConfig,
      },
    };
  }
}

export function createInterdeadFramework(
  config: FrameworkConfig = {},
  options: RuntimeOptions = {},
): FrameworkRuntime {
  return new FrameworkRuntime(new JsObjectConfigSourceAdapter(config), options);
}
