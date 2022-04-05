[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / CrankPopParams

# Interface: CrankPopParams

Parameters for popping an element from a CrankAccount.

## Table of contents

### Properties

- [crank](CrankPopParams.md#crank)
- [failOpenOnMismatch](CrankPopParams.md#failopenonmismatch)
- [nonce](CrankPopParams.md#nonce)
- [payoutWallet](CrankPopParams.md#payoutwallet)
- [queue](CrankPopParams.md#queue)
- [queueAuthority](CrankPopParams.md#queueauthority)
- [queuePubkey](CrankPopParams.md#queuepubkey)
- [readyPubkeys](CrankPopParams.md#readypubkeys)
- [tokenMint](CrankPopParams.md#tokenmint)

## Properties

### crank

• **crank**: `any`

#### Defined in

[sbv2.ts:2268](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2268)

---

### failOpenOnMismatch

• `Optional` **failOpenOnMismatch**: `boolean`

#### Defined in

[sbv2.ts:2271](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2271)

---

### nonce

• `Optional` **nonce**: `number`

Nonce to allow consecutive crank pops with the same blockhash.

#### Defined in

[sbv2.ts:2267](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2267)

---

### payoutWallet

• **payoutWallet**: `PublicKey`

Specifies the wallet to reward for turning the crank.

#### Defined in

[sbv2.ts:2250](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2250)

---

### queue

• **queue**: `any`

#### Defined in

[sbv2.ts:2269](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2269)

---

### queueAuthority

• **queueAuthority**: `PublicKey`

The pubkey of the linked oracle queue authority.

#### Defined in

[sbv2.ts:2258](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2258)

---

### queuePubkey

• **queuePubkey**: `PublicKey`

The pubkey of the linked oracle queue.

#### Defined in

[sbv2.ts:2254](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2254)

---

### readyPubkeys

• `Optional` **readyPubkeys**: `PublicKey`[]

Array of pubkeys to attempt to pop. If discluded, this will be loaded
from the crank upon calling.

#### Defined in

[sbv2.ts:2263](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2263)

---

### tokenMint

• **tokenMint**: `PublicKey`

#### Defined in

[sbv2.ts:2270](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L2270)
