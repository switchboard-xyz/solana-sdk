Create and initialize the OracleAccount.<br /><b>Size: </b>636 Bytes<br /><b>Rent Exemption: </b>0.00531744 SOL

## Accounts
|Name|isMut|isSigner|Description|
|--|--|--|--|
| oracle | TRUE | FALSE |  | 
| oracleAuthority | FALSE | FALSE |  | 
| wallet | FALSE | FALSE |  | 
| programState | FALSE | FALSE | The Switchboard [SbState](/api/idl/accounts/SbState) account. | 
| queue | FALSE | FALSE |  | 
| payer | FALSE | FALSE |  | 
| systemProgram | FALSE | FALSE | The Solana system program account. | 
## Params
|Field|Type|Description|
|--|--|--|
| name |  bytes | Name of the oracle to store on-chain. |
| metadata |  bytes | Metadata of the oracle to store on-chain. |
| stateBump |  u8 |  |
| oracleBump |  u8 |  |
