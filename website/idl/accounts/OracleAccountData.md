<b>Size: </b>636 Bytes<br /><b>Rent Exemption: </b>0.00531744 SOL<br /><br />

| Field           | Type                                      | Description                                                                                                   |
| --------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| name            | u8[32]                                    | Name of the oracle to store on-chain.                                                                         |
| metadata        | u8[128]                                   | Metadata of the oracle to store on-chain.                                                                     |
| oracleAuthority | publicKey                                 | The account delegated as the authority for making account changes or withdrawing funds from a staking wallet. |
| lastHeartbeat   | i64                                       | Timestamp when the oracle last heartbeated                                                                    |
| numInUse        | u32                                       | Flag dictating if an oracle is active and has heartbeated before the queue's oracle timeout parameter         |
| tokenAccount    | publicKey                                 | Stake account and reward/slashing wallet                                                                      |
| queuePubkey     | publicKey                                 | Public key of the oracle queue who has granted it permission to use its resources                             |
| metrics         | [OracleMetrics](/idl/types/OracleMetrics) | Oracle track record                                                                                           |
| ebuf            | u8[256]                                   | Reserved                                                                                                      |
