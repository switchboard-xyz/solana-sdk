[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / CrankInitParams

# Interface: CrankInitParams

Parameters for initializing a CrankAccount

## Table of contents

### Properties

- [maxRows](CrankInitParams.md#maxrows)
- [metadata](CrankInitParams.md#metadata)
- [name](CrankInitParams.md#name)
- [queueAccount](CrankInitParams.md#queueaccount)

## Properties

### maxRows

• `Optional` **maxRows**: `number`

Optional max number of rows

#### Defined in

[sbv2.ts:2240](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2240)

---

### metadata

• `Optional` **metadata**: `Buffer`

Buffer specifying crank metadata

#### Defined in

[sbv2.ts:2232](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2232)

---

### name

• `Optional` **name**: `Buffer`

Buffer specifying crank name

#### Defined in

[sbv2.ts:2228](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2228)

---

### queueAccount

• **queueAccount**: [`OracleQueueAccount`](../classes/OracleQueueAccount.md)

OracleQueueAccount for which this crank is associated

#### Defined in

[sbv2.ts:2236](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2236)
