import * as anchor from "@coral-xyz/anchor";
import {
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { OracleJob, sleep } from "@switchboard-xyz/common";
import { NodeOracle } from "@switchboard-xyz/oracle";
import {
  AggregatorAccount,
  SwitchboardTestContext,
} from "@switchboard-xyz/solana.js";
import assert from "assert";
import fs from "fs";
import path from "path";

function getProgramId(): PublicKey {
  const programKeypairPath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "target",
    "deploy",
    "native_feed_parser-keypair.json"
  );
  const PROGRAM_ID = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(programKeypairPath, "utf8")))
  ).publicKey;

  return PROGRAM_ID;
}

describe("native-feed-parser test", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  let aggregatorAccount: AggregatorAccount;
  let switchboard: SwitchboardTestContext;
  let oracle: NodeOracle;

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

  it("Read SOL/USD Feed", async () => {
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

    const PROGRAM_ID = getProgramId();

    const readSwitchboardAggregatorTxn = new Transaction().add(
      new TransactionInstruction({
        keys: [
          {
            pubkey: aggregatorAccount.publicKey,
            isSigner: false,
            isWritable: false,
          },
        ],
        programId: new PublicKey(PROGRAM_ID),
        data: Buffer.from([]),
      })
    );

    const signature = await provider.sendAndConfirm(
      readSwitchboardAggregatorTxn
    );

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
