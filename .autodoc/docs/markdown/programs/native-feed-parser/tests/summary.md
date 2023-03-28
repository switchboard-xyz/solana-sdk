[View code on GitHub](https://github.com/switchboard-xyz/sbv2-solana/tree/master/.autodoc/docs/json/programs/native-feed-parser/tests)

The `spl-feed-parser.test.ts` file is a test suite for the `native-feed-parser` module in the `sbv2-solana` project, ensuring that the native feed parser can correctly read and process data from a SOL/USD feed on the Solana blockchain. The test suite imports necessary dependencies and defines a helper function `getProgramId()` to retrieve the program ID from a keypair file.

The main test suite is defined using the `describe()` function, which sets up the testing environment and runs the test cases. Before running the test cases, the `before()` function initializes a `SwitchboardTestContext` object to manage the testing environment and a `NodeOracle` object responsible for fetching data from the Solana blockchain. The `NodeOracle` is started and awaits its initialization. After the test cases have been executed, the `after()` function stops the `NodeOracle`.

The primary test case, "Read SOL/USD Feed", performs several steps to ensure the native feed parser's functionality:

1. Create a new feed with the specified configuration using the `switchboard.queue.createFeed()` method.
2. Load the aggregator account data and open a new round, waiting for the result.
3. Decode the latest value from the updated aggregator state and assert that the result is equal to 100.
4. Create a new transaction to read the data from the Switchboard aggregator using the `TransactionInstruction` class.
5. Send and confirm the transaction using the `provider.sendAndConfirm()` method.
6. Retrieve the transaction logs and parse the feed result from the log messages.
7. Assert that the feed result is equal to 100.

This test suite ensures that the native feed parser can correctly read and process data from a SOL/USD feed on the Solana blockchain, which is an essential functionality for the larger `sbv2-solana` project.

For example, developers working on the `sbv2-solana` project can use this test suite to verify that the native feed parser is working correctly when reading and processing data from a SOL/USD feed. This can help identify any issues or bugs in the native feed parser implementation and ensure that it meets the project's requirements.

```typescript
import { describe, before, after } from "mocha";
import { getProgramId } from "../src/utils";
import { SwitchboardTestContext, NodeOracle } from "../src";

describe("native-feed-parser", () => {
  let switchboard: SwitchboardTestContext;
  let oracle: NodeOracle;

  before(async () => {
    // Initialize SwitchboardTestContext and NodeOracle
  });

  after(() => {
    // Stop the NodeOracle
  });

  it("Read SOL/USD Feed", async () => {
    // Test steps to ensure native feed parser functionality
  });
});
```
