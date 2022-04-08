import type { Program } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import type { AnchorFeedParser } from "../target/types/anchor_feed_parser";

const sleep = (ms: number): Promise<any> =>
  new Promise((s) => setTimeout(s, ms));

const SOL_USD_FEED = new PublicKey(
  "GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR"
);

describe("anchor-feed-parser", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace
    .AnchorFeedParser as Program<AnchorFeedParser>;

  it("Read SOL/USD Feed", async () => {
    const tx = await program.rpc.readResult(
      {},
      {
        accounts: {
          aggregator: SOL_USD_FEED,
        },
      }
    );

    // wait for tx to be processed
    await sleep(1000);

    const logs = await program.provider.connection.getParsedTransaction(
      tx,
      "confirmed"
    );
    console.log(JSON.stringify(logs?.meta?.logMessages, undefined, 2));
  });
});
