import * as anchor from "@project-serum/anchor";
import { Connection } from "@solana/web3.js";
import { sleep } from "@switchboard-xyz/common";
import {
  AggregatorAccount,
  SwitchboardTestContext,
} from "@switchboard-xyz/solana.js";
import chai from "chai";
import { PROGRAM_ID } from "../client/programId";
import { AnchorFeedParser, IDL } from "../target/types/anchor_feed_parser";
const expect = chai.expect;

describe("anchor-feed-parser localnet test", () => {
  const tomlProvider = anchor.AnchorProvider.env();
  const provider = new anchor.AnchorProvider(
    new Connection("http://localhost:8899"),
    tomlProvider.wallet,
    {}
  );
  anchor.setProvider(provider);

  // const feedParserProgram = anchor.workspace
  //   .AnchorFeedParser as Program<AnchorFeedParser>;

  const feedParserProgram = new anchor.Program(
    IDL,
    PROGRAM_ID,
    provider
  ) as anchor.Program<AnchorFeedParser>;

  let switchboard: SwitchboardTestContext;
  let aggregatorAccount: AggregatorAccount;

  before(async () => {
    switchboard = await SwitchboardTestContext.loadFromEnv(provider);
  });

  it("Creates a static feed that resolves to 100", async () => {
    [aggregatorAccount] = await switchboard.createStaticFeed(100);

    console.log(`Created Feed: ${aggregatorAccount.publicKey}`);
  });

  it("Reads the static feed", async () => {
    if (!aggregatorAccount) {
      throw new Error(`No aggregatorAccount to read`);
    }

    const signature = await feedParserProgram.methods
      .readResult({ maxConfidenceInterval: 0.25 })
      .accounts({ aggregator: aggregatorAccount.publicKey })
      .rpc();

    // wait for RPC
    await sleep(2000);

    const logs = await provider.connection.getParsedTransaction(
      signature,
      "confirmed"
    );

    // TODO: grep logs and verify the price

    console.log(JSON.stringify(logs?.meta?.logMessages, undefined, 2));
  });

  it("Fails to read feed if confidence interval is exceeded", async () => {
    if (!aggregatorAccount) {
      throw new Error(`No aggregatorAccount to read`);
    }

    try {
      await feedParserProgram.methods
        .readResult({ maxConfidenceInterval: 0.0000000001 })
        .accounts({ aggregator: aggregatorAccount.publicKey })
        .rpc();
    } catch (error: any) {
      if (!error.toString().includes("ConfidenceIntervalExceeded")) {
        throw error;
      }
    }
  });

  it("Updates static feed to resolve to 110", async () => {
    if (!aggregatorAccount) {
      throw new Error(`No aggregatorAccount to read`);
    }

    await switchboard.updateStaticFeed(aggregatorAccount, 110, 45);

    const signature = await feedParserProgram.methods
      .readResult({ maxConfidenceInterval: 0.25 })
      .accounts({ aggregator: aggregatorAccount.publicKey })
      .rpc();

    // wait for RPC
    await sleep(2000);

    const logs = await provider.connection.getParsedTransaction(
      signature,
      "confirmed"
    );

    // TODO: grep logs and verify the price

    console.log(JSON.stringify(logs?.meta?.logMessages, undefined, 2));
  });
});
