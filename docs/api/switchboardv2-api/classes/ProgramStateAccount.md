[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / ProgramStateAccount

# Class: ProgramStateAccount

Account type representing Switchboard global program state.

## Table of contents

### Constructors

- [constructor](ProgramStateAccount.md#constructor)

### Properties

- [keypair](ProgramStateAccount.md#keypair)
- [program](ProgramStateAccount.md#program)
- [publicKey](ProgramStateAccount.md#publickey)

### Methods

- [getTokenMint](ProgramStateAccount.md#gettokenmint)
- [loadData](ProgramStateAccount.md#loaddata)
- [size](ProgramStateAccount.md#size)
- [vaultTransfer](ProgramStateAccount.md#vaulttransfer)
- [create](ProgramStateAccount.md#create)
- [fromSeed](ProgramStateAccount.md#fromseed)

## Constructors

### constructor

• **new ProgramStateAccount**(`params`)

ProgramStateAccount constructor

#### Parameters

| Name     | Type                                              | Description            |
| :------- | :------------------------------------------------ | :--------------------- |
| `params` | [`AccountParams`](../interfaces/AccountParams.md) | initialization params. |

#### Defined in

[sbv2.ts:170](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L170)

## Properties

### keypair

• `Optional` **keypair**: `Keypair`

#### Defined in

[sbv2.ts:164](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L164)

---

### program

• **program**: `Program`<`Idl`\>

#### Defined in

[sbv2.ts:162](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L162)

---

### publicKey

• **publicKey**: `PublicKey`

#### Defined in

[sbv2.ts:163](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L163)

## Methods

### getTokenMint

▸ **getTokenMint**(): `Promise`<`Token`\>

Fetch the Switchboard token mint specified in the program state account.

#### Returns

`Promise`<`Token`\>

Switchboard token mint.

#### Defined in

[sbv2.ts:219](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L219)

---

### loadData

▸ **loadData**(): `Promise`<`any`\>

Load and parse ProgramStateAccount state based on the program IDL.

#### Returns

`Promise`<`any`\>

ProgramStateAccount data parsed in accordance with the
Switchboard IDL.

#### Defined in

[sbv2.ts:209](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L209)

---

### size

▸ **size**(): `number`

#### Returns

`number`

account size of the global ProgramStateAccount.

#### Defined in

[sbv2.ts:236](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L236)

---

### vaultTransfer

▸ **vaultTransfer**(`to`, `authority`, `params`): `Promise`<`string`\>

Transfer N tokens from the program vault to a specified account.

#### Parameters

| Name        | Type                                                          | Description                                           |
| :---------- | :------------------------------------------------------------ | :---------------------------------------------------- |
| `to`        | `PublicKey`                                                   | The recipient of the vault tokens.                    |
| `authority` | `Keypair`                                                     | The vault authority required to sign the transfer tx. |
| `params`    | [`VaultTransferParams`](../interfaces/VaultTransferParams.md) | specifies the amount to transfer.                     |

#### Returns

`Promise`<`string`\>

TransactionSignature

#### Defined in

[sbv2.ts:320](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L320)

---

### create

▸ `Static` **create**(`program`, `params`): `Promise`<[`ProgramStateAccount`](ProgramStateAccount.md)\>

Create and initialize the ProgramStateAccount.

#### Parameters

| Name      | Type                                                      | Description                                                    |
| :-------- | :-------------------------------------------------------- | :------------------------------------------------------------- |
| `program` | `Program`<`Idl`\>                                         | Switchboard program representation holding connection and IDL. |
| `params`  | [`ProgramInitParams`](../interfaces/ProgramInitParams.md) | -                                                              |

#### Returns

`Promise`<[`ProgramStateAccount`](ProgramStateAccount.md)\>

newly generated ProgramStateAccount.

#### Defined in

[sbv2.ts:246](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L246)

---

### fromSeed

▸ `Static` **fromSeed**(`program`): [[`ProgramStateAccount`](ProgramStateAccount.md), `number`]

Constructs ProgramStateAccount from the static seed from which it was generated.

#### Parameters

| Name      | Type              |
| :-------- | :---------------- |
| `program` | `Program`<`Idl`\> |

#### Returns

[[`ProgramStateAccount`](ProgramStateAccount.md), `number`]

ProgramStateAccount and PDA bump tuple.

#### Defined in

[sbv2.ts:192](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L192)
