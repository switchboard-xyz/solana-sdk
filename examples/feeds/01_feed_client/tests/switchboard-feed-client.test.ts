import "mocha";

import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider } from "@coral-xyz/anchor";

import { SwitchboardFeedClient } from "../target/types/switchboard_feed_client";
import { sleep } from "@switchboard-xyz/common";
import {
  AggregatorAccount,
  SwitchboardProgram,
} from "@switchboard-xyz/solana.js";
import { PublicKey } from "@solana/web3.js";

const AGGREGATOR_PUBKEY = new PublicKey(
  "GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR"
);

describe("switchboard-feed-client test", () => {
  const provider = AnchorProvider.env();
  anchor.setProvider(provider);

  const program: anchor.Program<SwitchboardFeedClient> =
    anchor.workspace.AnchorVrfParser;

  let switchboard: SwitchboardProgram;
  let aggregatorAccount: AggregatorAccount;

  before(async () => {
    switchboard = await SwitchboardProgram.fromProvider(provider);
    aggregatorAccount = new AggregatorAccount(switchboard, AGGREGATOR_PUBKEY);
  });

  it("Reads a Switchboard data feed", async () => {
    const aggregator = await aggregatorAccount.loadData();
    const latestValue = AggregatorAccount.decodeLatestValue(aggregator);

    const tx = await program.methods
      .readFeed({ maxConfidenceInterval: null })
      .accounts({ aggregator: aggregatorAccount.publicKey })
      .rpc();

    const confirmedTxn = await program.provider.connection.getParsedTransaction(
      tx,
      "confirmed"
    );

    console.log(JSON.stringify(confirmedTxn?.meta?.logMessages, undefined, 2));

    // TODO: Parse logs and make sure it matches the latestValue
  });

  /** Example showing how to read a history buffer on-chain for an existing feed with an existing history buffer with pre-populated samples. (This will only work on devnet) */
  it("Reads an aggregator history buffer", async () => {
    const aggregator = await aggregatorAccount.loadData();

    // TODO: Verify the value in the program logs matches the history samples
    const history = await aggregatorAccount.loadHistory();

    const tx = await program.methods
      .readHistory({ timestamp: null })
      .accounts({
        aggregator: aggregatorAccount.publicKey,
        historyBuffer: aggregator.historyBuffer,
      })
      .rpc();
    console.log("Your transaction signature", tx);

    await sleep(5000);

    const confirmedTxn = await program.provider.connection.getParsedTransaction(
      tx,
      "confirmed"
    );

    console.log(JSON.stringify(confirmedTxn?.meta?.logMessages, undefined, 2));
  });
});
