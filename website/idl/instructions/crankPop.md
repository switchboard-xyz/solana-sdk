Pops an aggregator from the crank.

## Accounts
|Name|isMut|isSigner|Description|
|--|--|--|--|
| crank | true | false |  |
| oracleQueue | true | false |  |
| queueAuthority | false | false |  |
| programState | false | false |  |
| payoutWallet | true | false |  |
| tokenProgram | false | false |  |
| crankDataBuffer | true | false |  |
| queueDataBuffer | false | false |  |
## Args
|Field|Type|Description|
|--|--|--|
| stateBump |  u8 |  |
| leaseBumps |  bytes |  |
| permissionBumps |  bytes |  |
| nonce |  Option&lt;u32&gt; |  |
| failOpenOnAccountMismatch |  Option&lt;bool&gt; |  |
