# Ports and events

InterDeadCore exposes ports instead of framework-specific implementations. Host applications (such as InterDeadIT) provide adapters that satisfy these contracts.

## Identity core ports

- **OAuth provider port**: exchanges authorization codes for identities (Discord adapter by default).
- **Profile repository port**: persists `ProfileMetadata` aggregates in D1 or another storage layer.
- **Session store port**: stores login/session state in KV, memory, or a host-managed store.
- **Event bus port**: notifies downstream adapters when identity events are emitted.

## EFBD scale ports

- **Scale repository port**: saves and queries axis scores for each profile.
- **Trigger log repository port**: records triggers for replay and analytics.
- **Clock port**: normalizes timestamps for trigger ingestion.
- **Logger port**: receives operational telemetry from services.

## Shared event expectations

- Identity completion should emit a profile-ready event so EFBD adapters can initialize scoring.
- Trigger ingestion should emit an axis-updated event for UI surfaces or telemetry.
