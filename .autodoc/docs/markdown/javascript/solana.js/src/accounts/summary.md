[View code on GitHub](https://github.com/switchboard-xyz/sbv2-solana/tree/master/.autodoc/docs/json/javascript/solana.js/src/accounts)

The `.autodoc/docs/json/javascript/solana.js/src/accounts` folder contains various classes and types related to different account types in the `sbv2-solana` project. These account classes are used to interact with on-chain resources, such as oracles, aggregators, and jobs.

For example, the `AggregatorAccount` class is responsible for managing aggregator accounts that collect and aggregate data from multiple oracles. You can create an `AggregatorAccount` instance and load its associated data from the blockchain as follows:

```javascript
const aggregatorAccount = new AggregatorAccount(switchboardProgram, publicKey);
const aggregatorData = await aggregatorAccount.loadData();
```

The `AggregatorHistoryBuffer` class represents a round-robin buffer of historical samples for an aggregator account. It provides methods to create, decode, and fetch historical data from the buffer. This is useful for tracking the history of data points in an aggregator account, such as price feeds or other time-series data.

```ts
import { AggregatorAccount, AggregatorHistoryBuffer } from '@switchboard-xyz/solana.js';
const aggregatorAccount = new AggregatorAccount(program, aggregatorKey);
const aggregator = await aggregatorAccount.loadData();
const [historyBuffer, addHistorySignature] = await AggregatorHistoryBuffer.create(program, {
   aggregatorAccount,
   maxSamples: 10000,
});
const history = await historyBuffer.loadData();
```

The `CrankAccount` class is responsible for managing a priority queue of aggregators and their next available update time. This scheduling mechanism ensures that `AggregatorAccount`s are updated as close as possible to their specified update interval.

```javascript
const [crankAccount, txnSignature] = await CrankAccount.create(
  program,
  {
    queueAccount: queueAccountInstance,
    name: 'exampleCrank',
    metadata: 'exampleMetadata',
    maxRows: 500,
  }
);
```

The `PermissionAccount` class is responsible for managing permissions between a granter and a grantee in the sbv2-solana project. It is used to dictate the level of permissions between these two entities.

```javascript
const [account, txSignature] = await PermissionAccount.create(program, {
  granter: granterPublicKey,
  grantee: granteePublicKey,
  authority: authorityPublicKey,
});
```

These account classes and types are essential for managing and interacting with on-chain resources in the `sbv2-solana` project, a decentralized oracle network built on the Solana blockchain.
