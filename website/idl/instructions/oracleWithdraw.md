Withdraw stake and/or rewards from an OracleAccount.

## Accounts
|Name|isMut|isSigner|Description|
|--|--|--|--|
| oracle | TRUE | FALSE |  | 
| oracleAuthority | FALSE | TRUE |  | 
| tokenAccount | TRUE | FALSE |  | 
| withdrawAccount | TRUE | FALSE |  | 
| oracleQueue | TRUE | FALSE |  | 
| permission | TRUE | FALSE |  | 
| tokenProgram | FALSE | FALSE | The Solana token program account. | 
| programState | FALSE | FALSE | The Switchboard [SbState](/idl/accounts/SbState) account. | 
| payer | TRUE | TRUE |  | 
| systemProgram | FALSE | FALSE | The Solana system program account. | 
## Params
|Field|Type|Description|
|--|--|--|
| stateBump |  u8 | The [SbState](/idl/accounts/SbState) bump used to derive its public key. |
| permissionBump |  u8 |  |
| amount |  u64 |  |
