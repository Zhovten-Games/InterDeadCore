import type { FrameworkFeature } from "../../contracts/framework-feature.js";
import type {
  FrameworkConfig,
  MembraneConfig,
} from "../../contracts/framework-config.js";
import { MembraneRenderer } from "./membrane-renderer.js";

export class MembraneFeature implements FrameworkFeature {
  readonly key = "membrane" as const;

  private animationFrame = 0;
  private canvas: HTMLCanvasElement | null = null;
  private renderer: MembraneRenderer | null = null;
  private boundInteractions: Array<{ node: Element; handler: EventListener }> =
    [];
  private config: MembraneConfig = {};
  private appliedBodyClass: string | null = null;

  constructor(
    private readonly windowRef: Window = window,
    private readonly documentRef: Document = document,
  ) {}

  mount(): void {
    if (this.canvas) {
      return;
    }

    this.canvas = this.documentRef.createElement("canvas");
    this.canvas.className = this.config.canvasClassName || "gm-membrane-canvas";
    this.documentRef.body.appendChild(this.canvas);

    this.renderer = new MembraneRenderer(this.canvas, this.windowRef);
    this.windowRef.addEventListener("resize", this.handleResize);
    this.bindInteractions();

    this.appliedBodyClass = this.config.activeBodyClass || "gm-membrane-active";
    this.documentRef.body.classList.add(this.appliedBodyClass);

    this.tick();
  }

  updateConfig(config: FrameworkConfig): void {
    this.config = config.featureOptions?.membrane || {};
  }

  destroy(): void {
    if (this.animationFrame) {
      this.windowRef.cancelAnimationFrame(this.animationFrame);
      this.animationFrame = 0;
    }

    this.windowRef.removeEventListener("resize", this.handleResize);
    this.unbindInteractions();
    this.canvas?.remove();
    this.canvas = null;
    this.renderer = null;

    if (this.appliedBodyClass) {
      this.documentRef.body.classList.remove(this.appliedBodyClass);
      this.appliedBodyClass = null;
    }
  }

  private readonly handleResize = (): void => {
    this.renderer?.resize();
  };

  private readonly tick = (): void => {
    this.animationFrame = this.windowRef.requestAnimationFrame(this.tick);
    this.renderer?.draw(this.windowRef.performance.now(), this.config);
  };

  private bindInteractions(): void {
    const selectors = this.config.interactionSelectors || [];
    const uniqueNodes = new Set<Element>();

    for (const selector of selectors) {
      for (const node of this.documentRef.querySelectorAll(selector)) {
        uniqueNodes.add(node);
      }
    }

    for (const node of uniqueNodes) {
      const handler = () => {
        const rect = (node as HTMLElement).getBoundingClientRect();
        this.renderer?.triggerPulse(
          (rect.left + rect.width * 0.5) / this.windowRef.innerWidth,
          (rect.top + rect.height * 0.5) / this.windowRef.innerHeight,
        );
      };

      node.addEventListener("mouseenter", handler);
      node.addEventListener("focus", handler);
      node.addEventListener("click", handler);
      node.addEventListener("touchstart", handler, { passive: true });
      this.boundInteractions.push({ node, handler });
    }
  }

  private unbindInteractions(): void {
    for (const bound of this.boundInteractions) {
      bound.node.removeEventListener("mouseenter", bound.handler);
      bound.node.removeEventListener("focus", bound.handler);
      bound.node.removeEventListener("click", bound.handler);
      bound.node.removeEventListener("touchstart", bound.handler);
    }

    this.boundInteractions = [];
  }
}
