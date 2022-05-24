

## Accounts
|Name|isMut|isSigner|Description|
|--|--|--|--|
| vrf | TRUE | FALSE | The [VrfAccountData](/idl/accounts/VrfAccountData) that requested a new randomness result. | 
| oracle | FALSE | FALSE | The [OracleAccountData](/idl/accounts/OracleAccountData) that is assigned to the VRF request. | 
| randomnessProducer | FALSE | TRUE | The randomness producer for the VRF request, specific to the Oracle assigned to the VRF request. | 
## Params
|Field|Type|Description|
|--|--|--|
| proof |  bytes |  |
| idx |  u32 |  |
