Create and initialize the CrankAccount.

## Accounts
|Name|isMut|isSigner|Description|
|--|--|--|--|
| crank | TRUE | TRUE |  | 
| queue | FALSE | FALSE |  | 
| buffer | TRUE | FALSE |  | 
| payer | TRUE | FALSE |  | 
| systemProgram | FALSE | FALSE | The Solana system program account. | 
## Params
|Field|Type|Description|
|--|--|--|
| name |  bytes |  |
| metadata |  bytes | Metadata of the crank to store on-chain. |
| crankSize |  u32 |  |
