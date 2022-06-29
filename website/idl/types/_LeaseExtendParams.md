Adds fund to a LeaseAccount. Note that funds can always be withdrawn by the withdraw authority if one was set on lease initialization.

| Field       | Type  | Description                                                              |
| ----------- | ----- | ------------------------------------------------------------------------ |
| loadAmount  | u64   |                                                                          |
| leaseBump   | u8    |                                                                          |
| stateBump   | u8    | The [SbState](/idl/accounts/SbState) bump used to derive its public key. |
| walletBumps | bytes |                                                                          |
