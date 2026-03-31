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
        frameworkMembranePulseEvent: "custom:pulse",
        frameworkReducedMotionMode: "disable",
        frameworkDecorativeTitle: "true",
        frameworkDecorativeTitleSelectors: "h1, .hero__title",
        frameworkDecorativeTitlePulseEvent: "custom:pulse",
        frameworkDecorativeTitlePulseMs: "180",
        frameworkDecorativeTitleFontEn: '"Cinzel", serif',
        frameworkDecorativeTitleFontDefault: '"Inter", sans-serif',
        frameworkDecorativeTitlePatternPrimary: "PRIMARY-LINE",
        frameworkDecorativeTitlePatternSecondary: "SECONDARY-LINE",
      },
    };

    const documentRef = {
      querySelector: () => marker,
    } as unknown as Document;

    const adapter = new HugoConfigSourceAdapter(documentRef);
    expect(adapter.load()).toEqual({
      enabledFeatures: { membrane: true, decorativeTitle: true },
      featureOptions: {
        membrane: {
          canvasClassName: "custom-canvas",
          activeBodyClass: "custom-active",
          interactionSelectors: [".a", ".b"],
          reducedMotionMode: "disable",
          pulseEventName: "custom:pulse",
        },
        decorativeTitle: {
          selectors: ["h1", ".hero__title"],
          membranePulseEventName: "custom:pulse",
          pulseHighlightDurationMs: 180,
          localeFontFamilies: {
            default: '"Inter", sans-serif',
            en: '"Cinzel", serif',
            ru: "var(--font-heading)",
            uk: "var(--font-heading)",
            ja: "var(--font-heading)",
          },
          patternPrimaryText: "PRIMARY-LINE",
          patternSecondaryText: "SECONDARY-LINE",
        },
      },
    });
  });

  it("uses safe defaults for decorative title selectors and fonts", () => {
    const marker = {
      dataset: {
        frameworkDecorativeTitle: "true",
      },
    };

    const documentRef = {
      querySelector: () => marker,
    } as unknown as Document;

    const adapter = new HugoConfigSourceAdapter(documentRef);
    expect(adapter.load().featureOptions?.decorativeTitle).toEqual({
      selectors: ["[data-decorative-title]"],
      membranePulseEventName: "interdead:membrane-pulse",
      pulseHighlightDurationMs: 220,
      localeFontFamilies: {
        default: "var(--font-heading)",
        en: '"Pirata One", system-ui',
        ru: "var(--font-heading)",
        uk: "var(--font-heading)",
        ja: "var(--font-heading)",
      },
      patternPrimaryText: undefined,
      patternSecondaryText: undefined,
    });
  });

  it("prefers marker from body when body carries framework dataset", () => {
    const body = {
      hasAttribute: (name: string) => name === "data-interdead-framework",
      dataset: {
        frameworkMembrane: "false",
        frameworkDecorativeTitle: "true",
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
    expect(adapter.load().enabledFeatures?.decorativeTitle).toBe(true);
  });
});
