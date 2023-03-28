[View code on GitHub](https://github.com/switchboard-xyz/sbv2-solana/tree/master/.autodoc/docs/json/programs)

The `.autodoc/docs/json/programs` folder in the `sbv2-solana` project contains various modules and test suites that are crucial for interacting with the Solana blockchain and the Switchboard oracle network. These modules handle tasks such as creating and reading buffer accounts, parsing and reading data from aggregator feeds, managing data feeds with history buffers, and working with Verifiable Random Function (VRF) clients.

For example, the `anchor-buffer-parser` module enables the system to fetch data from external sources and store it in buffer accounts on the Solana blockchain. The test suite in the `tests` folder ensures that the module functions correctly and can be used to interact with external data sources.

```javascript
const url = "https://api.example.com/data";
const expectedResult = "some data";
const bufferRelayer = await switchboard.queue.createBufferRelayer(url);
const wrappedUser = await switchboard.program.mint.getOrCreateWrappedUser(payer);
const bufferAccount = await bufferRelayer.openRoundAndAwaitResult(wrappedUser);
const result = await bufferParserProgram.readResult(bufferAccount);
assert.equal(result, expectedResult);
```

The `anchor-feed-parser` module is responsible for parsing and reading data from an aggregator feed on the Solana blockchain. The test suite in the `tests` subfolder ensures the correct functionality of the module by creating a new aggregator feed, opening a new round, and asserting that the feed's result is as expected.

```typescript
const feed = await testContext.createAggregatorFeed({ jobs: [{ type: 'static', value: 100 }] });
await feed.openRound();
await testContext.waitForRoundResult(feed);
expect(feed.getResult()).toEqual(100);
const result = await anchorFeedParser.readResult(feed);
expect(result).toEqual(100);
```

The `anchor-history-parser` module focuses on creating and reading data feeds with history buffers. The test suite demonstrates how to create a new data feed with a history buffer and how to read a history buffer on-chain for an existing feed.

```typescript
const feed = await switchboard.queue.createFeed({
  maxHistory: 200000,
  jobs: [/* ... */],
});
await feed.loadData();
const aggregator = new AggregatorAccount(feed.aggregator);
await aggregator.loadData();
const result = await program.methods.readHistory(/* ... */);
console.log("Transaction signature:", result.signature);
console.log("Parsed transaction logs:", result.logs);
```

The `anchor-vrf-parser` folder contains code for managing the state and results of a VRF client on the Solana blockchain. The modules in this folder provide a way to initialize the client's state, request random numbers from the Switchboard V2 oracle network, update the client's state with the latest results, and close the VRF account when necessary.

```rust
let params = InitStateParams {
   max_result: 100,
   permission_bump: 1,
   switchboard_state_bump: 2,
};
let ctx = Context::new(...);
let init_state = InitState::new(...);
init_state.validate(&ctx, &params)?;
init_state.actuate(&ctx, &params)?;
```

These modules and test suites are essential for developers working on the `sbv2-solana` project, as they ensure the correct functionality of various components and their ability to interact with the Solana blockchain and the Switchboard oracle network.
