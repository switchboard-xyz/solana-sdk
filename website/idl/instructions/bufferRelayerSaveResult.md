## Accounts

| Name            | isMut | isSigner | Description |
| --------------- | ----- | -------- | ----------- |
| bufferRelayer   | true  | false    |             |
| oracleAuthority | false | true     |             |
| oracle          | false | false    |             |
| oracleQueue     | true  | false    |             |
| dataBuffer      | true  | false    |             |
| queueAuthority  | false | false    |             |
| permission      | true  | false    |             |
| escrow          | true  | false    |             |
| oracleWallet    | true  | false    |             |
| programState    | false | false    |             |
| tokenProgram    | false | false    |             |

## Args

| Field          | Type  | Description |
| -------------- | ----- | ----------- |
| stateBump      | u8    |             |
| permissionBump | u8    |             |
| result         | bytes |             |
| success        | bool  |             |
