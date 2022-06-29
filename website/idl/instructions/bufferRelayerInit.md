## Accounts

| Name                   | isMut | isSigner | Description |
| ---------------------- | ----- | -------- | ----------- |
| bufferRelayer          | true  | false    |             |
| escrow                 | true  | false    |             |
| authority              | false | false    |             |
| queue                  | false | false    |             |
| job                    | false | false    |             |
| programState           | false | false    |             |
| mint                   | false | false    |             |
| payer                  | true  | true     |             |
| tokenProgram           | false | false    |             |
| associatedTokenProgram | false | false    |             |
| systemProgram          | false | false    |             |
| rent                   | false | false    |             |

## Args

| Field                 | Type   | Description |
| --------------------- | ------ | ----------- |
| name                  | u8[32] |             |
| minUpdateDelaySeconds | u32    |             |
| stateBump             | u8     |             |
