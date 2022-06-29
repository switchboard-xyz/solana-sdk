Create and initialize the AggregatorAccount.

## Accounts

| Name         | isMut | isSigner | Description |
| ------------ | ----- | -------- | ----------- |
| aggregator   | true  | false    |             |
| authority    | false | false    |             |
| queue        | false | false    |             |
| programState | false | false    |             |

## Args

| Field                 | Type                                    | Description                                                                                                                                |
| --------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| name                  | u8[32]                                  | Name of the aggregator to store on-chain.                                                                                                  |
| metadata              | u8[128]                                 | Metadata of the aggregator to store on-chain.                                                                                              |
| batchSize             | u32                                     | Number of oracles to request on aggregator update.                                                                                         |
| minOracleResults      | u32                                     | Minimum number of oracle responses required before a round is validated.                                                                   |
| minJobResults         | u32                                     | Minimum number of feed jobs suggested to be successful before an oracle sends a response.                                                  |
| minUpdateDelaySeconds | u32                                     | Minimum number of seconds required between aggregator rounds.                                                                              |
| startAfter            | i64                                     | unix_timestamp for which no feed update will occur before.                                                                                 |
| varianceThreshold     | [BorshDecimal](/idl/types/BorshDecimal) | Change percentage required between a previous round and the current round. If variance percentage is not met, reject new oracle responses. |
| forceReportPeriod     | i64                                     | Number of seconds for which, even if the variance threshold is not passed, accept new responses from oracles.                              |
| expiration            | i64                                     | unix_timestamp after which funds may be withdrawn from the aggregator. null/undefined/0 means the feed has no expiration.                  |
| stateBump             | u8                                      | The [SbState](/idl/accounts/SbState) bump used to derive its public key.                                                                   |
| disableCrank          | bool                                    |                                                                                                                                            |
