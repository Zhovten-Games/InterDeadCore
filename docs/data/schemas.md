# D1 schemas

InterDeadCore shares a small set of D1 tables across packages. These tables are owned by the host application but must conform to the schemas below so the core packages remain portable.

## Profiles

`profiles` stores the identity aggregate for each player.

| column                | type    | notes                                              |
| --------------------- | ------- | -------------------------------------------------- |
| `profile_id`          | text    | primary key for the player profile.                |
| `data`                | text    | JSON identity aggregate and auxiliary metadata.    |
| `last_cleanup_at`     | text    | optional timestamp for cleanup automation.         |
| `last_cleanup_timezone` | text  | optional timezone for cleanup scheduling.          |
| `delete_count`        | integer | optional counter for delete operations.            |

Minimum required columns are `profile_id` and `data`. The remaining columns are optional but recommended for operational tooling.

## EFBD scale

`efbd_scale` tracks axis scores per profile.

| column           | type    | notes                                   |
| ---------------- | ------- | --------------------------------------- |
| `profile_id`     | text    | foreign key to the host profile record. |
| `axis_code`      | text    | one of the `EBF-*` codes.               |
| `score`          | integer | cumulative score per axis.              |
| `trigger_source` | text    | latest trigger origin identifier.       |
| `updated_at`     | text    | ISO timestamp of the last update.       |
