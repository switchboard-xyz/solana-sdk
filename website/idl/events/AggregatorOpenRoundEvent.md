OpenRound successfully called on an aggregator

| Name           | Type        | Description                                                                                                       |
| -------------- | ----------- | ----------------------------------------------------------------------------------------------------------------- |
| feedPubkey     | publicKey   | Public key of the aggregator requesting a new result                                                              |
| oraclePubkeys  | publicKey[] | Oracles assigned to the update request                                                                            |
| jobPubkeys     | publicKey[] | Job accounts associated with an aggregator containing the job definitions                                         |
| remainingFunds | u64         | Remaining funds in the aggregators lease contract                                                                 |
| queueAuthority | publicKey   | The account delegated as the authority for making account changes or assigning permissions targeted at the queue. |
