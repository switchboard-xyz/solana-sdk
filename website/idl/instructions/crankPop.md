Pops an aggregator from the crank.

## Accounts

| Name            | isMut | isSigner | Description                                                                                                       |
| --------------- | ----- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| crank           | TRUE  | FALSE    |                                                                                                                   |
| oracleQueue     | TRUE  | FALSE    |                                                                                                                   |
| queueAuthority  | FALSE | FALSE    | The account delegated as the authority for making account changes or assigning permissions targeted at the queue. |
| programState    | FALSE | FALSE    | The Switchboard [SbState](/idl/accounts/SbState) account.                                                         |
| payoutWallet    | TRUE  | FALSE    |                                                                                                                   |
| tokenProgram    | FALSE | FALSE    | The Solana token program account.                                                                                 |
| crankDataBuffer | TRUE  | FALSE    |                                                                                                                   |
| queueDataBuffer | FALSE | FALSE    |                                                                                                                   |
| mint            | FALSE | FALSE    |                                                                                                                   |

## Params

| Field                     | Type               | Description                                                              |
| ------------------------- | ------------------ | ------------------------------------------------------------------------ |
| stateBump                 | u8                 | The [SbState](/idl/accounts/SbState) bump used to derive its public key. |
| leaseBumps                | bytes              |                                                                          |
| permissionBumps           | bytes              |                                                                          |
| nonce                     | Option&lt;u32&gt;  |                                                                          |
| failOpenOnAccountMismatch | Option&lt;bool&gt; |                                                                          |
