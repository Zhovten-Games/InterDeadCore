import { describe, expect, it } from "vitest";
import { FeatureRegistry } from "../src/core/feature-registry.js";

describe("FeatureRegistry", () => {
  it("creates only enabled and registered features", () => {
    const registry = new FeatureRegistry();
    registry.register("membrane", () => ({
      key: "membrane",
      mount: () => {},
      updateConfig: () => {},
      destroy: () => {},
    }));
    registry.register("decorativeTitle", () => ({
      key: "decorativeTitle",
      mount: () => {},
      updateConfig: () => {},
      destroy: () => {},
    }));

    const features = registry.createEnabled({
      membrane: true,
      decorativeTitle: true,
      unknown: true,
    });
    expect(features).toHaveLength(2);
    expect(features[0].key).toBe("membrane");
    expect(features[1].key).toBe("decorativeTitle");
  });
});
