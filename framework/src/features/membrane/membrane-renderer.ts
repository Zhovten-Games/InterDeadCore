import type { MembraneConfig } from "../../contracts/framework-config.js";

const DEFAULT_CONFIG: Required<
  Pick<
    MembraneConfig,
    "lineCount" | "lineColor" | "pulseColor" | "pulseDecay" | "amplitude"
  >
> = {
  lineCount: 18,
  lineColor: "rgba(138, 229, 144, 0.26)",
  pulseColor: "rgba(198, 110, 72, 0.45)",
  pulseDecay: 0.9,
  amplitude: 5,
};

export class MembraneRenderer {
  private readonly ctx: CanvasRenderingContext2D;
  private width = 0;
  private height = 0;
  private pulse = 0;
  private pulseX = 0.5;
  private pulseY = 0.5;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly windowRef: Window,
  ) {
    const context = this.canvas.getContext("2d");
    if (!context) {
      throw new Error("MembraneRenderer requires 2D canvas context.");
    }

    this.ctx = context;
    this.resize();
  }

  resize(): void {
    this.width = this.windowRef.innerWidth;
    this.height = this.windowRef.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  triggerPulse(xRatio: number, yRatio: number): void {
    this.pulse = 1;
    this.pulseX = Math.min(1, Math.max(0, xRatio));
    this.pulseY = Math.min(1, Math.max(0, yRatio));
  }

  draw(time: number, config: MembraneConfig = {}): void {
    const merged = { ...DEFAULT_CONFIG, ...config };
    const { lineCount, lineColor, pulseColor, pulseDecay, amplitude } = merged;
    this.pulse *= pulseDecay;

    this.ctx.clearRect(0, 0, this.width, this.height);
    const phase = time * 0.0012;

    for (let index = 0; index < lineCount; index += 1) {
      const y = ((index + 1) / (lineCount + 1)) * this.height;
      const distance = Math.abs(y - this.height * this.pulseY) / this.height;
      const pulseWeight = Math.max(0, 1 - distance * 3) * this.pulse;
      const wobble =
        Math.sin(phase + index * 0.54) * amplitude * (0.3 + pulseWeight);

      const gradient = this.ctx.createLinearGradient(0, y, this.width, y);
      gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
      gradient.addColorStop(0.5, pulseWeight > 0.01 ? pulseColor : lineColor);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 1 + pulseWeight * 2;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y + wobble);
      this.ctx.lineTo(this.width, y - wobble * 0.2);
      this.ctx.stroke();
    }

    this.ctx.lineWidth = 1;
  }
}
