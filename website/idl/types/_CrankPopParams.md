Pops an aggregator from the crank.

| Field                     | Type               | Description                                                              |
| ------------------------- | ------------------ | ------------------------------------------------------------------------ |
| stateBump                 | u8                 | The [SbState](/idl/accounts/SbState) bump used to derive its public key. |
| leaseBumps                | bytes              |                                                                          |
| permissionBumps           | bytes              |                                                                          |
| nonce                     | Option&lt;u32&gt;  |                                                                          |
| failOpenOnAccountMismatch | Option&lt;bool&gt; |                                                                          |
