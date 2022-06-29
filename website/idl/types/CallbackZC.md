| Field       | Type                                          | Description                                           |
| ----------- | --------------------------------------------- | ----------------------------------------------------- |
| programId   | publicKey                                     | The program ID of the callback program being invoked. |
| accounts    | [AccountMetaZC](/idl/types/AccountMetaZC)[32] | The accounts being used in the callback instruction.  |
| accountsLen | u32                                           | The number of accounts in the accounts array.         |
| ixData      | u8[1024]                                      | The serialized instruction data.                      |
| ixDataLen   | u32                                           | The length of the instruction buffer.                 |
