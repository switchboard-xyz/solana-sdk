Opens a new round for the aggregator and will provide an incentivize reward to the caller

## Accounts

| Name           | isMut | isSigner | Description |
| -------------- | ----- | -------- | ----------- |
| aggregator     | true  | false    |             |
| lease          | true  | false    |             |
| oracleQueue    | true  | false    |             |
| queueAuthority | false | false    |             |
| permission     | true  | false    |             |
| escrow         | true  | false    |             |
| programState   | false | false    |             |
| payoutWallet   | true  | false    |             |
| tokenProgram   | false | false    |             |
| dataBuffer     | false | false    |             |
| mint           | false | false    |             |

## Args

| Field          | Type | Description                                                              |
| -------------- | ---- | ------------------------------------------------------------------------ |
| stateBump      | u8   | The [SbState](/idl/accounts/SbState) bump used to derive its public key. |
| leaseBump      | u8   |                                                                          |
| permissionBump | u8   |                                                                          |
| jitter         | u8   |                                                                          |
