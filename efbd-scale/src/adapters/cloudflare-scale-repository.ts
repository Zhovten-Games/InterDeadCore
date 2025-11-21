import { ALL_AXIS_CODES, AxisCode } from "../core/axis-code.js";
import { AxisScore } from "../core/axis-score.js";
import { ScaleSnapshot } from "../core/scale-snapshot.js";
import { IScaleRepository } from "../ports/outbound/scale-repository.js";

interface D1PreparedStatement<T = unknown> {
  bind(...values: unknown[]): D1PreparedStatement<T>;
  all(): Promise<{ results: T[] }>;
  run(): Promise<void>;
}

export interface D1Database {
  prepare<T = unknown>(statement: string): D1PreparedStatement<T>;
}

export interface ScaleTableRow {
  profile_id: string;
  axis_code: string;
  score: number;
  trigger_source: string | null;
  updated_at: string;
}

export class CloudflareScaleRepositoryAdapter implements IScaleRepository {
  constructor(private readonly database: D1Database) {}

  async getSnapshot(profileId: string): Promise<ScaleSnapshot | null> {
    const statement = this.database
      .prepare<ScaleTableRow>(
        "SELECT profile_id, axis_code, score, trigger_source, updated_at FROM efbd_scale WHERE profile_id = ?"
      )
      .bind(profileId);
    const { results } = await statement.all();
    if (!results || results.length === 0) {
      return null;
    }
    const axisScores = new Map<AxisCode, AxisScore>();
    for (const row of results) {
      if (!ALL_AXIS_CODES.includes(row.axis_code as AxisCode)) {
        continue;
      }
      axisScores.set(
        row.axis_code as AxisCode,
        new AxisScore({
          axis: row.axis_code as AxisCode,
          value: row.score,
          lastTriggerSource: row.trigger_source ?? undefined,
          lastUpdated: new Date(row.updated_at)
        })
      );
    }
    return new ScaleSnapshot({ profileId, axisScores, updatedAt: new Date(results[0].updated_at) });
  }

  async saveSnapshot(snapshot: ScaleSnapshot): Promise<void> {
    for (const [axis, score] of snapshot.axisScores.entries()) {
      const statement = this.database
        .prepare(
          "INSERT OR REPLACE INTO efbd_scale (profile_id, axis_code, score, trigger_source, updated_at) VALUES (?, ?, ?, ?, ?)"
        )
        .bind(
          snapshot.profileId,
          axis,
          score.value,
          score.lastTriggerSource ?? null,
          score.lastUpdated.toISOString()
        );
      await statement.run();
    }
  }
}
