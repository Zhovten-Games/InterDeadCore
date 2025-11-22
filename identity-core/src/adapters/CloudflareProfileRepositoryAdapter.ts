import { IdentityStateProps } from "../core/IdentityAggregate.js";
import { IIdentityRepository, ILogger } from "../ports/index.js";

export interface CloudflareBindings {
  readonly table: {
    execute: (
      query: string,
      params?: unknown[],
    ) => Promise<{ results?: unknown[] }>;
  };
  readonly kv?: {
    get: (key: string) => Promise<string | null>;
    put: (key: string, value: string) => Promise<void>;
  };
}

export class CloudflareProfileRepositoryAdapter implements IIdentityRepository {
  constructor(
    private readonly bindings: CloudflareBindings,
    private readonly logger: ILogger,
  ) {}

  async findById(profileId: string): Promise<IdentityStateProps | undefined> {
    const sql = "SELECT data FROM profiles WHERE profile_id = ? LIMIT 1";
    const result = await this.bindings.table.execute(sql, [profileId]);
    const row = result.results?.[0] as { data?: string } | undefined;
    if (row?.data) {
      return JSON.parse(row.data) as IdentityStateProps;
    }
    const cache = await this.bindings.kv?.get(`identity:${profileId}`);
    return cache ? (JSON.parse(cache) as IdentityStateProps) : undefined;
  }

  async save(state: IdentityStateProps): Promise<void> {
    const payload = JSON.stringify(state);
    await this.bindings.table.execute(
      "INSERT OR REPLACE INTO profiles (profile_id, data) VALUES (?, ?)",
      [state.metadata.profileId, payload],
    );
    await this.bindings.kv?.put(
      `identity:${state.metadata.profileId}`,
      payload,
    );
    this.logger.info("Persisted profile to Cloudflare", {
      profileId: state.metadata.profileId,
    });
  }

  async delete(profileId: string): Promise<void> {
    await this.bindings.table.execute(
      "DELETE FROM profiles WHERE profile_id = ?",
      [profileId],
    );
    await this.bindings.kv?.put(`identity:${profileId}`, "");
    this.logger.warn("Deleted profile from Cloudflare", { profileId });
  }
}
