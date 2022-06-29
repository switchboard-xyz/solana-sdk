<b>Size: </b>453 Bytes<br /><b>Rent Exemption: </b>0.004043760 SOL<br /><br />

| Field             | Type      | Description                                                                                                                    |
| ----------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| escrow            | publicKey | Public key of the token account holding the lease contract funds until rewarded to oracles for successfully processing updates |
| queue             | publicKey | Public key of the oracle queue that the lease contract is applicable for                                                       |
| aggregator        | publicKey | Public key of the aggregator that the lease contract is applicable for                                                         |
| tokenProgram      | publicKey | Public key of the Solana token program ID                                                                                      |
| isActive          | bool      | Whether the lease contract is still active                                                                                     |
| crankRowCount     | u32       | Index of an aggregators position on a crank                                                                                    |
| createdAt         | i64       | Timestamp when the lease contract was created                                                                                  |
| updateCount       | u128      | Counter keeping track of the number of updates for the given aggregator                                                        |
| withdrawAuthority | publicKey | Public key of keypair that may withdraw funds from the lease at any time                                                       |
| ebuf              | u8[256]   | Reserved                                                                                                                       |
