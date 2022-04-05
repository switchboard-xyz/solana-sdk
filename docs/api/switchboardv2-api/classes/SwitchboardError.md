[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / SwitchboardError

# Class: SwitchboardError

Switchboard wrapper for anchor program errors.

## Table of contents

### Constructors

- [constructor](SwitchboardError.md#constructor)

### Properties

- [code](SwitchboardError.md#code)
- [msg](SwitchboardError.md#msg)
- [name](SwitchboardError.md#name)
- [program](SwitchboardError.md#program)

### Methods

- [fromCode](SwitchboardError.md#fromcode)

## Constructors

### constructor

• **new SwitchboardError**()

## Properties

### code

• **code**: `number`

Numerical SwitchboardError representation.

#### Defined in

[sbv2.ts:505](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L505)

---

### msg

• `Optional` **msg**: `string`

Message describing this error in detail.

#### Defined in

[sbv2.ts:509](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L509)

---

### name

• **name**: `string`

Stringified name of the error type.

#### Defined in

[sbv2.ts:501](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L501)

---

### program

• **program**: `Program`<`Idl`\>

The program containing the Switchboard IDL specifying error codes.

#### Defined in

[sbv2.ts:497](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L497)

## Methods

### fromCode

▸ `Static` **fromCode**(`program`, `code`): [`SwitchboardError`](SwitchboardError.md)

Converts a numerical error code to a SwitchboardError based on the program
IDL.

#### Parameters

| Name      | Type              | Description                                                |
| :-------- | :---------------- | :--------------------------------------------------------- |
| `program` | `Program`<`Idl`\> | the Switchboard program object containing the program IDL. |
| `code`    | `number`          | Error code to convert to a SwitchboardError object.        |

#### Returns

[`SwitchboardError`](SwitchboardError.md)

SwitchboardError

#### Defined in

[sbv2.ts:518](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L518)
