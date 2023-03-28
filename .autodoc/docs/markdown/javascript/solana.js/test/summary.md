[View code on GitHub](https://github.com/switchboard-xyz/sbv2-solana/tree/master/.autodoc/docs/json/javascript/solana.js/test)

The code in this folder contains test suites for various functionalities of the `sbv2-solana` project, ensuring the integrity and correctness of the implemented features. The tests are written using the Mocha testing framework and cover a wide range of scenarios, from creating and managing aggregator accounts to handling data requests and responses between oracles and users.

For example, the `aggregator.spec.ts` file tests the Aggregator functionality, such as creating and funding an aggregator, adding and removing jobs, updating job weights, and managing aggregator leases. The `buffer-relayer.spec.ts` file tests the `BufferRelayer` functionality, which manages data requests and responses between oracles and users.

```javascript
const [aggregatorAccount] = await queueAccount.createFeed({ ... });
```

The `crank.spec.ts` file tests the Crank functionality, which manages a queue of aggregator accounts used to collect and aggregate data from various data sources (oracles). The tests ensure that the Crank can create, add, and remove aggregator accounts, as well as handle various edge cases and permissions.

```javascript
const [crankAccount] = await CrankAccount.create(ctx.program, {
  maxRows: 100,
  queueAccount: queueAccount,
});
```

The `lease.spec.ts` file tests the `LeaseAccount` functionality, which manages leases for aggregator accounts. The tests cover creating a lease and extending a lease.

```javascript
const [leaseAccount] = await sbv2.LeaseAccount.create(ctx.program, {
  aggregatorAccount,
  queueAccount,
  fundAmount: fundAmount,
  funderTokenWallet: userTokenAddress,
});
```

The `oracle.spec.ts` file tests the `OracleAccount` functionality, which is crucial for the overall functionality of the `sbv2-solana` project. The tests cover various aspects of the `OracleAccount`, such as depositing and withdrawing from an oracle's staking wallet and performing heartbeat operations.

```javascript
const [oracleAccount] = await queueAccount.createOracle({
  oracleAuthority: oracleAuthority.publicKey,
  enable: true,
});
```

These test suites help maintain the integrity of the `sbv2-solana` project and ensure that the implemented features work as intended. Developers can use these tests as a reference for understanding the expected behavior of various components and functionalities within the project.
