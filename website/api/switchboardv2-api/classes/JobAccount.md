[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / JobAccount

# Class: JobAccount

A Switchboard account representing a job for an oracle to perform, stored as
a protocol buffer.

## Table of contents

### Constructors

- [constructor](JobAccount.md#constructor)

### Properties

- [keypair](JobAccount.md#keypair)
- [program](JobAccount.md#program)
- [publicKey](JobAccount.md#publickey)

### Methods

- [loadData](JobAccount.md#loaddata)
- [loadJob](JobAccount.md#loadjob)
- [create](JobAccount.md#create)
- [decode](JobAccount.md#decode)
- [decodeJob](JobAccount.md#decodejob)

## Constructors

### constructor

• **new JobAccount**(`params`)

JobAccount constructor

#### Parameters

| Name     | Type                                              | Description            |
| :------- | :------------------------------------------------ | :--------------------- |
| `params` | [`AccountParams`](../interfaces/AccountParams.md) | initialization params. |

#### Defined in

[sbv2.ts:1317](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1317)

## Properties

### keypair

• `Optional` **keypair**: `Keypair`

#### Defined in

[sbv2.ts:1311](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1311)

---

### program

• **program**: `Program`<`Idl`\>

#### Defined in

[sbv2.ts:1309](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1309)

---

### publicKey

• **publicKey**: `PublicKey`

#### Defined in

[sbv2.ts:1310](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1310)

## Methods

### loadData

▸ **loadData**(): `Promise`<`any`\>

Load and parse JobAccount data based on the program IDL.

#### Returns

`Promise`<`any`\>

JobAccount data parsed in accordance with the
Switchboard IDL.

#### Defined in

[sbv2.ts:1340](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1340)

---

### loadJob

▸ **loadJob**(): `Promise`<`OracleJob`\>

Load and parse the protobuf from the raw buffer stored in the JobAccount.

#### Returns

`Promise`<`OracleJob`\>

OracleJob

#### Defined in

[sbv2.ts:1349](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1349)

---

### create

▸ `Static` **create**(`program`, `params`): `Promise`<[`JobAccount`](JobAccount.md)\>

Create and initialize the JobAccount.

#### Parameters

| Name      | Type                                              | Description                                                    |
| :-------- | :------------------------------------------------ | :------------------------------------------------------------- |
| `program` | `Program`<`Idl`\>                                 | Switchboard program representation holding connection and IDL. |
| `params`  | [`JobInitParams`](../interfaces/JobInitParams.md) | -                                                              |

#### Returns

`Promise`<[`JobAccount`](JobAccount.md)\>

newly generated JobAccount.

#### Defined in

[sbv2.ts:1360](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1360)

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

[sbv2.ts:1406](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1406)

---

### decodeJob

▸ `Static` **decodeJob**(`program`, `accountInfo`): `OracleJob`

#### Parameters

| Name          | Type                     |
| :------------ | :----------------------- |
| `program`     | `Program`<`Idl`\>        |
| `accountInfo` | `AccountInfo`<`Buffer`\> |

#### Returns

`OracleJob`

#### Defined in

[sbv2.ts:1416](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1416)
