Create and initialize the JobAccount.

## Accounts
|Name|isMut|isSigner|Description|
|--|--|--|--|
| job | TRUE | FALSE |  | 
| authority | FALSE | FALSE |  | 
| programState | FALSE | FALSE | The Switchboard [SbState](/idl/accounts/SbState) account. | 
## Params
|Field|Type|Description|
|--|--|--|
| name |  u8[32] | An optional name to apply to the job account. |
| expiration |  i64 | unix_timestamp of when funds can be withdrawn from this account. |
| stateBump |  u8 | The [SbState](/idl/accounts/SbState) bump used to derive its public key. |
| data |  bytes | A serialized protocol buffer holding the schema of the job. |
