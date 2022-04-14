[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / VrfInitParams

# Interface: VrfInitParams

Parameters for a VrfInit request.

## Table of contents

### Properties

- [authority](VrfInitParams.md#authority)
- [callback](VrfInitParams.md#callback)
- [keypair](VrfInitParams.md#keypair)
- [queue](VrfInitParams.md#queue)

## Properties

### authority

• **authority**: `PublicKey`

Vrf account authority to configure the account

#### Defined in

[sbv2.ts:3005](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L3005)

---

### callback

• **callback**: [`Callback`](Callback.md)

#### Defined in

[sbv2.ts:3007](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L3007)

---

### keypair

• **keypair**: `Keypair`

Keypair to use for the vrf account.

#### Defined in

[sbv2.ts:3011](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L3011)

---

### queue

• **queue**: [`OracleQueueAccount`](../classes/OracleQueueAccount.md)

#### Defined in

[sbv2.ts:3006](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L3006)
