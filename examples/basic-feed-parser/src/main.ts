/* eslint-disable unicorn/no-process-exit */
import { PublicKey, Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import {
  AggregatorAccount,
  loadSwitchboardProgram,
} from "@switchboard-xyz/switchboard-v2";

// SOL/USD Feed https://switchboard.xyz/explorer/2/GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR
// Create your own feed here https://publish.switchboard.xyz/
const switchboardFeed = new PublicKey(
  "GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR"
);

async function main() {
  // load the switchboard program
  const program = await loadSwitchboardProgram(
    "devnet",
    new Connection(clusterApiUrl("devnet")),
    Keypair.fromSeed(new Uint8Array(32).fill(1)) // using dummy keypair since we wont be submitting any transactions
  );

  // load the switchboard aggregator
  const aggregator = new AggregatorAccount({
    program,
    publicKey: switchboardFeed,
  });

  // get the result
  const result = await aggregator.getLatestValue();
  console.log(`Switchboard Result: ${result}`);
}

main().then(
  () => process.exit(),
  (error) => {
    console.error("Failed to parse Switchboard Feed");
    console.error(error);
    process.exit(-1);
  }
);
