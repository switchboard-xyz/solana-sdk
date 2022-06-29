| Field                   | Type | Description                                                                                                |
| ----------------------- | ---- | ---------------------------------------------------------------------------------------------------------- |
| consecutiveSuccess      | u64  | Number of consecutive successful update request                                                            |
| consecutiveError        | u64  | Number of consecutive update request that resulted in an error                                             |
| consecutiveDisagreement | u64  | Number of consecutive update request that resulted in a disagreement with the accepted median result       |
| consecutiveLateResponse | u64  | Number of consecutive update request that were posted on-chain late and not included in an accepted result |
| consecutiveFailure      | u64  | Number of consecutive update request that resulted in a failure                                            |
| totalSuccess            | u128 | Total number of successful update request                                                                  |
| totalError              | u128 | Total number of update request that resulted in an error                                                   |
| totalDisagreement       | u128 | Total number of update request that resulted in a disagreement with the accepted median result             |
| totalLateResponse       | u128 | Total number of update request that were posted on-chain late and not included in an accepted result       |
