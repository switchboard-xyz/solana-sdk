Pops an aggregator from the crank.

## Accounts
|Name|isMut|isSigner|Description|
|--|--|--|--|
| crank | TRUE | FALSE |  | 
| oracleQueue | TRUE | FALSE |  | 
| queueAuthority | FALSE | FALSE | The account delegated as the authority to for creating permissions targeted at the queue. | 
| programState | FALSE | FALSE | The Switchboard [SbState](/api/idl/accounts/SbState) account. | 
| payoutWallet | TRUE | FALSE |  | 
| tokenProgram | FALSE | FALSE | The Solana token program account. | 
| crankDataBuffer | TRUE | FALSE |  | 
| queueDataBuffer | FALSE | FALSE |  | 
## Params
|Field|Type|Description|
|--|--|--|
| stateBump |  u8 |  |
| leaseBumps |  bytes |  |
| permissionBumps |  bytes |  |
| nonce |  Option&lt;u32&gt; |  |
| failOpenOnAccountMismatch |  Option&lt;bool&gt; |  |
