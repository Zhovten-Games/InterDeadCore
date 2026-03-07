export type FrameworkFeatureKey = "membrane";

export type ReducedMotionMode = "disable" | "minimal" | "full";

export interface MembraneConfig {
  canvasClassName?: string;
  activeBodyClass?: string;
  interactionSelectors?: string[];
  lineCount?: number;
  lineColor?: string;
  pulseColor?: string;
  pulseDecay?: number;
  amplitude?: number;
  reducedMotionMode?: ReducedMotionMode;
}

export type FrameworkFeatureFlags = Partial<
  Record<FrameworkFeatureKey, boolean>
>;

export interface FrameworkFeatureOptions {
  membrane?: MembraneConfig;
}

export interface FrameworkConfig {
  enabledFeatures?: FrameworkFeatureFlags;
  featureOptions?: FrameworkFeatureOptions;
}
