

## Accounts
|Name|isMut|isSigner|Description|
|--|--|--|--|
| vrf | TRUE | FALSE | The VRF Account to verify the proof for. | 
| callbackPid | FALSE | FALSE | The VRF Account's callback program ID. | 
| tokenProgram | FALSE | FALSE | The Solana token Program ID. | 
| escrow | TRUE | FALSE | The escrow token account holding the oracle's reward if successful. | 
| programState | FALSE | FALSE | The Switchboard [SbState](/api/idl/accounts/SbState) account. | 
| oracle | FALSE | FALSE | The Oracle Account verifying the VRF proof. | 
| oracleAuthority | FALSE | FALSE | The Oracle authority who is permitted to make on-chain transactions. | 
| oracleWallet | TRUE | FALSE | The Oracle's token wallet receiving the VRF reward if successful. | 
## Params
|Field|Type|Description|
|--|--|--|
| nonce |  Option&lt;u32&gt; |  |
| stateBump |  u8 |  |
| idx |  u32 |  |
