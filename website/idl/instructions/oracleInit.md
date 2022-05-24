Create and initialize the OracleAccount.<br /><b>Size: </b>636 Bytes<br /><b>Rent Exemption: </b>0.00531744 SOL

## Accounts
|Name|isMut|isSigner|Description|
|--|--|--|--|
| oracle | TRUE | FALSE |  | 
| oracleAuthority | FALSE | FALSE |  | 
| wallet | FALSE | FALSE |  | 
| programState | FALSE | FALSE | The Switchboard [SbState](/idl/accounts/SbState) account. | 
| queue | FALSE | FALSE |  | 
| payer | TRUE | TRUE |  | 
| systemProgram | FALSE | FALSE | The Solana system program account. | 
## Params
|Field|Type|Description|
|--|--|--|
| name |  bytes | Name of the oracle to store on-chain. |
| metadata |  bytes | Metadata of the oracle to store on-chain. |
| stateBump |  u8 | The [SbState](/idl/accounts/SbState) bump used to derive its public key. |
| oracleBump |  u8 |  |
