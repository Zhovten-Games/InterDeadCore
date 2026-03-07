import { describe, expect, it } from "vitest";
import { HugoConfigSourceAdapter } from "../src/adapters/hugo-config-source-adapter.js";

describe("HugoConfigSourceAdapter", () => {
  it("returns empty config when marker is missing", () => {
    const documentRef = {
      querySelector: () => null,
    } as unknown as Document;

    const adapter = new HugoConfigSourceAdapter(documentRef);
    expect(adapter.load()).toEqual({});
  });

  it("maps data attributes into framework config", () => {
    const marker = {
      dataset: {
        frameworkMembrane: "true",
        frameworkMembraneSelectors: ".a, .b",
        frameworkMembraneCanvasClass: "custom-canvas",
        frameworkMembraneActiveClass: "custom-active",
        frameworkReducedMotionMode: "disable",
      },
    };

    const documentRef = {
      querySelector: () => marker,
    } as unknown as Document;

    const adapter = new HugoConfigSourceAdapter(documentRef);
    expect(adapter.load()).toEqual({
      enabledFeatures: { membrane: true },
      featureOptions: {
        membrane: {
          canvasClassName: "custom-canvas",
          activeBodyClass: "custom-active",
          interactionSelectors: [".a", ".b"],
          reducedMotionMode: "disable",
        },
      },
    });
  });

  it("prefers marker from body when body carries framework dataset", () => {
    const body = {
      hasAttribute: (name: string) => name === "data-interdead-framework",
      dataset: {
        frameworkMembrane: "false",
      },
    };

    const documentRef = {
      body,
      querySelector: () => ({
        dataset: { frameworkMembrane: "true" },
      }),
    } as unknown as Document;

    const adapter = new HugoConfigSourceAdapter(documentRef);
    expect(adapter.load().enabledFeatures?.membrane).toBe(false);
  });
});
