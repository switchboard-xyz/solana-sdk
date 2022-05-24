Adds fund to a LeaseAccount. Note that funds can always be withdrawn by the withdraw authority if one was set on lease initialization.

## Accounts
|Name|isMut|isSigner|Description|
|--|--|--|--|
| lease | TRUE | FALSE |  | 
| aggregator | FALSE | FALSE |  | 
| queue | FALSE | FALSE |  | 
| funder | TRUE | FALSE |  | 
| owner | TRUE | TRUE |  | 
| escrow | TRUE | FALSE |  | 
| tokenProgram | FALSE | FALSE | The Solana token program account. | 
| programState | FALSE | FALSE | The Switchboard [SbState](/idl/accounts/SbState) account. | 
| mint | FALSE | FALSE |  | 
## Params
|Field|Type|Description|
|--|--|--|
| loadAmount |  u64 |  |
| leaseBump |  u8 |  |
| stateBump |  u8 | The [SbState](/idl/accounts/SbState) bump used to derive its public key. |
| walletBumps |  bytes |  |
