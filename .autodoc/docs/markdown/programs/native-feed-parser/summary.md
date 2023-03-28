[View code on GitHub](https://github.com/switchboard-xyz/sbv2-solana/tree/master/.autodoc/docs/json/programs/native-feed-parser)

The `native-feed-parser` module in the `sbv2-solana` project is responsible for reading and processing data from a SOL/USD feed on the Solana blockchain. The test suite in the `spl-feed-parser.test.ts` file ensures that the native feed parser can correctly perform its intended functionality.

The test suite imports necessary dependencies and defines a helper function `getProgramId()` to retrieve the program ID from a keypair file. It sets up the testing environment using the `describe()` function and initializes a `SwitchboardTestContext` object to manage the testing environment and a `NodeOracle` object responsible for fetching data from the Solana blockchain. The `NodeOracle` is started and awaits its initialization.

The primary test case, "Read SOL/USD Feed", performs several steps to ensure the native feed parser's functionality:

1. Create a new feed with the specified configuration using the `switchboard.queue.createFeed()` method.
2. Load the aggregator account data and open a new round, waiting for the result.
3. Decode the latest value from the updated aggregator state and assert that the result is equal to 100.
4. Create a new transaction to read the data from the Switchboard aggregator using the `TransactionInstruction` class.
5. Send and confirm the transaction using the `provider.sendAndConfirm()` method.
6. Retrieve the transaction logs and parse the feed result from the log messages.
7. Assert that the feed result is equal to 100.

Developers working on the `sbv2-solana` project can use this test suite to verify that the native feed parser is working correctly when reading and processing data from a SOL/USD feed. This can help identify any issues or bugs in the native feed parser implementation and ensure that it meets the project's requirements.

For example, developers can use the following code snippet to create a new feed and read data from the Switchboard aggregator:

```typescript
import { SwitchboardTestContext, NodeOracle } from "../src";

async function readSolUsdFeed() {
  const switchboard = new SwitchboardTestContext();
  const oracle = new NodeOracle();

  // Initialize SwitchboardTestContext and NodeOracle
  await switchboard.initialize();
  await oracle.start();

  // Create a new feed and read data from the Switchboard aggregator
  const feed = await switchboard.queue.createFeed(/* configuration */);
  const aggregatorData = await feed.loadAggregatorAccountData();
  const latestValue = aggregatorData.decodeLatestValue();

  // Stop the NodeOracle
  oracle.stop();

  return latestValue;
}

readSolUsdFeed().then((latestValue) => {
  console.log("Latest SOL/USD value:", latestValue);
});
```

This test suite ensures that the native feed parser can correctly read and process data from a SOL/USD feed on the Solana blockchain, which is an essential functionality for the larger `sbv2-solana` project.
