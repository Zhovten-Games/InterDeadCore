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

    const features = registry.createEnabled({ membrane: true, unknown: true });
    expect(features).toHaveLength(1);
    expect(features[0].key).toBe("membrane");
  });
});
