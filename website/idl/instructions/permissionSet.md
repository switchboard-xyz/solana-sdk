Sets the permission in the PermissionAccount

## Accounts
|Name|isMut|isSigner|Description|
|--|--|--|--|
| permission | TRUE | FALSE | The [PermissionAccountData](/idl/accounts/PermissionAccountData) that is being updated. | 
| authority | FALSE | TRUE | The [PermissionAccountData](/idl/accounts/PermissionAccountData) authority that can update an account's permissions. | 
## Params
|Field|Type|Description|
|--|--|--|
| permission |  [SwitchboardPermission](/idl/types/SwitchboardPermission) | The [SwitchboardPermission](/idl/types/SwitchboardPermission) enumeration to set. |
| enable |  bool | Specifies whether to enable or disable the permission. |
