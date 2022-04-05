[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / AccountParams

# Interface: AccountParams

Input parameters for constructing wrapped representations of Switchboard accounts.

## Table of contents

### Properties

- [keypair](AccountParams.md#keypair)
- [program](AccountParams.md#program)
- [publicKey](AccountParams.md#publickey)

## Properties

### keypair

• `Optional` **keypair**: `Keypair`

Keypair of the account being referenced. This may not always be populated.

#### Defined in

[sbv2.ts:141](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L141)

---

### program

• **program**: `Program`<`Idl`\>

program referencing the Switchboard program and IDL.

#### Defined in

[sbv2.ts:132](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L132)

---

### publicKey

• `Optional` **publicKey**: `PublicKey`

Public key of the account being referenced. This will always be populated
within the account wrapper.

#### Defined in

[sbv2.ts:137](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L137)
