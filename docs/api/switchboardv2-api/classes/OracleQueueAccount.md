[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / OracleQueueAccount

# Class: OracleQueueAccount

A Switchboard account representing a queue for distributing oracles to
permitted data feeds.

## Table of contents

### Constructors

- [constructor](OracleQueueAccount.md#constructor)

### Properties

- [keypair](OracleQueueAccount.md#keypair)
- [program](OracleQueueAccount.md#program)
- [publicKey](OracleQueueAccount.md#publickey)

### Methods

- [loadData](OracleQueueAccount.md#loaddata)
- [setRewards](OracleQueueAccount.md#setrewards)
- [setVrfSettings](OracleQueueAccount.md#setvrfsettings)
- [size](OracleQueueAccount.md#size)
- [create](OracleQueueAccount.md#create)

## Constructors

### constructor

• **new OracleQueueAccount**(`params`)

OracleQueueAccount constructor

#### Parameters

| Name     | Type                                              | Description            |
| :------- | :------------------------------------------------ | :--------------------- |
| `params` | [`AccountParams`](../interfaces/AccountParams.md) | initialization params. |

#### Defined in

[sbv2.ts:1720](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1720)

## Properties

### keypair

• `Optional` **keypair**: `Keypair`

#### Defined in

[sbv2.ts:1714](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1714)

---

### program

• **program**: `Program`<`Idl`\>

#### Defined in

[sbv2.ts:1712](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1712)

---

### publicKey

• **publicKey**: `PublicKey`

#### Defined in

[sbv2.ts:1713](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1713)

## Methods

### loadData

▸ **loadData**(): `Promise`<`any`\>

Load and parse OracleQueueAccount data based on the program IDL.

#### Returns

`Promise`<`any`\>

OracleQueueAccount data parsed in accordance with the
Switchboard IDL.

#### Defined in

[sbv2.ts:1743](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1743)

---

### setRewards

▸ **setRewards**(`params`): `Promise`<`string`\>

#### Parameters

| Name     | Type                                                                          |
| :------- | :---------------------------------------------------------------------------- |
| `params` | [`OracleQueueSetRewardsParams`](../interfaces/OracleQueueSetRewardsParams.md) |

#### Returns

`Promise`<`string`\>

#### Defined in

[sbv2.ts:1842](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1842)

---

### setVrfSettings

▸ **setVrfSettings**(`params`): `Promise`<`string`\>

#### Parameters

| Name     | Type                                                                                  |
| :------- | :------------------------------------------------------------------------------------ |
| `params` | [`OracleQueueSetVrfSettingsParams`](../interfaces/OracleQueueSetVrfSettingsParams.md) |

#### Returns

`Promise`<`string`\>

#### Defined in

[sbv2.ts:1860](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1860)

---

### size

▸ **size**(): `number`

Get the size of an OracleQueueAccount on chain.

#### Returns

`number`

size.

#### Defined in

[sbv2.ts:1773](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1773)

---

### create

▸ `Static` **create**(`program`, `params`): `Promise`<[`OracleQueueAccount`](OracleQueueAccount.md)\>

Create and initialize the OracleQueueAccount.

#### Parameters

| Name      | Type                                                              | Description                                                    |
| :-------- | :---------------------------------------------------------------- | :------------------------------------------------------------- |
| `program` | `Program`<`Idl`\>                                                 | Switchboard program representation holding connection and IDL. |
| `params`  | [`OracleQueueInitParams`](../interfaces/OracleQueueInitParams.md) | -                                                              |

#### Returns

`Promise`<[`OracleQueueAccount`](OracleQueueAccount.md)\>

newly generated OracleQueueAccount.

#### Defined in

[sbv2.ts:1783](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1783)
