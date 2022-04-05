[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / OracleInitParams

# Interface: OracleInitParams

Parameters for an OracleInit request.

## Table of contents

### Properties

- [metadata](OracleInitParams.md#metadata)
- [name](OracleInitParams.md#name)
- [oracleAuthority](OracleInitParams.md#oracleauthority)
- [queueAccount](OracleInitParams.md#queueaccount)

## Properties

### metadata

• `Optional` **metadata**: `Buffer`

Buffer specifying oracle metadata

#### Defined in

[sbv2.ts:2657](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2657)

---

### name

• `Optional` **name**: `Buffer`

Buffer specifying oracle name

#### Defined in

[sbv2.ts:2653](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2653)

---

### oracleAuthority

• `Optional` **oracleAuthority**: `Keypair`

If included, this keypair will be the oracle authority.

#### Defined in

[sbv2.ts:2661](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2661)

---

### queueAccount

• **queueAccount**: [`OracleQueueAccount`](../classes/OracleQueueAccount.md)

Specifies the oracle queue to associate with this OracleAccount.

#### Defined in

[sbv2.ts:2665](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2665)
