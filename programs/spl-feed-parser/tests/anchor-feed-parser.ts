import type { Program } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { SwitchboardTestContext } from "@switchboard-xyz/switchboard-v2";
import type { AnchorFeedParser } from "../../../target/types/anchor_feed_parser";

const sleep = (ms: number): Promise<any> =>
  new Promise((s) => setTimeout(s, ms));

// Anchor.toml will copy this to localnet when we start our tests
const DEFAULT_SOL_USD_FEED = new PublicKey(
  "GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR"
);

describe("anchor-feed-parser", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const feedParserProgram = anchor.workspace
    .AnchorFeedParser as Program<AnchorFeedParser>;
  const provider = feedParserProgram.provider as anchor.AnchorProvider;

  let aggregatorKey: PublicKey;

  before(async () => {
    const accountInfo = await provider.connection.getAccountInfo(
      DEFAULT_SOL_USD_FEED
    );
    if (accountInfo) {
      aggregatorKey = DEFAULT_SOL_USD_FEED;
      return;
    }

    // create an aggregator
    try {
      const switchboard = await SwitchboardTestContext.loadFromEnv(provider);
      const staticFeed = await switchboard.createStaticFeed(100);
      if (!staticFeed.publicKey) {
        throw new Error("failed to read aggregatorKey");
      }
      aggregatorKey = staticFeed.publicKey;
      console.log(`created aggregator ${aggregatorKey}`);
      await sleep(2000);
    } catch (error) {
      console.error(error);
      throw new Error(
        `failed to load switchboard aggregator or switchboard.env`
      );
    }
  });

  it("Read SOL/USD Feed", async () => {
    return;
  });
});
