

## Accounts
|Name|isMut|isSigner|Description|
|--|--|--|--|
| lease | TRUE | FALSE |  | 
| escrow | TRUE | FALSE |  | 
| aggregator | FALSE | FALSE |  | 
| queue | FALSE | FALSE |  | 
| withdrawAuthority | FALSE | TRUE |  | 
| withdrawAccount | TRUE | FALSE |  | 
| tokenProgram | FALSE | FALSE | The Solana token program account. | 
| programState | FALSE | FALSE | The Switchboard [SbState](/idl/accounts/SbState) account. | 
| mint | FALSE | FALSE |  | 
## Params
|Field|Type|Description|
|--|--|--|
| stateBump |  u8 | The [SbState](/idl/accounts/SbState) bump used to derive its public key. |
| leaseBump |  u8 |  |
| amount |  u64 | Token amount to withdraw from the lease escrow |
