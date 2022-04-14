[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / PermissionSetParams

# Interface: PermissionSetParams

Parameters for setting a permission in a PermissionAccount

## Table of contents

### Properties

- [authority](PermissionSetParams.md#authority)
- [enable](PermissionSetParams.md#enable)
- [permission](PermissionSetParams.md#permission)

## Properties

### authority

• **authority**: `Keypair`

The authority controlling this permission.

#### Defined in

[sbv2.ts:1455](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1455)

---

### enable

• **enable**: `boolean`

Specifies whether to enable or disable the permission.

#### Defined in

[sbv2.ts:1459](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1459)

---

### permission

• **permission**: [`SwitchboardPermission`](../enums/SwitchboardPermission.md)

The permssion to set

#### Defined in

[sbv2.ts:1451](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1451)
