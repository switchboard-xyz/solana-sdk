Create and initialize the PermissionAccount.

## Accounts
|Name|isMut|isSigner|Description|
|--|--|--|--|
| permission | TRUE | FALSE | The permission account being initialized. | 
| authority | FALSE | FALSE | The [PermissionAccountData](/idl/accounts/PermissionAccountData) authority that can update an account's permissions. | 
| granter | FALSE | FALSE | The account receiving the assigned permissions. | 
| grantee | FALSE | FALSE | The account granting the assigned permissions. | 
| payer | TRUE | TRUE | The account paying for the new permission account on-chain. | 
| systemProgram | FALSE | FALSE | The Solana system program account. | 
## Params
|Field|Type|Description|
|--|--|--|
