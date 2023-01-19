import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { OracleJob, sleep } from "@switchboard-xyz/common";
import {
  AggregatorAccount,
  SwitchboardTestContextV2,
} from "@switchboard-xyz/solana.js";
import assert from "assert";
import chai from "chai";
import { AnchorFeedParser } from "../target/types/anchor_feed_parser";
const expect = chai.expect;

// Anchor.toml will copy this to localnet when we start our tests
const DEFAULT_SOL_USD_FEED = new PublicKey(
  "GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR"
);

describe("anchor-feed-parser test", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const feedParserProgram = anchor.workspace
    .AnchorFeedParser as anchor.Program<AnchorFeedParser>;

  // const feedParserProgram = new anchor.Program(
  //   IDL,
  //   PROGRAM_ID,
  //   provider,
  //   new anchor.BorshCoder(IDL)
  // ) as anchor.Program<AnchorFeedParser>;

  let switchboard: SwitchboardTestContextV2;

  before(async () => {
    switchboard = await SwitchboardTestContextV2.loadFromProvider(provider, {
      // You can provide a keypair to so the PDA schemes dont change between test runs
      name: "Test Queue",
      // keypair: Keypair.generate(),
      queueSize: 10,
      reward: 0,
      minStake: 0,
      oracleTimeout: 900,
      unpermissionedFeeds: true,
      unpermissionedVrf: true,
      enableBufferRelayers: true,
      oracle: {
        name: "Test Oracle",
        enable: true,
        // stakingWalletKeypair: Keypair.generate(),
      },
    });
    await switchboard.start("dev-v2-RC_01_17_23_16_22", undefined);
  });

  after(async () => {
    if (switchboard) {
      switchboard.stop();
    }
  });

  it("Read SOL/USD Feed", async () => {
    const signature = await feedParserProgram.methods
      .readResult({ maxConfidenceInterval: null })
      .accounts({ aggregator: DEFAULT_SOL_USD_FEED })
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
    await assert.rejects(
      async () => {
        await feedParserProgram.methods
          .readResult({ maxConfidenceInterval: 0.0000000001 })
          .accounts({ aggregator: DEFAULT_SOL_USD_FEED })
          .rpc();
      },
      new RegExp(/ConfidenceIntervalExceeded/g),
      "Confidence interval was not exceeded"
    );
  });

  it("Creates a static feed that resolves to 100", async () => {
    const [myAggregatorAccount] = await switchboard.queue.createFeed({
      batchSize: 1,
      minRequiredOracleResults: 1,
      minRequiredJobResults: 1,
      minUpdateDelaySeconds: 10,
      fundAmount: 0.15,
      enable: true,
      slidingWindow: true,
      jobs: [
        {
          weight: 2,
          data: OracleJob.encodeDelimited(
            OracleJob.fromObject({
              tasks: [
                {
                  valueTask: {
                    value: 100,
                  },
                },
              ],
            })
          ).finish(),
        },
      ],
    });

    const aggregator = await myAggregatorAccount.loadData();
    const [updatedState] = await myAggregatorAccount.openRoundAndAwaitResult();
    const result = AggregatorAccount.decodeLatestValue(updatedState);
    assert(result.toNumber() === 100, "Aggregator result mismatch");
  });
});
