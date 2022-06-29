## Accounts

| Name               | isMut | isSigner | Description |
| ------------------ | ----- | -------- | ----------- |
| vrf                | true  | false    |             |
| callbackPid        | false | false    |             |
| tokenProgram       | false | false    |             |
| escrow             | true  | false    |             |
| programState       | false | false    |             |
| oracle             | false | false    |             |
| oracleAuthority    | false | true     |             |
| oracleWallet       | true  | false    |             |
| instructionsSysvar | false | false    |             |

## Args

| Field     | Type              | Description |
| --------- | ----------------- | ----------- |
| nonce     | Option&lt;u32&gt; |             |
| stateBump | u8                |             |
| idx       | u32               |             |
| proof     | bytes             |             |
