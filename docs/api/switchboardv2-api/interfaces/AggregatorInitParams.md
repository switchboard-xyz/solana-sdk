[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / AggregatorInitParams

# Interface: AggregatorInitParams

Parameters to initialize an aggregator account.

## Table of contents

### Properties

- [authorWallet](AggregatorInitParams.md#authorwallet)
- [authority](AggregatorInitParams.md#authority)
- [batchSize](AggregatorInitParams.md#batchsize)
- [expiration](AggregatorInitParams.md#expiration)
- [forceReportPeriod](AggregatorInitParams.md#forcereportperiod)
- [keypair](AggregatorInitParams.md#keypair)
- [metadata](AggregatorInitParams.md#metadata)
- [minRequiredJobResults](AggregatorInitParams.md#minrequiredjobresults)
- [minRequiredOracleResults](AggregatorInitParams.md#minrequiredoracleresults)
- [minUpdateDelaySeconds](AggregatorInitParams.md#minupdatedelayseconds)
- [name](AggregatorInitParams.md#name)
- [queueAccount](AggregatorInitParams.md#queueaccount)
- [startAfter](AggregatorInitParams.md#startafter)
- [varianceThreshold](AggregatorInitParams.md#variancethreshold)

## Properties

### authorWallet

• `Optional` **authorWallet**: `PublicKey`

An optional wallet for receiving kickbacks from job usage in feeds.
Defaults to token vault.

#### Defined in

[sbv2.ts:410](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L410)

---

### authority

• `Optional` **authority**: `PublicKey`

If included, this keypair will be the aggregator authority rather than
the aggregator keypair.

#### Defined in

[sbv2.ts:415](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L415)

---

### batchSize

• **batchSize**: `number`

Number of oracles to request on aggregator update.

#### Defined in

[sbv2.ts:365](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L365)

---

### expiration

• `Optional` **expiration**: `BN`

unix_timestamp after which funds may be withdrawn from the aggregator.
null/undefined/0 means the feed has no expiration.

#### Defined in

[sbv2.ts:401](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L401)

---

### forceReportPeriod

• `Optional` **forceReportPeriod**: `BN`

Number of seconds for which, even if the variance threshold is not passed,
accept new responses from oracles.

#### Defined in

[sbv2.ts:396](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L396)

---

### keypair

• `Optional` **keypair**: `Keypair`

Optional pre-existing keypair to use for aggregator initialization.

#### Defined in

[sbv2.ts:405](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L405)

---

### metadata

• `Optional` **metadata**: `Buffer`

Metadata of the aggregator to store on-chain.

#### Defined in

[sbv2.ts:361](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L361)

---

### minRequiredJobResults

• **minRequiredJobResults**: `number`

Minimum number of feed jobs suggested to be successful before an oracle
sends a response.

#### Defined in

[sbv2.ts:374](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L374)

---

### minRequiredOracleResults

• **minRequiredOracleResults**: `number`

Minimum number of oracle responses required before a round is validated.

#### Defined in

[sbv2.ts:369](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L369)

---

### minUpdateDelaySeconds

• **minUpdateDelaySeconds**: `number`

Minimum number of seconds required between aggregator rounds.

#### Defined in

[sbv2.ts:378](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L378)

---

### name

• `Optional` **name**: `Buffer`

Name of the aggregator to store on-chain.

#### Defined in

[sbv2.ts:357](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L357)

---

### queueAccount

• **queueAccount**: [`OracleQueueAccount`](../classes/OracleQueueAccount.md)

The queue to which this aggregator will be linked

#### Defined in

[sbv2.ts:382](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L382)

---

### startAfter

• `Optional` **startAfter**: `number`

unix_timestamp for which no feed update will occur before.

#### Defined in

[sbv2.ts:386](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L386)

---

### varianceThreshold

• `Optional` **varianceThreshold**: `number`

Change percentage required between a previous round and the current round.
If variance percentage is not met, reject new oracle responses.

#### Defined in

[sbv2.ts:391](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L391)
