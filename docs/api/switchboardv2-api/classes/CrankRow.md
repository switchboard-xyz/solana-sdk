[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / CrankRow

# Class: CrankRow

Row structure of elements in the crank.

## Table of contents

### Constructors

- [constructor](CrankRow.md#constructor)

### Properties

- [nextTimestamp](CrankRow.md#nexttimestamp)
- [pubkey](CrankRow.md#pubkey)

### Methods

- [from](CrankRow.md#from)

## Constructors

### constructor

• **new CrankRow**()

## Properties

### nextTimestamp

• **nextTimestamp**: `BN`

Next aggregator update timestamp to order the crank by

#### Defined in

[sbv2.ts:2295](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2295)

---

### pubkey

• **pubkey**: `PublicKey`

Aggregator account pubkey

#### Defined in

[sbv2.ts:2291](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2291)

## Methods

### from

▸ `Static` **from**(`buf`): [`CrankRow`](CrankRow.md)

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `buf` | `Buffer` |

#### Returns

[`CrankRow`](CrankRow.md)

#### Defined in

[sbv2.ts:2297](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2297)
