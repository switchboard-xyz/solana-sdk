Create and initialize the JobAccount.

## Accounts
|Name|isMut|isSigner|Description|
|--|--|--|--|
| job | TRUE | FALSE |  | 
| authorWallet | FALSE | FALSE | An optional wallet for receiving kickbacks from job usage in feeds. Defaults to token vault. | 
| programState | FALSE | FALSE | The Switchboard [SbState](/api/idl/accounts/SbState) account. | 
## Params
|Field|Type|Description|
|--|--|--|
| name |  u8[32] | An optional name to apply to the job account. |
| expiration |  i64 | unix_timestamp of when funds can be withdrawn from this account. |
| stateBump |  u8 |  |
| data |  bytes | A serialized protocol buffer holding the schema of the job. |
