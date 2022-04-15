
| Name | Value | Description |
|--|--|--|
| PermitOracleHeartbeat | 1 | queue `authority` has permitted an Oracle Account to heartbeat on it's queue and receive update requests. Oracles _always_ need permissions to join a queue. |
| PermitOracleQueueUsage | 2 | queue `authority` has permitted an Aggregator Account to request updates from it's oracles or join an existing crank. **Note:** Not required if a queue has `unpermissionedFeedsEnabled`. |
| PermitVrfRequests | 3 | queue `authority` has permitted a VRF Account to request randomness from it's oracles. **Note:** Not required if a queue has `unpermissionedVrfEnabled`. |
