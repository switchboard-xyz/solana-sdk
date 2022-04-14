[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / JobInitParams

# Interface: JobInitParams

Parameters for initializing JobAccount

## Table of contents

### Properties

- [authorWallet](JobInitParams.md#authorwallet)
- [data](JobInitParams.md#data)
- [expiration](JobInitParams.md#expiration)
- [keypair](JobInitParams.md#keypair)
- [name](JobInitParams.md#name)
- [variables](JobInitParams.md#variables)

## Properties

### authorWallet

• `Optional` **authorWallet**: `PublicKey`

An optional wallet for receiving kickbacks from job usage in feeds.
Defaults to token vault.

#### Defined in

[sbv2.ts:1301](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1301)

---

### data

• **data**: `Buffer`

A serialized protocol buffer holding the schema of the job.

#### Defined in

[sbv2.ts:1288](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1288)

---

### expiration

• `Optional` **expiration**: `BN`

unix_timestamp of when funds can be withdrawn from this account.

#### Defined in

[sbv2.ts:1284](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1284)

---

### keypair

• `Optional` **keypair**: `Keypair`

A pre-generated keypair to use.

#### Defined in

[sbv2.ts:1296](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1296)

---

### name

• `Optional` **name**: `Buffer`

An optional name to apply to the job account.

#### Defined in

[sbv2.ts:1280](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1280)

---

### variables

• `Optional` **variables**: `string`[]

A required variables oracles must fill to complete the job.

#### Defined in

[sbv2.ts:1292](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1292)
