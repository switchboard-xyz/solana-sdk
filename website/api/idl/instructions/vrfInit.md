

## Accounts
|Name|isMut|isSigner|Description|
|--|--|--|--|
| vrf | TRUE | FALSE | The [VrfAccountData](/api/idl/accounts/VrfAccountData) that is being initialized. | 
| authority | FALSE | FALSE | The [VrfAccountData](/api/idl/accounts/VrfAccountData) authority that can request new VRF results. | 
| oracleQueue | FALSE | FALSE | The [OracleQueueAccountData](/api/idl/accounts/OracleQueueAccountData) that the VRF account is joining. | 
| escrow | TRUE | FALSE | The escrow token account for the programState's mint holding the oracle rewards for VRF update request. | 
| programState | FALSE | FALSE | The Switchboard [SbState](/api/idl/accounts/SbState) account. | 
| tokenProgram | FALSE | FALSE | The Solana token Program ID. | 
## Params
|Field|Type|Description|
|--|--|--|
| callback |  [Callback](/api/idl/types/Callback) |  |
| stateBump |  u8 |  |
