<b>Size: </b>432 Bytes<br /><b>Rent Exemption: </b>0.003897600 SOL<br /><br />

| Field          | Type      | Description                                                                                                              |
| -------------- | --------- | ------------------------------------------------------------------------------------------------------------------------ |
| name           | u8[32]    | Name of the crank to store on-chain.                                                                                     |
| metadata       | u8[64]    | Metadata of the crank to store on-chain.                                                                                 |
| queuePubkey    | publicKey | Public key of the oracle queue who owns the crank                                                                        |
| pqSize         | u32       | Number of aggregators added to the crank                                                                                 |
| maxRows        | u32       | Maximum number of aggregators allowed to be added to a crank                                                             |
| jitterModifier | u8        | Pseudorandom value added to next aggregator update time                                                                  |
| ebuf           | u8[255]   | Reserved                                                                                                                 |
| dataBuffer     | publicKey | The public key of the CrankBuffer account holding a collection of Aggregator pubkeys and their next allowed update time. |
