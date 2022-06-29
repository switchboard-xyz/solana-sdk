## Accounts

| Name              | isMut | isSigner | Description |
| ----------------- | ----- | -------- | ----------- |
| lease             | true  | false    |             |
| escrow            | true  | false    |             |
| aggregator        | false | false    |             |
| queue             | false | false    |             |
| withdrawAuthority | false | true     |             |
| withdrawAccount   | true  | false    |             |
| tokenProgram      | false | false    |             |
| programState      | false | false    |             |
| mint              | false | false    |             |

## Args

| Field     | Type | Description                                                              |
| --------- | ---- | ------------------------------------------------------------------------ |
| stateBump | u8   | The [SbState](/idl/accounts/SbState) bump used to derive its public key. |
| leaseBump | u8   |                                                                          |
| amount    | u64  | Token amount to withdraw from the lease escrow                           |
