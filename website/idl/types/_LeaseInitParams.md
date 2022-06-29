Parameters for initializing a LeaseAccount

| Field             | Type      | Description                                                              |
| ----------------- | --------- | ------------------------------------------------------------------------ |
| loadAmount        | u64       | Token amount to load into the lease escrow                               |
| withdrawAuthority | publicKey | This authority will be permitted to withdraw funds from this lease.      |
| leaseBump         | u8        |                                                                          |
| stateBump         | u8        | The [SbState](/idl/accounts/SbState) bump used to derive its public key. |
| walletBumps       | bytes     |                                                                          |
