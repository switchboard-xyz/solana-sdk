[@switchboard-xyz/switchboard-v2](/api/switchboardv2-api) / AggregatorOpenRoundParams

# Interface: AggregatorOpenRoundParams

Parameters required to open an aggregator round

## Table of contents

### Properties

- [oracleQueueAccount](AggregatorOpenRoundParams.md#oraclequeueaccount)
- [payoutWallet](AggregatorOpenRoundParams.md#payoutwallet)

## Properties

### oracleQueueAccount

• **oracleQueueAccount**: [`OracleQueueAccount`](../classes/OracleQueueAccount.md)

The oracle queue from which oracles are assigned this update.

#### Defined in

[sbv2.ts:483](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L483)

---

### payoutWallet

• **payoutWallet**: `PublicKey`

The token wallet which will receive rewards for calling update on this feed.

#### Defined in

[sbv2.ts:487](https://github.com/switchboard-xyz/switchboardv2-api/blob/dad46fc4/src/sbv2.ts#L487)
