[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / PermissionAccount

# Class: PermissionAccount

A Switchboard account representing a permission or privilege granted by one
account signer to another account.

## Table of contents

### Constructors

- [constructor](PermissionAccount.md#constructor)

### Properties

- [keypair](PermissionAccount.md#keypair)
- [program](PermissionAccount.md#program)
- [publicKey](PermissionAccount.md#publickey)

### Methods

- [isPermissionEnabled](PermissionAccount.md#ispermissionenabled)
- [loadData](PermissionAccount.md#loaddata)
- [set](PermissionAccount.md#set)
- [size](PermissionAccount.md#size)
- [create](PermissionAccount.md#create)
- [fromSeed](PermissionAccount.md#fromseed)

## Constructors

### constructor

• **new PermissionAccount**(`params`)

PermissionAccount constructor

#### Parameters

| Name     | Type                                              | Description            |
| :------- | :------------------------------------------------ | :--------------------- |
| `params` | [`AccountParams`](../interfaces/AccountParams.md) | initialization params. |

#### Defined in

[sbv2.ts:1488](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1488)

## Properties

### keypair

• `Optional` **keypair**: `Keypair`

#### Defined in

[sbv2.ts:1482](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1482)

---

### program

• **program**: `Program`<`Idl`\>

#### Defined in

[sbv2.ts:1480](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1480)

---

### publicKey

• **publicKey**: `PublicKey`

#### Defined in

[sbv2.ts:1481](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1481)

## Methods

### isPermissionEnabled

▸ **isPermissionEnabled**(`permission`): `Promise`<`boolean`\>

Check if a specific permission is enabled on this permission account

#### Parameters

| Name         | Type                                                                   |
| :----------- | :--------------------------------------------------------------------- |
| `permission` | [`SwitchboardPermissionValue`](../enums/SwitchboardPermissionValue.md) |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[sbv2.ts:1509](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1509)

---

### loadData

▸ **loadData**(): `Promise`<`any`\>

Load and parse PermissionAccount data based on the program IDL.

#### Returns

`Promise`<`any`\>

PermissionAccount data parsed in accordance with the
Switchboard IDL.

#### Defined in

[sbv2.ts:1521](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1521)

---

### set

▸ **set**(`params`): `Promise`<`string`\>

Sets the permission in the PermissionAccount

#### Parameters

| Name     | Type                                                          |
| :------- | :------------------------------------------------------------ |
| `params` | [`PermissionSetParams`](../interfaces/PermissionSetParams.md) |

#### Returns

`Promise`<`string`\>

TransactionSignature.

#### Defined in

[sbv2.ts:1603](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1603)

---

### size

▸ **size**(): `number`

Get the size of a PermissionAccount on chain.

#### Returns

`number`

size.

#### Defined in

[sbv2.ts:1532](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1532)

---

### create

▸ `Static` **create**(`program`, `params`): `Promise`<[`PermissionAccount`](PermissionAccount.md)\>

Create and initialize the PermissionAccount.

#### Parameters

| Name      | Type                                                            | Description                                                    |
| :-------- | :-------------------------------------------------------------- | :------------------------------------------------------------- |
| `program` | `Program`<`Idl`\>                                               | Switchboard program representation holding connection and IDL. |
| `params`  | [`PermissionInitParams`](../interfaces/PermissionInitParams.md) | -                                                              |

#### Returns

`Promise`<[`PermissionAccount`](PermissionAccount.md)\>

newly generated PermissionAccount.

#### Defined in

[sbv2.ts:1542](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1542)

---

### fromSeed

▸ `Static` **fromSeed**(`program`, `authority`, `granter`, `grantee`): [[`PermissionAccount`](PermissionAccount.md), `number`]

Loads a PermissionAccount from the expected PDA seed format.

#### Parameters

| Name        | Type              | Description                                                    |
| :---------- | :---------------- | :------------------------------------------------------------- |
| `program`   | `Program`<`Idl`\> | -                                                              |
| `authority` | `PublicKey`       | The authority pubkey to be incorporated into the account seed. |
| `granter`   | `PublicKey`       | The granter pubkey to be incorporated into the account seed.   |
| `grantee`   | `PublicKey`       | The grantee pubkey to be incorporated into the account seed.   |

#### Returns

[[`PermissionAccount`](PermissionAccount.md), `number`]

PermissionAccount and PDA bump.

#### Defined in

[sbv2.ts:1580](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1580)
