import type { Program } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import { PublicKey, Transaction } from "@solana/web3.js";
import { createReadResultInstruction } from "../src";
import type { AnchorFeedParser } from "../target/types/anchor_feed_parser";

const sleep = (ms: number): Promise<any> =>
  new Promise((s) => setTimeout(s, ms));

const SOL_USD_FEED = new PublicKey(
  "GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR"
);

describe("anchor-feed-parser", () => {
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .AnchorFeedParser as Program<AnchorFeedParser>;

  it("Read SOL/USD Feed", async () => {
    const instruction = createReadResultInstruction({
      aggregator: SOL_USD_FEED,
    });

    const transaction = new Transaction();
    transaction.add(instruction);

    const tx = await provider.send(transaction);

    // wait for tx to be processed
    await sleep(2000);

    const logs = await provider.connection.getParsedTransaction(
      tx,
      "confirmed"
    );
    console.log(JSON.stringify(logs?.meta?.logMessages, undefined, 2));
  });
});
