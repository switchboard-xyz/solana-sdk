

| Field | Type | Description |
|--|--|--|
| name |  u8[32] | An optional name to apply to the job account. |
| expiration |  i64 | unix_timestamp of when funds can be withdrawn from this account. |
| stateBump |  u8 |  |
| data |  bytes | A serialized protocol buffer holding the schema of the job. |
