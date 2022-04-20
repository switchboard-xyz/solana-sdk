import * as anchor from "@project-serum/anchor";
import SwitchboardProgram from "./src";

async function main() {
  // SOL_USD Aggregator https://switchboard.xyz/explorer
  const solAggregator = new anchor.web3.PublicKey(
    "GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR"
  );
  const sbv2 = await SwitchboardProgram.loadDevnet();
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
}

main().catch((err) => {
  console.error(err);
});
