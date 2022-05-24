<b>Size: </b>29058 Bytes<br /><b>Rent Exemption: </b>0.203134560SOL<br /><br />

| Field        | Type                                   | Description                                                                                                        |
| ------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| status       | [VrfStatus](/idl/types/VrfStatus)      | The current status of the VRF account.                                                                             |
| counter      | u128                                   | Incremental counter for tracking VRF rounds.                                                                       |
| authority    | publicKey                              | On-chain account delegated for making account changes.                                                             |
| oracleQueue  | publicKey                              | The [OracleQueueAccountData](/idl/accounts/OracleQueueAccountData) that is assigned to fulfill VRF update request. |
| escrow       | publicKey                              | The token account used to hold funds for VRF update request.                                                       |
| callback     | [CallbackZC](/idl/types/CallbackZC)    | The callback that is invoked when an update request is successfully verified.                                      |
| batchSize    | u32                                    | The number of oracles assigned to a VRF update request.                                                            |
| builders     | [VrfBuilder](/idl/types/VrfBuilder)[8] | Struct containing the intermediate state between VRF crank actions.                                                |
| buildersLen  | u32                                    | The number of builders.                                                                                            |
| testMode     | bool                                   |                                                                                                                    |
| currentRound | [VrfRound](/idl/types/VrfRound)        | Oracle results from the current round of update request that has not been accepted as valid yet                    |
| ebuf         | u8[1024]                               | Reserved.                                                                                                          |
