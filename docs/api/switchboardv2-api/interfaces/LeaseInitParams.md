[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / LeaseInitParams

# Interface: LeaseInitParams

Parameters for initializing a LeaseAccount

## Table of contents

### Properties

- [aggregatorAccount](LeaseInitParams.md#aggregatoraccount)
- [funder](LeaseInitParams.md#funder)
- [funderAuthority](LeaseInitParams.md#funderauthority)
- [loadAmount](LeaseInitParams.md#loadamount)
- [oracleQueueAccount](LeaseInitParams.md#oraclequeueaccount)
- [withdrawAuthority](LeaseInitParams.md#withdrawauthority)

## Properties

### aggregatorAccount

• **aggregatorAccount**: [`AggregatorAccount`](../classes/AggregatorAccount.md)

The feed which the lease grants permission.

#### Defined in

[sbv2.ts:1902](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1902)

---

### funder

• **funder**: `PublicKey`

The funding wallet of the lease.

#### Defined in

[sbv2.ts:1890](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1890)

---

### funderAuthority

• **funderAuthority**: `Keypair`

The authority of the funding wallet

#### Defined in

[sbv2.ts:1894](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1894)

---

### loadAmount

• **loadAmount**: `BN`

Token amount to load into the lease escrow

#### Defined in

[sbv2.ts:1886](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1886)

---

### oracleQueueAccount

• **oracleQueueAccount**: [`OracleQueueAccount`](../classes/OracleQueueAccount.md)

The target to which this lease is applied.

#### Defined in

[sbv2.ts:1898](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1898)

---

### withdrawAuthority

• `Optional` **withdrawAuthority**: `PublicKey`

This authority will be permitted to withdraw funds from this lease.

#### Defined in

[sbv2.ts:1906](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1906)
