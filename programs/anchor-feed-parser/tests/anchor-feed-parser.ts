import type { Program } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { SwitchboardTestContext } from "@switchboard-xyz/switchboard-v2";
import { createReadResultInstruction } from "../src";
import type { AnchorFeedParser } from "../target/types/anchor_feed_parser";

const sleep = (ms: number): Promise<any> =>
  new Promise((s) => setTimeout(s, ms));

const DEFAULT_SOL_USD_FEED = new PublicKey(
  "GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR"
);

describe("anchor-feed-parser", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .AnchorFeedParser as Program<AnchorFeedParser>;

  let aggregatorKey: PublicKey;

  const connection = new anchor.web3.Connection(
    provider.connection.rpcEndpoint,
    { commitment: "finalized" }
  );

  before(async () => {
    const accountInfo = await connection.getAccountInfo(DEFAULT_SOL_USD_FEED);
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
    const instruction = createReadResultInstruction({
      aggregator: aggregatorKey,
    });

    const transaction = new anchor.web3.Transaction();
    transaction.add(instruction);

    const tx = await provider.sendAndConfirm(transaction);

    // // Using Anchor Program to send transaction
    // const tx = await program.rpc.readResult({
    //   accounts: {
    //     aggregator: aggregatorKey,
    //   },
    // });

    // wait for RPC
    await sleep(2000);

    const logs = await provider.connection.getParsedTransaction(
      tx,
      "confirmed"
    );
    console.log(JSON.stringify(logs?.meta?.logMessages, undefined, 2));
  });
});
