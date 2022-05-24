Create and initialize the [SbState](/idl/accounts/SbState).

## Accounts
|Name|isMut|isSigner|Description|
|--|--|--|--|
| state | TRUE | FALSE | The [SbState](/idl/accounts/SbState) account being initialized. | 
| authority | FALSE | FALSE | The account delegated as the program authority. | 
| tokenMint | TRUE | FALSE | The token mint that is used for oracle rewards, aggregator leases, and other reward incentives. | 
| vault | TRUE | FALSE | The token wallet for the program state account. | 
| payer | TRUE | TRUE | The account paying for the new on-chain account. | 
| systemProgram | FALSE | FALSE | The Solana system program account. | 
| tokenProgram | FALSE | FALSE | The Solana token program account. | 
| daoMint | FALSE | FALSE |  | 
## Params
|Field|Type|Description|
|--|--|--|
| stateBump |  u8 | The [SbState](/idl/accounts/SbState) bump used to derive its public key. |
