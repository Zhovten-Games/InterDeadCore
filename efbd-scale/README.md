## Introduction

`@interdead/efbd-scale` is the hexagonal EFBD (Echoed Big Five of Dread) scale package. It ingests triggers from mini-games, persists axis scores, and exposes query helpers for host runtimes. Axis definitions align with the PsyFramework methodology used across the metaverse.

### Axes

Updated axis codes aligned with the narrative glossary:

- `EBF-SOCIAL`
- `EBF-MIND`
- `EBF-DECLINE`
- `EBF-EXPOSURE`
- `EBF-ABANDON`

The canonical persisted form uses the hyphenated strings above. In TypeScript, `AxisCode` uses underscore identifiers (for example, `AxisCode.EBF_SOCIAL`) but each enum value is the hyphenated string (for example, `"EBF-SOCIAL"`).

All scoring operations apply a `+1` increment per trigger and clamp at a ceiling of `100`.

## Installation

```bash
npm install @interdead/efbd-scale
```

## Usage Examples

```ts
import {
  AxisCode,
  InMemoryScaleRepository,
  InMemoryTriggerLogRepository,
  ScaleIngestionService,
  ScaleQueryService,
  SystemClock,
  ConsoleLogger
} from "@interdead/efbd-scale";

const repository = new InMemoryScaleRepository();
const triggerLog = new InMemoryTriggerLogRepository();
const clock = new SystemClock();
const logger = new ConsoleLogger();

const ingestion = new ScaleIngestionService(repository, triggerLog, clock, logger);
const query = new ScaleQueryService(repository, clock);

await ingestion.recordTriggers({
  profileId: "player-1",
  triggers: [
    { axis: AxisCode.EBF_SOCIAL, source: "mini-game-alpha" },
    { axis: AxisCode.EBF_MIND, source: "mini-game-beta" }
  ]
});

const snapshot = await query.fetchSnapshot("player-1");
console.log(snapshot.axisScores.get(AxisCode.EBF_SOCIAL)?.value); // -> 1
```

## Additional Notes

- Use `registerEfbdScale(container, options)` to attach the ingestion and query services to your host IoC container. Provide `IScaleRepository` and `ITriggerLogRepository` adapters suited for your runtime.
- Schemas and KV key formats live in the Core docs: [D1 schemas](../docs/data/schemas.md) and [KV conventions](../docs/data/kv-conventions.md).
- Testing commands:
  - `npm test`
  - `npm run typecheck`
