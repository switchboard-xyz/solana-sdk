import type { Program } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { SwitchboardTestContext } from "@switchboard-xyz/sbv2-utils";
import type { AnchorFeedParser } from "../../../target/types/anchor_feed_parser";

const sleep = (ms: number): Promise<any> =>
  new Promise((s) => setTimeout(s, ms));

// Anchor.toml will copy this to localnet when we start our tests
const DEFAULT_SOL_USD_FEED = new PublicKey(
  "GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR"
);

describe("anchor-feed-parser test", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const feedParserProgram = anchor.workspace
    .AnchorFeedParser as Program<AnchorFeedParser>;
  const provider = feedParserProgram.provider as anchor.AnchorProvider;

  let switchboard: SwitchboardTestContext;
  let aggregatorKey: PublicKey;

  before(async () => {
    // First, attempt to load the switchboard devnet PID
    try {
      switchboard = await SwitchboardTestContext.loadDevnetQueue(provider);
      aggregatorKey = DEFAULT_SOL_USD_FEED;
      console.log("devnet detected");
      return;
    } catch (error) {
      console.log(error);
    }
    // If fails, fallback to looking for a local env file
    try {
      switchboard = await SwitchboardTestContext.loadFromEnv(provider);
      const aggregatorAccount = await switchboard.createStaticFeed(100);
      aggregatorKey = aggregatorAccount.publicKey ?? PublicKey.default;
      console.log("localnet detected");
      return;
    } catch (error) {
      console.log(error);
    }
    // If fails, throw error
    throw new Error(
      `Failed to load the SwitchboardTestContext from devnet or from a switchboard.env file`
    );
  });

  it("Read SOL/USD Feed", async () => {
    const signature = await feedParserProgram.methods
      .readResult()
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
});
