[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / CrankAccount

# Class: CrankAccount

A Switchboard account representing a crank of aggregators ordered by next update time.

## Table of contents

### Constructors

- [constructor](CrankAccount.md#constructor)

### Properties

- [keypair](CrankAccount.md#keypair)
- [program](CrankAccount.md#program)
- [publicKey](CrankAccount.md#publickey)

### Methods

- [loadData](CrankAccount.md#loaddata)
- [peakNext](CrankAccount.md#peaknext)
- [peakNextReady](CrankAccount.md#peaknextready)
- [peakNextWithTime](CrankAccount.md#peaknextwithtime)
- [pop](CrankAccount.md#pop)
- [popTxn](CrankAccount.md#poptxn)
- [push](CrankAccount.md#push)
- [size](CrankAccount.md#size)
- [create](CrankAccount.md#create)

## Constructors

### constructor

• **new CrankAccount**(`params`)

CrankAccount constructor

#### Parameters

| Name     | Type                                              | Description            |
| :------- | :------------------------------------------------ | :--------------------- |
| `params` | [`AccountParams`](../interfaces/AccountParams.md) | initialization params. |

#### Defined in

[sbv2.ts:2319](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2319)

## Properties

### keypair

• `Optional` **keypair**: `Keypair`

#### Defined in

[sbv2.ts:2313](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2313)

---

### program

• **program**: `Program`<`Idl`\>

#### Defined in

[sbv2.ts:2311](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2311)

---

### publicKey

• **publicKey**: `PublicKey`

#### Defined in

[sbv2.ts:2312](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2312)

## Methods

### loadData

▸ **loadData**(): `Promise`<`any`\>

Load and parse CrankAccount data based on the program IDL.

#### Returns

`Promise`<`any`\>

CrankAccount data parsed in accordance with the
Switchboard IDL.

#### Defined in

[sbv2.ts:2342](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2342)

---

### peakNext

▸ **peakNext**(`n`): `Promise`<`PublicKey`[]\>

Get an array of the next aggregator pubkeys to be popped from the crank, limited by n

#### Parameters

| Name | Type     | Description                     |
| :--- | :------- | :------------------------------ |
| `n`  | `number` | The limit of pubkeys to return. |

#### Returns

`Promise`<`PublicKey`[]\>

Pubkey list of Aggregators next up to be popped.

#### Defined in

[sbv2.ts:2635](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2635)

---

### peakNextReady

▸ **peakNextReady**(`n?`): `Promise`<`PublicKey`[]\>

Get an array of the next readily updateable aggregator pubkeys to be popped
from the crank, limited by n

#### Parameters

| Name | Type     | Description                     |
| :--- | :------- | :------------------------------ |
| `n?` | `number` | The limit of pubkeys to return. |

#### Returns

`Promise`<`PublicKey`[]\>

Pubkey list of Aggregator pubkeys.

#### Defined in

[sbv2.ts:2618](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2618)

---

### peakNextWithTime

▸ **peakNextWithTime**(`n`): `Promise`<[`CrankRow`](CrankRow.md)[]\>

Get an array of the next aggregator pubkeys to be popped from the crank, limited by n

#### Parameters

| Name | Type     | Description                     |
| :--- | :------- | :------------------------------ |
| `n`  | `number` | The limit of pubkeys to return. |

#### Returns

`Promise`<[`CrankRow`](CrankRow.md)[]\>

Pubkey list of Aggregators and next timestamp to be popped, ordered by timestamp.

#### Defined in

[sbv2.ts:2603](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2603)

---

### pop

▸ **pop**(`params`): `Promise`<`string`\>

Pops an aggregator from the crank.

#### Parameters

| Name     | Type                                                |
| :------- | :-------------------------------------------------- |
| `params` | [`CrankPopParams`](../interfaces/CrankPopParams.md) |

#### Returns

`Promise`<`string`\>

TransactionSignature

#### Defined in

[sbv2.ts:2587](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2587)

---

### popTxn

▸ **popTxn**(`params`): `Promise`<`Transaction`\>

Pops an aggregator from the crank.

#### Parameters

| Name     | Type                                                |
| :------- | :-------------------------------------------------- |
| `params` | [`CrankPopParams`](../interfaces/CrankPopParams.md) |

#### Returns

`Promise`<`Transaction`\>

TransactionSignature

#### Defined in

[sbv2.ts:2492](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2492)

---

### push

▸ **push**(`params`): `Promise`<`string`\>

Pushes a new aggregator onto the crank.

#### Parameters

| Name     | Type                                                  |
| :------- | :---------------------------------------------------- |
| `params` | [`CrankPushParams`](../interfaces/CrankPushParams.md) |

#### Returns

`Promise`<`string`\>

TransactionSignature

#### Defined in

[sbv2.ts:2427](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2427)

---

### size

▸ **size**(): `number`

Get the size of a CrankAccount on chain.

#### Returns

`number`

size.

#### Defined in

[sbv2.ts:2368](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2368)

---

### create

▸ `Static` **create**(`program`, `params`): `Promise`<[`CrankAccount`](CrankAccount.md)\>

Create and initialize the CrankAccount.

#### Parameters

| Name      | Type                                                  | Description                                                    |
| :-------- | :---------------------------------------------------- | :------------------------------------------------------------- |
| `program` | `Program`<`Idl`\>                                     | Switchboard program representation holding connection and IDL. |
| `params`  | [`CrankInitParams`](../interfaces/CrankInitParams.md) | -                                                              |

#### Returns

`Promise`<[`CrankAccount`](CrankAccount.md)\>

newly generated CrankAccount.

#### Defined in

[sbv2.ts:2378](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2378)
