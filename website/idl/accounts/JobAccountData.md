<b>Size: </b>181 Bytes<br /><b>Rent Exemption: </b>0.002150640 SOL<br /><br />

| Field          | Type      | Description                                                                      |
| -------------- | --------- | -------------------------------------------------------------------------------- |
| name           | u8[32]    | Name of the job to store on-chain.                                               |
| metadata       | u8[64]    | Metadata of the job to store on-chain.                                           |
| authority      | publicKey | The account delegated as the authority for making account changes.               |
| expiration     | i64       | Timestamp when the job is considered invalid                                     |
| hash           | u8[32]    | [Hash](/idl/types/Hash) of the serialized data to prevent tampering              |
| data           | bytes     | Serialized protobuf containing the collection of task to retrieve data off-chain |
| referenceCount | u32       | The number of data feeds referencing the job account.                            |
| totalSpent     | u64       |                                                                                  |
| createdAt      | i64       | Timestamp when the job account was created.                                      |
