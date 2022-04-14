

## Accounts
|Name|isMut|isSigner|Description|
|--|--|--|--|
| authority | FALSE | TRUE | The [VrfAccountData](/api/idl/accounts/VrfAccountData) authority that is permitted to request randomness. | 
| vrf | TRUE | FALSE | The [VrfAccountData](/api/idl/accounts/VrfAccountData) that is requesting a new randomness result. | 
| oracleQueue | TRUE | FALSE | The [OracleQueueAccountData](/api/idl/accounts/OracleQueueAccountData) that the VRF Account is assigned to. | 
| queueAuthority | FALSE | FALSE | The Oracle Queue's authority. | 
| dataBuffer | FALSE | FALSE | The OracleQueueBuffer account holding a collection of Oracle pubkeys. | 
| permission | TRUE | FALSE | The permission account that allows a VRF Account to request randomness. | 
| escrow | TRUE | FALSE | The escrow token account holding the oracle's reward if successful. | 
| payerWallet | TRUE | FALSE | The payer wallet who is funding the VRF request. | 
| payerAuthority | FALSE | TRUE | The payer wallet's authority who can approve token transfers. | 
| recentBlockhashes | FALSE | FALSE | The Solana account holding the most recent blockhashes for the VRF proof. | 
| programState | FALSE | FALSE | The Switchboard [SbState](/api/idl/accounts/SbState) account. | 
| tokenProgram | FALSE | FALSE | The Solana token Program ID. | 
## Params
|Field|Type|Description|
|--|--|--|
| permissionBump |  u8 |  |
| stateBump |  u8 |  |
