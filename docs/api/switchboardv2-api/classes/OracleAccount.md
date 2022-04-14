[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / OracleAccount

# Class: OracleAccount

A Switchboard account representing an oracle account and its associated queue
and escrow account.

## Table of contents

### Constructors

- [constructor](OracleAccount.md#constructor)

### Properties

- [keypair](OracleAccount.md#keypair)
- [program](OracleAccount.md#program)
- [publicKey](OracleAccount.md#publickey)

### Methods

- [getBalance](OracleAccount.md#getbalance)
- [heartbeat](OracleAccount.md#heartbeat)
- [heartbeatTx](OracleAccount.md#heartbeattx)
- [loadData](OracleAccount.md#loaddata)
- [size](OracleAccount.md#size)
- [withdraw](OracleAccount.md#withdraw)
- [create](OracleAccount.md#create)
- [decode](OracleAccount.md#decode)
- [fromSeed](OracleAccount.md#fromseed)

## Constructors

### constructor

• **new OracleAccount**(`params`)

OracleAccount constructor

#### Parameters

| Name     | Type                                              | Description            |
| :------- | :------------------------------------------------ | :--------------------- |
| `params` | [`AccountParams`](../interfaces/AccountParams.md) | initialization params. |

#### Defined in

[sbv2.ts:2699](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2699)

## Properties

### keypair

• `Optional` **keypair**: `Keypair`

#### Defined in

[sbv2.ts:2693](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2693)

---

### program

• **program**: `Program`<`Idl`\>

#### Defined in

[sbv2.ts:2691](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2691)

---

### publicKey

• **publicKey**: `PublicKey`

#### Defined in

[sbv2.ts:2692](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2692)

## Methods

### getBalance

▸ **getBalance**(): `Promise`<`number`\>

#### Returns

`Promise`<`number`\>

#### Defined in

[sbv2.ts:2980](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2980)

---

### heartbeat

▸ **heartbeat**(): `Promise`<`string`\>

Inititates a heartbeat for an OracleAccount, signifying oracle is still healthy.

#### Returns

`Promise`<`string`\>

TransactionSignature.

#### Defined in

[sbv2.ts:2833](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2833)

---

### heartbeatTx

▸ **heartbeatTx**(): `Promise`<`Transaction`\>

/\*\*
Inititates a heartbeat for an OracleAccount, signifying oracle is still healthy.

#### Returns

`Promise`<`Transaction`\>

TransactionSignature.

#### Defined in

[sbv2.ts:2885](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2885)

---

### loadData

▸ **loadData**(): `Promise`<`any`\>

Load and parse OracleAccount data based on the program IDL.

#### Returns

`Promise`<`any`\>

OracleAccount data parsed in accordance with the
Switchboard IDL.

#### Defined in

[sbv2.ts:2722](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2722)

---

### size

▸ **size**(): `number`

Get the size of an OracleAccount on chain.

#### Returns

`number`

size.

#### Defined in

[sbv2.ts:2734](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2734)

---

### withdraw

▸ **withdraw**(`params`): `Promise`<`string`\>

Withdraw stake and/or rewards from an OracleAccount.

#### Parameters

| Name     | Type                                                            |
| :------- | :-------------------------------------------------------------- |
| `params` | [`OracleWithdrawParams`](../interfaces/OracleWithdrawParams.md) |

#### Returns

`Promise`<`string`\>

#### Defined in

[sbv2.ts:2935](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2935)

---

### create

▸ `Static` **create**(`program`, `params`): `Promise`<[`OracleAccount`](OracleAccount.md)\>

Create and initialize the OracleAccount.

#### Parameters

| Name      | Type                                                    | Description                                                    |
| :-------- | :------------------------------------------------------ | :------------------------------------------------------------- |
| `program` | `Program`<`Idl`\>                                       | Switchboard program representation holding connection and IDL. |
| `params`  | [`OracleInitParams`](../interfaces/OracleInitParams.md) | -                                                              |

#### Returns

`Promise`<[`OracleAccount`](OracleAccount.md)\>

newly generated OracleAccount.

#### Defined in

[sbv2.ts:2744](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2744)

---

### decode

▸ `Static` **decode**(`program`, `accountInfo`): `any`

#### Parameters

| Name          | Type                     |
| :------------ | :----------------------- |
| `program`     | `Program`<`Idl`\>        |
| `accountInfo` | `AccountInfo`<`Buffer`\> |

#### Returns

`any`

#### Defined in

[sbv2.ts:2795](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2795)

---

### fromSeed

▸ `Static` **fromSeed**(`program`, `queueAccount`, `wallet`): [[`OracleAccount`](OracleAccount.md), `number`]

Constructs OracleAccount from the static seed from which it was generated.

#### Parameters

| Name           | Type                                          |
| :------------- | :-------------------------------------------- |
| `program`      | `Program`<`Idl`\>                             |
| `queueAccount` | [`OracleQueueAccount`](OracleQueueAccount.md) |
| `wallet`       | `PublicKey`                                   |

#### Returns

[[`OracleAccount`](OracleAccount.md), `number`]

OracleAccount and PDA bump tuple.

#### Defined in

[sbv2.ts:2809](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2809)
