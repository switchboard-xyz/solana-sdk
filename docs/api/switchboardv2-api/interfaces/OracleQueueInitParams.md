[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / OracleQueueInitParams

# Interface: OracleQueueInitParams

Parameters for initializing OracleQueueAccount

## Table of contents

### Properties

- [authority](OracleQueueInitParams.md#authority)
- [consecutiveFeedFailureLimit](OracleQueueInitParams.md#consecutivefeedfailurelimit)
- [consecutiveOracleFailureLimit](OracleQueueInitParams.md#consecutiveoraclefailurelimit)
- [feedProbationPeriod](OracleQueueInitParams.md#feedprobationperiod)
- [metadata](OracleQueueInitParams.md#metadata)
- [minStake](OracleQueueInitParams.md#minstake)
- [minimumDelaySeconds](OracleQueueInitParams.md#minimumdelayseconds)
- [name](OracleQueueInitParams.md#name)
- [oracleTimeout](OracleQueueInitParams.md#oracletimeout)
- [queueSize](OracleQueueInitParams.md#queuesize)
- [reward](OracleQueueInitParams.md#reward)
- [slashingEnabled](OracleQueueInitParams.md#slashingenabled)
- [unpermissionedFeeds](OracleQueueInitParams.md#unpermissionedfeeds)
- [unpermissionedVrf](OracleQueueInitParams.md#unpermissionedvrf)
- [varianceToleranceMultiplier](OracleQueueInitParams.md#variancetolerancemultiplier)

## Properties

### authority

• **authority**: `PublicKey`

The account to delegate authority to for creating permissions targeted
at the queue.

#### Defined in

[sbv2.ts:1651](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1651)

---

### consecutiveFeedFailureLimit

• `Optional` **consecutiveFeedFailureLimit**: `BN`

Consecutive failure limit for a feed before feed permission is revoked.

#### Defined in

[sbv2.ts:1670](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1670)

---

### consecutiveOracleFailureLimit

• `Optional` **consecutiveOracleFailureLimit**: `BN`

TODO: implement
Consecutive failure limit for an oracle before oracle permission is revoked.

#### Defined in

[sbv2.ts:1675](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1675)

---

### feedProbationPeriod

• `Optional` **feedProbationPeriod**: `number`

After a feed lease is funded or re-funded, it must consecutively succeed
N amount of times or its authorization to use the queue is auto-revoked.

#### Defined in

[sbv2.ts:1646](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1646)

---

### metadata

• `Optional` **metadata**: `Buffer`

Buffer for queue metadata

#### Defined in

[sbv2.ts:1633](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1633)

---

### minStake

• **minStake**: `BN`

The minimum amount of stake oracles must present to remain on the queue.

#### Defined in

[sbv2.ts:1641](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1641)

---

### minimumDelaySeconds

• `Optional` **minimumDelaySeconds**: `number`

the minimum update delay time for Aggregators

#### Defined in

[sbv2.ts:1680](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1680)

---

### name

• `Optional` **name**: `Buffer`

A name to assign to this OracleQueue

#### Defined in

[sbv2.ts:1629](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1629)

---

### oracleTimeout

• `Optional` **oracleTimeout**: `BN`

Time period we should remove an oracle after if no response.

#### Defined in

[sbv2.ts:1655](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1655)

---

### queueSize

• `Optional` **queueSize**: `number`

Optionally set the size of the queue.

#### Defined in

[sbv2.ts:1684](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1684)

---

### reward

• **reward**: `BN`

Rewards to provide oracles and round openers on this queue.

#### Defined in

[sbv2.ts:1637](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1637)

---

### slashingEnabled

• `Optional` **slashingEnabled**: `boolean`

Whether slashing is enabled on this queue.

#### Defined in

[sbv2.ts:1659](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1659)

---

### unpermissionedFeeds

• `Optional` **unpermissionedFeeds**: `boolean`

Eanbling this setting means data feeds do not need explicit permission
to join the queue.

#### Defined in

[sbv2.ts:1689](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1689)

---

### unpermissionedVrf

• `Optional` **unpermissionedVrf**: `boolean`

Eanbling this setting means data feeds do not need explicit permission
to request VRF proofs and verifications from this queue.

#### Defined in

[sbv2.ts:1694](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1694)

---

### varianceToleranceMultiplier

• `Optional` **varianceToleranceMultiplier**: `number`

The tolerated variance amount oracle results can have from the
accepted round result before being slashed.
slashBound = varianceToleranceMultiplier \* stdDeviation
Default: 2

#### Defined in

[sbv2.ts:1666](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L1666)
