## Accounts

| Name         | isMut | isSigner | Description |
| ------------ | ----- | -------- | ----------- |
| state        | false | false    |             |
| authority    | false | true     |             |
| to           | true  | false    |             |
| vault        | true  | false    |             |
| tokenProgram | false | false    |             |

## Args

| Field     | Type | Description                                                              |
| --------- | ---- | ------------------------------------------------------------------------ |
| stateBump | u8   | The [SbState](/idl/accounts/SbState) bump used to derive its public key. |
| amount    | u64  |                                                                          |
