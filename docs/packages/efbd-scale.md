# EFBD scale package

`@interdead/efbd-scale` is the EFBD (Echoed Big Five of Dread) scale package. It ingests triggers from mini-games, persists axis scores, and exposes query helpers for host runtimes.

## Responsibilities

- Ingest EFBD triggers per profile and update axis scores.
- Clamp scores to maintain consistent bounds.
- Provide query services for snapshots and axis inspection.

## Axis codes

- `EBF-SOCIAL`
- `EBF-MIND`
- `EBF-DECLINE`
- `EBF-EXPOSURE`
- `EBF-ABANDON`

The hyphenated strings above are the canonical persisted codes. TypeScript uses underscore enum identifiers (for example, `AxisCode.EBF_SOCIAL`) while the enum values remain the hyphenated strings (for example, `"EBF-SOCIAL"`).

## Key services

- `ScaleIngestionService` for ingesting triggers.
- `ScaleQueryService` for reading snapshots.
- Repository interfaces for scales and trigger logs.

## Expected adapters

- Scale repository adapter backed by D1 or equivalent storage.
- Trigger log repository adapter backed by KV or external telemetry storage.
- Clock and logger adapters for runtime control.

## Integration notes

- Scores increment by `+1` per trigger and clamp at `100`.
- Use shared data contracts from [Data contracts](../data/schemas.md) and [KV conventions](../data/kv-conventions.md).
