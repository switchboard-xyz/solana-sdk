Pushes a new aggregator onto the crank.

## Accounts

| Name           | isMut | isSigner | Description |
| -------------- | ----- | -------- | ----------- |
| crank          | true  | false    |             |
| aggregator     | true  | false    |             |
| oracleQueue    | true  | false    |             |
| queueAuthority | false | false    |             |
| permission     | false | false    |             |
| lease          | true  | false    |             |
| escrow         | true  | false    |             |
| programState   | false | false    |             |
| dataBuffer     | true  | false    |             |

## Args

| Field          | Type | Description                                                              |
| -------------- | ---- | ------------------------------------------------------------------------ |
| stateBump      | u8   | The [SbState](/idl/accounts/SbState) bump used to derive its public key. |
| permissionBump | u8   |                                                                          |
