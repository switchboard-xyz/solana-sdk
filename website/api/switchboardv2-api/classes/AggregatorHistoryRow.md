[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / AggregatorHistoryRow

# Class: AggregatorHistoryRow

Row structure of elements in the aggregator history buffer.

## Table of contents

### Constructors

- [constructor](AggregatorHistoryRow.md#constructor)

### Properties

- [timestamp](AggregatorHistoryRow.md#timestamp)
- [value](AggregatorHistoryRow.md#value)

### Methods

- [from](AggregatorHistoryRow.md#from)

## Constructors

### constructor

• **new AggregatorHistoryRow**()

## Properties

### timestamp

• **timestamp**: `BN`

Timestamp of the aggregator result.

#### Defined in

[sbv2.ts:540](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L540)

---

### value

• **value**: `Big`

Aggregator value at timestamp.

#### Defined in

[sbv2.ts:544](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L544)

## Methods

### from

▸ `Static` **from**(`buf`): [`AggregatorHistoryRow`](AggregatorHistoryRow.md)

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `buf` | `Buffer` |

#### Returns

[`AggregatorHistoryRow`](AggregatorHistoryRow.md)

#### Defined in

[sbv2.ts:546](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L546)
