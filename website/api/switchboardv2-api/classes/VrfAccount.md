[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / VrfAccount

# Class: VrfAccount

A Switchboard VRF account.

## Table of contents

### Constructors

- [constructor](VrfAccount.md#constructor)

### Properties

- [keypair](VrfAccount.md#keypair)
- [program](VrfAccount.md#program)
- [publicKey](VrfAccount.md#publickey)

### Methods

- [loadData](VrfAccount.md#loaddata)
- [prove](VrfAccount.md#prove)
- [proveAndVerify](VrfAccount.md#proveandverify)
- [requestRandomness](VrfAccount.md#requestrandomness)
- [size](VrfAccount.md#size)
- [verify](VrfAccount.md#verify)
- [create](VrfAccount.md#create)

## Constructors

### constructor

• **new VrfAccount**(`params`)

CrankAccount constructor

#### Parameters

| Name     | Type                                              | Description            |
| :------- | :------------------------------------------------ | :--------------------- |
| `params` | [`AccountParams`](../interfaces/AccountParams.md) | initialization params. |

#### Defined in

[sbv2.ts:3054](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L3054)

## Properties

### keypair

• `Optional` **keypair**: `Keypair`

#### Defined in

[sbv2.ts:3048](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L3048)

---

### program

• **program**: `Program`<`Idl`\>

#### Defined in

[sbv2.ts:3046](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L3046)

---

### publicKey

• **publicKey**: `PublicKey`

#### Defined in

[sbv2.ts:3047](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L3047)

## Methods

### loadData

▸ **loadData**(): `Promise`<`any`\>

Load and parse VrfAccount data based on the program IDL.

#### Returns

`Promise`<`any`\>

VrfAccount data parsed in accordance with the
Switchboard IDL.

#### Defined in

[sbv2.ts:3077](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L3077)

---

### prove

▸ **prove**(`params`): `Promise`<`string`\>

#### Parameters

| Name     | Type                                                |
| :------- | :-------------------------------------------------- |
| `params` | [`VrfProveParams`](../interfaces/VrfProveParams.md) |

#### Returns

`Promise`<`string`\>

#### Defined in

[sbv2.ts:3236](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L3236)

---

### proveAndVerify

▸ **proveAndVerify**(`params`, `tryCount?`): `Promise`<`string`[]\>

Attempt the maximum amount of turns remaining on the vrf verify crank.
This will automatically call the vrf callback (if set) when completed.

#### Parameters

| Name       | Type                                                                  | Default value |
| :--------- | :-------------------------------------------------------------------- | :------------ |
| `params`   | [`VrfProveAndVerifyParams`](../interfaces/VrfProveAndVerifyParams.md) | `undefined`   |
| `tryCount` | `number`                                                              | `278`         |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[sbv2.ts:3333](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L3333)

---

### requestRandomness

▸ **requestRandomness**(`params`): `Promise`<`void`\>

Trigger new randomness production on the vrf account

#### Parameters

| Name     | Type                                                                        |
| :------- | :-------------------------------------------------------------------------- |
| `params` | [`VrfRequestRandomnessParams`](../interfaces/VrfRequestRandomnessParams.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[sbv2.ts:3182](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L3182)

---

### size

▸ **size**(): `number`

Get the size of a VrfAccount on chain.

#### Returns

`number`

size.

#### Defined in

[sbv2.ts:3090](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L3090)

---

### verify

▸ **verify**(`oracle`, `tryCount?`): `Promise`<`string`[]\>

#### Parameters

| Name       | Type                                | Default value |
| :--------- | :---------------------------------- | :------------ |
| `oracle`   | [`OracleAccount`](OracleAccount.md) | `undefined`   |
| `tryCount` | `number`                            | `278`         |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[sbv2.ts:3266](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L3266)

---

### create

▸ `Static` **create**(`program`, `params`): `Promise`<[`VrfAccount`](VrfAccount.md)\>

Create and initialize the VrfAccount.

#### Parameters

| Name      | Type                                              | Description                                                    |
| :-------- | :------------------------------------------------ | :------------------------------------------------------------- |
| `program` | `Program`<`Idl`\>                                 | Switchboard program representation holding connection and IDL. |
| `params`  | [`VrfInitParams`](../interfaces/VrfInitParams.md) | -                                                              |

#### Returns

`Promise`<[`VrfAccount`](VrfAccount.md)\>

newly generated VrfAccount.

#### Defined in

[sbv2.ts:3100](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L3100)
