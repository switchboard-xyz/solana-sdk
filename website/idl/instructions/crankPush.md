Pushes a new aggregator onto the crank.

## Accounts

| Name           | isMut | isSigner | Description                                                                                                       |
| -------------- | ----- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| crank          | TRUE  | FALSE    | The crank to add a new aggregator to.                                                                             |
| aggregator     | TRUE  | FALSE    | The aggregator being pushed onto the crank.                                                                       |
| oracleQueue    | TRUE  | FALSE    | The crank and aggregators assigned oracle queue.                                                                  |
| queueAuthority | FALSE | FALSE    | The account delegated as the authority for making account changes or assigning permissions targeted at the queue. |
| permission     | FALSE | FALSE    | The aggregator's permission account.                                                                              |
| lease          | TRUE  | FALSE    | The aggregator's lease contract.                                                                                  |
| escrow         | TRUE  | FALSE    |                                                                                                                   |
| programState   | FALSE | FALSE    | The Switchboard [SbState](/idl/accounts/SbState) account.                                                         |
| dataBuffer     | TRUE  | FALSE    | The crank buffer account holding an array of CrankRows.                                                           |

## Params

| Field          | Type | Description                                                              |
| -------------- | ---- | ------------------------------------------------------------------------ |
| stateBump      | u8   | The [SbState](/idl/accounts/SbState) bump used to derive its public key. |
| permissionBump | u8   |                                                                          |
