import type {
  FrameworkFeatureFlags,
  FrameworkFeatureKey,
} from "../contracts/framework-config.js";
import type { FrameworkFeature } from "../contracts/framework-feature.js";

export class FeatureRegistry {
  private readonly factories = new Map<
    FrameworkFeatureKey,
    () => FrameworkFeature
  >();

  register(key: FrameworkFeatureKey, factory: () => FrameworkFeature): void {
    this.factories.set(key, factory);
  }

  createEnabled(config: FrameworkFeatureFlags = {}): FrameworkFeature[] {
    const features: FrameworkFeature[] = [];
    const keys = Object.keys(config) as FrameworkFeatureKey[];

    for (const key of keys) {
      if (!config[key]) {
        continue;
      }

      const factory = this.factories.get(key);
      if (!factory) {
        continue;
      }

      features.push(factory());
    }

    return features;
  }
}
