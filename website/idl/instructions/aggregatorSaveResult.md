Oracle saving result for a feed update request to an aggregator round.

## Accounts

| Name             | isMut | isSigner | Description |
| ---------------- | ----- | -------- | ----------- |
| aggregator       | true  | false    |             |
| oracle           | true  | false    |             |
| oracleAuthority  | false | true     |             |
| oracleQueue      | false | false    |             |
| queueAuthority   | false | false    |             |
| feedPermission   | true  | false    |             |
| oraclePermission | false | false    |             |
| lease            | true  | false    |             |
| escrow           | true  | false    |             |
| tokenProgram     | false | false    |             |
| programState     | false | false    |             |
| historyBuffer    | true  | false    |             |
| mint             | false | false    |             |

## Args

| Field                | Type                                    | Description                                                              |
| -------------------- | --------------------------------------- | ------------------------------------------------------------------------ |
| oracleIdx            | u32                                     |                                                                          |
| error                | bool                                    |                                                                          |
| value                | [BorshDecimal](/idl/types/BorshDecimal) |                                                                          |
| jobsChecksum         | u8[32]                                  |                                                                          |
| minResponse          | [BorshDecimal](/idl/types/BorshDecimal) |                                                                          |
| maxResponse          | [BorshDecimal](/idl/types/BorshDecimal) |                                                                          |
| feedPermissionBump   | u8                                      |                                                                          |
| oraclePermissionBump | u8                                      |                                                                          |
| leaseBump            | u8                                      |                                                                          |
| stateBump            | u8                                      | The [SbState](/idl/accounts/SbState) bump used to derive its public key. |
