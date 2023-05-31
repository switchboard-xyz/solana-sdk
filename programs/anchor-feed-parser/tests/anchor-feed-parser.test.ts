import * as anchor from "@coral-xyz/anchor";
import { Big, OracleJob, sleep } from "@switchboard-xyz/common";
import {
  AggregatorAccount,
  SwitchboardTestContext,
  types,
} from "@switchboard-xyz/solana.js";
import assert from "assert";
import { AnchorFeedParser } from "../target/types/anchor_feed_parser";
import { NodeOracle } from "@switchboard-xyz/oracle";

describe("anchor-feed-parser test", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const feedParserProgram: anchor.Program<AnchorFeedParser> =
    anchor.workspace.AnchorFeedParser;

  let switchboard: SwitchboardTestContext;
  let oracle: NodeOracle;

  let aggregatorAccount: AggregatorAccount;

  before(async () => {
    switchboard = await SwitchboardTestContext.loadFromProvider(provider, {
      // You can provide a keypair to so the PDA schemes dont change between test runs
      name: "Test Queue",
      keypair: SwitchboardTestContext.loadKeypair("~/.keypairs/queue.json"),
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
        stakingWalletKeypair: SwitchboardTestContext.loadKeypair(
          "~/.keypairs/oracleWallet.json"
        ),
      },
    });

    oracle = await NodeOracle.fromReleaseChannel({
      chain: "solana",
      releaseChannel: "testnet",
      network: "localnet", // disables production capabilities like monitoring and alerts
      rpcUrl: switchboard.program.connection.rpcEndpoint,
      oracleKey: switchboard.oracle.publicKey.toBase58(),
      secretPath: switchboard.walletPath,
      silent: false, // set to true to suppress oracle logs in the console
      envVariables: {
        VERBOSE: "1",
        DEBUG: "1",
        DISABLE_NONCE_QUEUE: "1",
        DISABLE_METRICS: "1",
      },
    });

    await oracle.startAndAwait();
  });

  after(() => {
    oracle?.stop();
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

  it("Creates a static feed then updates the value", async () => {
    let staticFeedAccount: AggregatorAccount;
    let staticFeedState: types.AggregatorAccountData;
    let staticFeedValue: Big;
    [staticFeedAccount, staticFeedState] = await switchboard.createStaticFeed({
      value: 10,
      minUpdateDelaySeconds: 5,
    });

    staticFeedValue = AggregatorAccount.decodeLatestValue(staticFeedState);

    assert(staticFeedValue.toNumber() === 10, "StaticFeedValueMismatch");

    await sleep(5000 * 2);

    staticFeedState = await switchboard.updateStaticFeed(staticFeedAccount, 25);

    staticFeedValue = AggregatorAccount.decodeLatestValue(staticFeedState);

    assert(staticFeedValue.toNumber() === 25, "StaticFeedValueMismatch");
  });
});
