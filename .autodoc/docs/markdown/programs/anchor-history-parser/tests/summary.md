[View code on GitHub](https://github.com/switchboard-xyz/sbv2-solana/tree/master/.autodoc/docs/json/programs/anchor-history-parser/tests)

The `anchor-history-parser.test.ts` file is a test suite for the `anchor-history-parser` module, which is responsible for interacting with the Switchboard oracle network on the Solana blockchain. This module focuses on creating and reading data feeds with history buffers. The test suite demonstrates how to create a new data feed with a history buffer and how to read a history buffer on-chain for an existing feed.

The test suite sets up a local development environment using the `anchor.AnchorProvider.env()` method and initializes a `SwitchboardTestContext` object with custom configurations. It also creates a `NodeOracle` instance from the testnet release channel and starts it.

Here's an example of how the code in this file might be used:

```typescript
// Set up a local development environment
const provider = anchor.AnchorProvider.env();
const switchboard = new SwitchboardTestContext(provider);

// Create a new data feed with a history buffer that can store up to 200,000 samples
const feed = await switchboard.queue.createFeed({
  maxHistory: 200000,
  jobs: [/* ... */],
});

// Load the aggregator and history data
await feed.loadData();

// Read a history buffer on-chain for an existing feed with pre-populated samples
const aggregator = new AggregatorAccount(feed.aggregator);
await aggregator.loadData();

// Read the history buffer at a specific timestamp
const result = await program.methods.readHistory(/* ... */);
console.log("Transaction signature:", result.signature);
console.log("Parsed transaction logs:", result.logs);
```

In the first test, "Creates a feed with a history buffer", the code demonstrates how to create a new data feed with a history buffer that can store up to 200,000 samples. It uses the `switchboard.queue.createFeed()` method to create the feed with the specified configuration and jobs. After creating the feed, it loads the aggregator and history data using the `loadData()` method.

In the second test, "Reads an aggregator history buffer", the code shows how to read a history buffer on-chain for an existing feed with pre-populated samples. It first loads the aggregator data using the `AggregatorAccount` class and the `loadData()` method. Then, it reads the history buffer using the `loadHistory()` method. Finally, it sends a transaction to the Solana network to read the history buffer at a specific timestamp using the `program.methods.readHistory()` method. The transaction signature and parsed transaction logs are printed to the console.

These tests serve as examples for developers to understand how to interact with the Switchboard oracle network on Solana using the `anchor-history-parser` module, specifically focusing on creating and reading data feeds with history buffers.
