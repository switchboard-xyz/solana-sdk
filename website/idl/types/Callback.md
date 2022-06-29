| Field     | Type                                              | Description                                           |
| --------- | ------------------------------------------------- | ----------------------------------------------------- |
| programId | publicKey                                         | The program ID of the callback program being invoked. |
| accounts  | [AccountMetaBorsh](/idl/types/AccountMetaBorsh)[] | The accounts being used in the callback instruction.  |
| ixData    | bytes                                             | The serialized instruction data.                      |
