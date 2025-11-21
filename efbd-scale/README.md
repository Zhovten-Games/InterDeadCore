# @interdead/efbd-scale

Hexagonal EFBD (Echoed Big Five of Dread) scale package that ingests triggers from mini-games, persists axis scores, and exposes query helpers for host runtimes.

## Axes

Updated axis codes aligned with the narrative glossary:

- `EBF-SOCIAL`
- `EBF-MIND`
- `EBF-DECLINE`
- `EBF-EXPOSURE`
- `EBF-ABANDON`

All scoring operations apply a `+1` increment per trigger and clamp at a ceiling of `100`.

## Schema

Cloudflare D1 table `efbd_scale` is expected to expose the following columns:

| column         | type    | notes                                   |
| -------------- | ------- | --------------------------------------- |
| `profile_id`   | text    | foreign key to the host profile record. |
| `axis_code`    | text    | one of the `EBF-*` codes.               |
| `score`        | integer | cumulative score per axis.             |
| `trigger_source` | text  | latest trigger origin identifier.      |
| `updated_at`   | text    | ISO timestamp of the last update.      |

Trigger logs can be persisted to KV with the key format `efbd-trigger-log:{profileId}:{timestamp}:{axis}`.

## Usage

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

## Dependency injection helper

Use `registerEfbdScale(container, options)` to attach the ingestion and query services to your host IoC container. Provide `IScaleRepository` and `ITriggerLogRepository` adapters suited for your runtime.

## Testing

Run unit tests with:

```bash
npm test
```

Type checks:

```bash
npm run typecheck
```
