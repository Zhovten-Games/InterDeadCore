import { AxisCode } from "./axis-code.js";

export interface AxisScoreProps {
  axis: AxisCode;
  value: number;
  lastUpdated: Date;
  lastTriggerSource?: string;
}

export class AxisScore {
  public readonly axis: AxisCode;
  public readonly value: number;
  public readonly lastUpdated: Date;
  public readonly lastTriggerSource?: string;

  constructor(props: AxisScoreProps) {
    if (props.value < 0 || props.value > 100) {
      throw new Error(`Axis score must be between 0 and 100 for ${props.axis}`);
    }
    this.axis = props.axis;
    this.value = props.value;
    this.lastUpdated = props.lastUpdated;
    this.lastTriggerSource = props.lastTriggerSource;
  }

  public increment(amount: number, source: string, at: Date): AxisScore {
    const nextValue = Math.min(100, this.value + amount);
    return new AxisScore({
      axis: this.axis,
      value: nextValue,
      lastUpdated: at,
      lastTriggerSource: source
    });
  }
}
