/** This test will only work on devnet because we need a populated history to read */
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { OracleJob } from "@switchboard-xyz/common";
import {
  AggregatorAccount,
  SwitchboardTestContext,
} from "@switchboard-xyz/solana.js";
import { AnchorHistoryParser } from "../target/types/anchor_history_parser";
import { NodeOracle } from "@switchboard-xyz/oracle";

export const AGGREGATOR_PUBKEY: anchor.web3.PublicKey =
  new anchor.web3.PublicKey("GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR");

export const HISTORY_BUFFER_PUBKEY: anchor.web3.PublicKey =
  new anchor.web3.PublicKey("9GPTMZmtNU61ULAZoGxDZmnZoWeF8zvBmKp4WZY6Ln6j");

export const sleep = (ms: number): Promise<any> =>
  new Promise((s) => setTimeout(s, ms));

describe("anchor-history-parser", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program: Program<AnchorHistoryParser> =
    anchor.workspace.AnchorHistoryParser;

  let aggregatorAccount: AggregatorAccount;
  let historyBuffer: anchor.web3.PublicKey;

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

  /** Example showing how to create a new data feed with a history buffer storing 200k samples.
   * Note: This will not update until added to a crank or manually calling openRound
   */
  it("Creates a feed with a history buffer", async () => {
    [aggregatorAccount] = await switchboard.queue.createFeed({
      name: "History Aggregator",
      batchSize: 1,
      minRequiredOracleResults: 1,
      minRequiredJobResults: 1,
      minUpdateDelaySeconds: 30,
      historyLimit: 200_000,
      jobs: [
        {
          name: "Job 1",
          data: Buffer.from(
            OracleJob.encodeDelimited(
              OracleJob.create({
                tasks: [
                  {
                    valueTask: {
                      value: 1,
                    },
                  },
                ],
              })
            ).finish()
          ),
        },
      ],
    });

    const aggregator = await aggregatorAccount.loadData();
    const history = await aggregatorAccount.history.loadData();
  });

  /** Example showing how to read a history buffer on-chain for an existing feed with an existing history buffer with pre-populated samples. (This will only work on devnet) */
  it("Reads an aggregator history buffer", async () => {
    // const ONE_HOUR_AGO: number = Math.floor(Date.now()) - 60 * 60;

    const aggregatorAccount = new AggregatorAccount(
      switchboard.program,
      AGGREGATOR_PUBKEY
    );
    const aggregator = await aggregatorAccount.loadData();

    // TODO: Verify the value in the program logs matches the history samples
    const history = await aggregatorAccount.loadHistory();

    const tx = await program.methods
      .readHistory({ timestamp: null })
      .accounts({
        aggregator: AGGREGATOR_PUBKEY,
        historyBuffer: aggregator.historyBuffer,
      })
      .rpc();
    console.log("Your transaction signature", tx);

    await sleep(5000);

    const confirmedTxn = await program.provider.connection.getParsedTransaction(
      tx,
      "confirmed"
    );

    console.log(JSON.stringify(confirmedTxn?.meta?.logMessages, undefined, 2));
  });
});
