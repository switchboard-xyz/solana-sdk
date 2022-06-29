Create and initialize the OracleAccount.<br /><b>Size: </b>636 Bytes<br /><b>Rent Exemption: </b>0.00531744 SOL

## Accounts

| Name            | isMut | isSigner | Description |
| --------------- | ----- | -------- | ----------- |
| oracle          | true  | false    |             |
| oracleAuthority | false | false    |             |
| wallet          | false | false    |             |
| programState    | false | false    |             |
| queue           | false | false    |             |
| payer           | true  | true     |             |
| systemProgram   | false | false    |             |

## Args

| Field      | Type  | Description                                                              |
| ---------- | ----- | ------------------------------------------------------------------------ |
| name       | bytes | Name of the oracle to store on-chain.                                    |
| metadata   | bytes | Metadata of the oracle to store on-chain.                                |
| stateBump  | u8    | The [SbState](/idl/accounts/SbState) bump used to derive its public key. |
| oracleBump | u8    |                                                                          |
