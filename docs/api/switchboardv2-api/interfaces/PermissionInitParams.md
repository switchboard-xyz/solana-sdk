[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / PermissionInitParams

# Interface: PermissionInitParams

Parameters for initializing PermissionAccount

## Table of contents

### Properties

- [authority](PermissionInitParams.md#authority)
- [grantee](PermissionInitParams.md#grantee)
- [granter](PermissionInitParams.md#granter)

## Properties

### authority

• **authority**: `PublicKey`

The authority that is allowed to set permissions for this account.

#### Defined in

[sbv2.ts:1441](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1441)

---

### grantee

• **grantee**: `PublicKey`

The receiving account of a permission.

#### Defined in

[sbv2.ts:1437](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1437)

---

### granter

• **granter**: `PublicKey`

Pubkey of the account granting the permission.

#### Defined in

[sbv2.ts:1433](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1433)
