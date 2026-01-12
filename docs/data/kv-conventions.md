# KV conventions

The EFBD scale package can persist trigger logs to KV for analytics or replay. Use a predictable key format so downstream systems can enumerate and expire entries safely.

## Trigger log key format

```
efbd-trigger-log:{profileId}:{timestamp}:{axis}
```

- `profileId`: the profile identifier.
- `timestamp`: ISO or epoch timestamp (consistent with the ingestion clock).
- `axis`: one of the `EBF-*` axis codes.

## Retention recommendations

- Retain trigger logs only as long as analytics requires.
- Consider a TTL aligned with downstream reporting windows (for example, 30–90 days).
