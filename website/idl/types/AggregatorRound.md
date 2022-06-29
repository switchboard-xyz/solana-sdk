| Field              | Type                                                    | Description                                                         |
| ------------------ | ------------------------------------------------------- | ------------------------------------------------------------------- |
| numSuccess         | u32                                                     | Number of successful responses                                      |
| numError           | u32                                                     | Number of error responses                                           |
| isClosed           | bool                                                    | Whether an update request round has ended                           |
| roundOpenSlot      | u64                                                     | Solana slot when the update request round was open                  |
| roundOpenTimestamp | i64                                                     | Timestamp when the update request round was open                    |
| result             | [SwitchboardDecimal](/idl/types/SwitchboardDecimal)     | Maintains the current median of all successful round responses      |
| stdDeviation       | [SwitchboardDecimal](/idl/types/SwitchboardDecimal)     | Standard deviation of the accepted results in the round             |
| minResponse        | [SwitchboardDecimal](/idl/types/SwitchboardDecimal)     | Maintains the minimum oracle response this round                    |
| maxResponse        | [SwitchboardDecimal](/idl/types/SwitchboardDecimal)     | Maintains the maximum oracle response this round                    |
| oraclePubkeysData  | publicKey[16]                                           | Public keys of the oracles fulfilling this round                    |
| mediansData        | [SwitchboardDecimal](/idl/types/SwitchboardDecimal)[16] | Represents all successful node responses this round. `NaN` if empty |
| currentPayout      | i64[16]                                                 | Rewards to provide oracles and round openers on this queue.         |
| mediansFulfilled   | bool[16]                                                | Keeps track of which responses are fulfilled here                   |
| errorsFulfilled    | bool[16]                                                | Keeps track of which errors are fulfilled here                      |
