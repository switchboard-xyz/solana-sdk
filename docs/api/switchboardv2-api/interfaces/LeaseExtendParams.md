[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / LeaseExtendParams

# Interface: LeaseExtendParams

Parameters for extending a LeaseAccount

## Table of contents

### Properties

- [funder](LeaseExtendParams.md#funder)
- [funderAuthority](LeaseExtendParams.md#funderauthority)
- [loadAmount](LeaseExtendParams.md#loadamount)

## Properties

### funder

• **funder**: `PublicKey`

The funding wallet of the lease.

#### Defined in

[sbv2.ts:1920](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1920)

---

### funderAuthority

• **funderAuthority**: `Keypair`

The authority of the funding wallet

#### Defined in

[sbv2.ts:1924](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1924)

---

### loadAmount

• **loadAmount**: `BN`

Token amount to load into the lease escrow

#### Defined in

[sbv2.ts:1916](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1916)
