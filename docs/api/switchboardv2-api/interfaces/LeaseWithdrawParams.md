[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / LeaseWithdrawParams

# Interface: LeaseWithdrawParams

Parameters for withdrawing from a LeaseAccount

## Table of contents

### Properties

- [amount](LeaseWithdrawParams.md#amount)
- [withdrawAuthority](LeaseWithdrawParams.md#withdrawauthority)
- [withdrawWallet](LeaseWithdrawParams.md#withdrawwallet)

## Properties

### amount

• **amount**: `BN`

Token amount to withdraw from the lease escrow

#### Defined in

[sbv2.ts:1934](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1934)

---

### withdrawAuthority

• **withdrawAuthority**: `Keypair`

The withdraw authority of the lease

#### Defined in

[sbv2.ts:1942](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1942)

---

### withdrawWallet

• **withdrawWallet**: `PublicKey`

The wallet to withdraw to.

#### Defined in

[sbv2.ts:1938](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1938)
