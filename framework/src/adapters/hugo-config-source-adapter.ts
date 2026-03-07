import type {
  FrameworkConfig,
  MembraneConfig,
} from "../contracts/framework-config.js";
import type { ConfigSourcePort } from "../ports/config-source-port.js";

const DEFAULT_SELECTORS = [
  "[data-modal-trigger]",
  "[data-cta-anchor]",
  "[data-auth-button]",
  ".gm-slider__arrow",
];

export class HugoConfigSourceAdapter implements ConfigSourcePort {
  constructor(private readonly documentRef: Document = document) {}

  load(): FrameworkConfig {
    const bodyMarker = this.documentRef.body?.hasAttribute(
      "data-interdead-framework",
    )
      ? this.documentRef.body
      : null;
    const marker =
      bodyMarker ||
      this.documentRef.querySelector<HTMLElement>("[data-interdead-framework]");

    if (!marker) {
      return {};
    }

    const membraneEnabled = marker.dataset.frameworkMembrane !== "false";
    const selectors = marker.dataset.frameworkMembraneSelectors
      ? marker.dataset.frameworkMembraneSelectors
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : DEFAULT_SELECTORS;

    const membraneConfig: MembraneConfig = {
      canvasClassName:
        marker.dataset.frameworkMembraneCanvasClass || "gm-membrane-canvas",
      activeBodyClass:
        marker.dataset.frameworkMembraneActiveClass || "gm-membrane-active",
      interactionSelectors: selectors,
      reducedMotionMode:
        marker.dataset.frameworkReducedMotionMode === "disable"
          ? "disable"
          : marker.dataset.frameworkReducedMotionMode === "full"
            ? "full"
            : "minimal",
    };

    return {
      enabledFeatures: {
        membrane: membraneEnabled,
      },
      featureOptions: {
        membrane: membraneConfig,
      },
    };
  }
}
