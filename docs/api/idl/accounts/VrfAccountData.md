<b>Size: </b>29058 Bytes<br /><b>Rent Exemption: </b>0.203134560SOL<br /><br />

| Field        | Type                                       | Description                                                                                     |
| ------------ | ------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| status       | [VrfStatus](/api/idl/types/VrfStatus)      |                                                                                                 |
| counter      | u128                                       | Incremental counter for current round.                                                          |
| authority    | publicKey                                  |                                                                                                 |
| oracleQueue  | publicKey                                  |                                                                                                 |
| escrow       | publicKey                                  |                                                                                                 |
| callback     | [CallbackZC](/api/idl/types/CallbackZC)    |                                                                                                 |
| batchSize    | u32                                        |                                                                                                 |
| builders     | [VrfBuilder](/api/idl/types/VrfBuilder)[8] |                                                                                                 |
| buildersLen  | u32                                        |                                                                                                 |
| testMode     | bool                                       |                                                                                                 |
| currentRound | [VrfRound](/api/idl/types/VrfRound)        | Oracle results from the current round of update request that has not been accepted as valid yet |
| ebuf         | u8[1024]                                   | Reserved.                                                                                       |
