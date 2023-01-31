import * as anchor from "@coral-xyz/anchor";
import { OracleJob, sleep } from "@switchboard-xyz/common";
import {
  AggregatorAccount,
  SwitchboardTestContextV2,
} from "@switchboard-xyz/solana.js";
import assert from "assert";
import chai from "chai";
import { AnchorFeedParser } from "../target/types/anchor_feed_parser";
const expect = chai.expect;

describe("anchor-feed-parser test", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const feedParserProgram: anchor.Program<AnchorFeedParser> =
    anchor.workspace.AnchorFeedParser;

  let switchboard: SwitchboardTestContextV2;
  let aggregatorAccount: AggregatorAccount;

  before(async () => {
    switchboard = await SwitchboardTestContextV2.loadFromProvider(provider, {
      // You can provide a keypair to so the PDA schemes dont change between test runs
      name: "Test Queue",
      keypair: SwitchboardTestContextV2.loadKeypair("~/.keypairs/queue.json"),
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
        stakingWalletKeypair: SwitchboardTestContextV2.loadKeypair(
          "~/.keypairs/oracleWallet.json"
        ),
      },
    });
    await switchboard.start("dev-v2-RC_01_19_23_06_39", undefined, 60);
  });

  after(async () => {
    if (switchboard) {
      switchboard.stop();
    }
  });

  it("Creates a static feed that resolves to 100", async () => {
    [aggregatorAccount] = await switchboard.queue.createFeed({
      batchSize: 1,
      minRequiredOracleResults: 1,
      minRequiredJobResults: 1,
      minUpdateDelaySeconds: 10,
      fundAmount: 0.15,
      enable: true,
      slidingWindow: true,
      jobs: [
        {
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

    const aggregator = await aggregatorAccount.loadData();
    const [updatedState] = await aggregatorAccount.openRoundAndAwaitResult();
    const result = AggregatorAccount.decodeLatestValue(updatedState);
    assert(result.toNumber() === 100, "Aggregator result mismatch");

    const signature = await feedParserProgram.methods
      .readResult({ maxConfidenceInterval: null })
      .accounts({ aggregator: aggregatorAccount.publicKey })
      .rpc();

    // wait for RPC
    await sleep(2000);

    const logs = await provider.connection.getParsedTransaction(
      signature,
      "confirmed"
    );

    console.log(JSON.stringify(logs?.meta?.logMessages, undefined, 2));
    const match = JSON.stringify(logs?.meta?.logMessages ?? []).match(
      new RegExp(/Current feed result is (?<feed_result>\d+)/)
    );
    const feedResult = Number(match?.groups?.feed_result ?? null);
    console.log(`Feed Result: ${feedResult}`);
    assert(feedResult === 100, "FeedResultMismatch");
  });
});
