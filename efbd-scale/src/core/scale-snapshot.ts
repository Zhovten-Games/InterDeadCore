import { ALL_AXIS_CODES, AxisCode } from "./axis-code.js";
import { AxisScore } from "./axis-score.js";

export interface ScaleSnapshotProps {
  profileId: string;
  axisScores: Map<AxisCode, AxisScore>;
  updatedAt: Date;
}

export class ScaleSnapshot {
  public readonly profileId: string;
  public readonly axisScores: Map<AxisCode, AxisScore>;
  public readonly updatedAt: Date;

  constructor(props: ScaleSnapshotProps) {
    this.profileId = props.profileId;
    this.axisScores = props.axisScores;
    this.updatedAt = props.updatedAt;
  }

  public static createEmpty(profileId: string, at: Date): ScaleSnapshot {
    const scores = new Map<AxisCode, AxisScore>();
    ALL_AXIS_CODES.forEach((axis) => {
      scores.set(
        axis,
        new AxisScore({ axis, value: 0, lastUpdated: at, lastTriggerSource: undefined })
      );
    });
    return new ScaleSnapshot({ profileId, axisScores: scores, updatedAt: at });
  }

  public withIncrementedAxis(axis: AxisCode, amount: number, source: string, at: Date): ScaleSnapshot {
    const scores = new Map(this.axisScores);
    const current = scores.get(axis);
    if (!current) {
      throw new Error(`Axis ${axis} missing from snapshot`);
    }
    scores.set(axis, current.increment(amount, source, at));
    return new ScaleSnapshot({ profileId: this.profileId, axisScores: scores, updatedAt: at });
  }
}
