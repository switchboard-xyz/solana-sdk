import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { sleep, SwitchboardTestContext } from "@switchboard-xyz/sbv2-utils";
import type { AnchorWallet } from "@switchboard-xyz/switchboard-v2";
import assert from "assert";
import chai from "chai";
import {
  AnchorFeedParser,
  IDL,
} from "../../../target/types/anchor_feed_parser";
import { PROGRAM_ID } from "../client/programId";
const expect = chai.expect;

// Anchor.toml will copy this to localnet when we start our tests
const DEFAULT_SOL_USD_FEED = new PublicKey(
  "GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR"
);

describe("anchor-feed-parser test", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // const feedParserProgram = anchor.workspace
  //   .AnchorFeedParser as Program<AnchorFeedParser>;

  const feedParserProgram = new anchor.Program(
    IDL,
    PROGRAM_ID,
    provider,
    new anchor.BorshCoder(IDL)
  ) as anchor.Program<AnchorFeedParser>;

  const payer = (provider.wallet as AnchorWallet).payer;

  let switchboard: SwitchboardTestContext;
  let aggregatorKey: PublicKey;

  before(async () => {
    // First, attempt to load the switchboard devnet PID
    try {
      switchboard = await SwitchboardTestContext.loadDevnetQueue(
        provider,
        "F8ce7MsckeZAbAGmxjJNetxYXQa9mKr9nnrC3qKubyYy"
      );
      aggregatorKey = DEFAULT_SOL_USD_FEED;
      console.log("devnet detected");
      return;
    } catch (error: any) {
      console.log(`Error: SBV2 Devnet - ${error.message}`);
    }
    // If fails, fallback to looking for a local env file
    try {
      switchboard = await SwitchboardTestContext.loadFromEnv(provider);
      const aggregatorAccount = await switchboard.createStaticFeed(100);
      aggregatorKey = aggregatorAccount.publicKey ?? PublicKey.default;
      console.log("local env detected");
      return;
    } catch (error: any) {
      console.log(`Error: SBV2 Localnet - ${error.message}`);
    }
    // If fails, throw error
    throw new Error(
      `Failed to load the SwitchboardTestContext from devnet or from a switchboard.env file`
    );
  });

  it("Read SOL/USD Feed", async () => {
    const signature = await feedParserProgram.methods
      .readResult({ maxConfidenceInterval: 0.25 })
      .accounts({ aggregator: aggregatorKey })
      .rpc();

    // wait for RPC
    await sleep(2000);

    const logs = await provider.connection.getParsedTransaction(
      signature,
      "confirmed"
    );

    console.log(JSON.stringify(logs?.meta?.logMessages, undefined, 2));
  });

  it("Fails to read feed if confidence interval is exceeded", async () => {
    // await assertThrowsAsync(
    //   async () =>
    //     feedParserProgram.methods
    //       .readResult({ maxConfidenceInterval: 0.0000000001 })
    //       .accounts({ aggregator: aggregatorKey })
    //       .rpc(),
    //   /Error/
    // );

    await assert.rejects(
      async () => {
        await feedParserProgram.methods
          .readResult({ maxConfidenceInterval: 0.0000000001 })
          .accounts({ aggregator: aggregatorKey })
          .rpc();
      },
      /ConfidenceIntervalExceeded/,
      "Confidence interval was not exceeded"
    );
  });
});
