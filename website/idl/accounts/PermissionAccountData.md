<b>Size: </b>372 Bytes<br /><b>Rent Exemption: </b>0.003480000 SOL<br /><br />

| Field       | Type      | Description                                                                                                           |
| ----------- | --------- | --------------------------------------------------------------------------------------------------------------------- |
| authority   | publicKey | The authority that is allowed to set permissions for this account.                                                    |
| permissions | u32       | The [SwitchboardPermission](/idl/types/SwitchboardPermission) enumeration assigned by the `granter` to the `grantee`. |
| granter     | publicKey | Public key of account that is granting permissions to use its resources.                                              |
| grantee     | publicKey | Public key of account that is being assigned permissions to use a granters resources.                                 |
| expiration  | i64       | Timestamp when the permissions expire.                                                                                |
| ebuf        | u8[256]   | Reserved.                                                                                                             |
