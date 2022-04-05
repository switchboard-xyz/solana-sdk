Set the change percentage required between a previous round and the current round. If variance percentage is not met, reject new oracle responses.

## Accounts
|Name|isMut|isSigner|Description|
|--|--|--|--|
| aggregator | TRUE | FALSE |  | 
| authority | FALSE | TRUE |  | 
## Params
|Field|Type|Description|
|--|--|--|
| varianceThreshold |  [BorshDecimal](/api/idl/types/BorshDecimal) | Change percentage required between a previous round and the current round. If variance percentage is not met, reject new oracle responses. |
