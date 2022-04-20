# Switchboard V2 Lite

A lightweight library to decode and parse aggregator accounts

## Install

```
npm i @switchboard-xyz/sbv2-lite
```

## Example

```ts
import SwitchboardProgram from "@switchboard-xyz/sbv2-lite";

//

const sbv2 = await SwitchboardProgram.loadDevnet();

// SOL_USD Aggregator https://switchboard.xyz/explorer
const solAggregator = new anchor.web3.PublicKey(
  "GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR"
);

const accountInfo = await sbv2.program.provider.connection.getAccountInfo(
  solAggregator
);
if (!accountInfo) {
  throw new Error(`failed to fetch account info`);
}

// Get latest value if its been updated in the last 300 seconds
const latestResult = sbv2.decodeLatestAggregatorValue(accountInfo, 300);
if (latestResult === null) {
  throw new Error(`failed to fetch latest result for aggregator`);
}
console.log(`latestResult: ${latestResult}`);
// latestResult: 105.673205
```
