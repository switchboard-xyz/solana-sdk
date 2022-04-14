[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / LeaseAccount

# Class: LeaseAccount

A Switchboard account representing a lease for managing funds for oracle payouts
for fulfilling feed updates.

## Table of contents

### Constructors

- [constructor](LeaseAccount.md#constructor)

### Properties

- [keypair](LeaseAccount.md#keypair)
- [program](LeaseAccount.md#program)
- [publicKey](LeaseAccount.md#publickey)

### Methods

- [estimatedLeaseTimeRemaining](LeaseAccount.md#estimatedleasetimeremaining)
- [extend](LeaseAccount.md#extend)
- [getBalance](LeaseAccount.md#getbalance)
- [loadData](LeaseAccount.md#loaddata)
- [size](LeaseAccount.md#size)
- [withdraw](LeaseAccount.md#withdraw)
- [create](LeaseAccount.md#create)
- [fromSeed](LeaseAccount.md#fromseed)

## Constructors

### constructor

• **new LeaseAccount**(`params`)

LeaseAccount constructor

#### Parameters

| Name     | Type                                              | Description            |
| :------- | :------------------------------------------------ | :--------------------- |
| `params` | [`AccountParams`](../interfaces/AccountParams.md) | initialization params. |

#### Defined in

[sbv2.ts:1958](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1958)

## Properties

### keypair

• `Optional` **keypair**: `Keypair`

#### Defined in

[sbv2.ts:1952](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1952)

---

### program

• **program**: `Program`<`Idl`\>

#### Defined in

[sbv2.ts:1950](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1950)

---

### publicKey

• **publicKey**: `PublicKey`

#### Defined in

[sbv2.ts:1951](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1951)

## Methods

### estimatedLeaseTimeRemaining

▸ **estimatedLeaseTimeRemaining**(): `Promise`<`number`\>

Estimate the time remaining on a given lease

**`params`** void

#### Returns

`Promise`<`number`\>

number milliseconds left in lease (estimate)

#### Defined in

[sbv2.ts:2105](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2105)

---

### extend

▸ **extend**(`params`): `Promise`<`string`\>

Adds fund to a LeaseAccount. Note that funds can always be withdrawn by
the withdraw authority if one was set on lease initialization.

#### Parameters

| Name     | Type                                                      |
| :------- | :-------------------------------------------------------- |
| `params` | [`LeaseExtendParams`](../interfaces/LeaseExtendParams.md) |

#### Returns

`Promise`<`string`\>

#### Defined in

[sbv2.ts:2142](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2142)

---

### getBalance

▸ **getBalance**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[sbv2.ts:2082](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2082)

---

### loadData

▸ **loadData**(): `Promise`<`any`\>

Load and parse LeaseAccount data based on the program IDL.

#### Returns

`Promise`<`any`\>

LeaseAccount data parsed in accordance with the
Switchboard IDL.

#### Defined in

[sbv2.ts:2003](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2003)

---

### size

▸ **size**(): `number`

Get the size of a LeaseAccount on chain.

#### Returns

`number`

size.

#### Defined in

[sbv2.ts:2015](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2015)

---

### withdraw

▸ **withdraw**(`params`): `Promise`<`string`\>

Withdraw funds from a LeaseAccount.

#### Parameters

| Name     | Type                                                          |
| :------- | :------------------------------------------------------------ |
| `params` | [`LeaseWithdrawParams`](../interfaces/LeaseWithdrawParams.md) |

#### Returns

`Promise`<`string`\>

#### Defined in

[sbv2.ts:2184](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2184)

---

### create

▸ `Static` **create**(`program`, `params`): `Promise`<[`LeaseAccount`](LeaseAccount.md)\>

Create and initialize the LeaseAccount.

#### Parameters

| Name      | Type                                                  | Description                                                    |
| :-------- | :---------------------------------------------------- | :------------------------------------------------------------- |
| `program` | `Program`<`Idl`\>                                     | Switchboard program representation holding connection and IDL. |
| `params`  | [`LeaseInitParams`](../interfaces/LeaseInitParams.md) | -                                                              |

#### Returns

`Promise`<[`LeaseAccount`](LeaseAccount.md)\>

newly generated LeaseAccount.

#### Defined in

[sbv2.ts:2025](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2025)

---

### fromSeed

▸ `Static` **fromSeed**(`program`, `queueAccount`, `aggregatorAccount`): [[`LeaseAccount`](LeaseAccount.md), `number`]

Loads a LeaseAccount from the expected PDA seed format.

#### Parameters

| Name                | Type                                          |
| :------------------ | :-------------------------------------------- |
| `program`           | `Program`<`Idl`\>                             |
| `queueAccount`      | [`OracleQueueAccount`](OracleQueueAccount.md) |
| `aggregatorAccount` | [`AggregatorAccount`](AggregatorAccount.md)   |

#### Returns

[[`LeaseAccount`](LeaseAccount.md), `number`]

LeaseAccount and PDA bump.

#### Defined in

[sbv2.ts:1982](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1982)
