[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / SwitchboardDecimal

# Class: SwitchboardDecimal

Switchboard precisioned representation of numbers.

## Table of contents

### Constructors

- [constructor](SwitchboardDecimal.md#constructor)

### Properties

- [mantissa](SwitchboardDecimal.md#mantissa)
- [scale](SwitchboardDecimal.md#scale)

### Methods

- [eq](SwitchboardDecimal.md#eq)
- [toBig](SwitchboardDecimal.md#tobig)
- [from](SwitchboardDecimal.md#from)
- [fromBig](SwitchboardDecimal.md#frombig)

## Constructors

### constructor

• **new SwitchboardDecimal**(`mantissa`, `scale`)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `mantissa` | `BN`     |
| `scale`    | `number` |

#### Defined in

[sbv2.ts:33](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L33)

## Properties

### mantissa

• `Readonly` **mantissa**: `BN`

---

### scale

• `Readonly` **scale**: `number`

## Methods

### eq

▸ **eq**(`other`): `boolean`

SwitchboardDecimal equality comparator.

#### Parameters

| Name    | Type                                          | Description           |
| :------ | :-------------------------------------------- | :-------------------- |
| `other` | [`SwitchboardDecimal`](SwitchboardDecimal.md) | object to compare to. |

#### Returns

`boolean`

true iff equal

#### Defined in

[sbv2.ts:91](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L91)

---

### toBig

▸ **toBig**(): `Big`

Convert SwitchboardDecimal to big.js Big type.

#### Returns

`Big`

Big representation

#### Defined in

[sbv2.ts:99](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L99)

---

### from

▸ `Static` **from**(`obj`): [`SwitchboardDecimal`](SwitchboardDecimal.md)

Convert untyped object to a Switchboard decimal, if possible.

#### Parameters

| Name  | Type  | Description                |
| :---- | :---- | :------------------------- |
| `obj` | `any` | raw object to convert from |

#### Returns

[`SwitchboardDecimal`](SwitchboardDecimal.md)

SwitchboardDecimal

#### Defined in

[sbv2.ts:43](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L43)

---

### fromBig

▸ `Static` **fromBig**(`big`): [`SwitchboardDecimal`](SwitchboardDecimal.md)

Convert a Big.js decimal to a Switchboard decimal.

#### Parameters

| Name  | Type  | Description      |
| :---- | :---- | :--------------- |
| `big` | `Big` | a Big.js decimal |

#### Returns

[`SwitchboardDecimal`](SwitchboardDecimal.md)

a SwitchboardDecimal

#### Defined in

[sbv2.ts:52](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L52)
