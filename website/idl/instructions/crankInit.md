Create and initialize the CrankAccount.

## Accounts

| Name          | isMut | isSigner | Description |
| ------------- | ----- | -------- | ----------- |
| crank         | true  | true     |             |
| queue         | false | false    |             |
| buffer        | true  | false    |             |
| payer         | true  | true     |             |
| systemProgram | false | false    |             |

## Args

| Field     | Type  | Description                              |
| --------- | ----- | ---------------------------------------- |
| name      | bytes |                                          |
| metadata  | bytes | Metadata of the crank to store on-chain. |
| crankSize | u32   |                                          |
