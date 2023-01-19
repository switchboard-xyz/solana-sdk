/** This test will only work on devnet because we need a populated history to read */
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { OracleJob } from "@switchboard-xyz/common";
import {
  AggregatorAccount,
  SwitchboardTestContextV2,
} from "@switchboard-xyz/solana.js";
import { AnchorHistoryParser } from "../target/types/anchor_history_parser";

export const AGGREGATOR_PUBKEY: anchor.web3.PublicKey =
  new anchor.web3.PublicKey("GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR");

export const HISTORY_BUFFER_PUBKEY: anchor.web3.PublicKey =
  new anchor.web3.PublicKey("7LLvRhMs73FqcLkA8jvEE1AM2mYZXTmqfUv8GAEurymx");

export const sleep = (ms: number): Promise<any> =>
  new Promise((s) => setTimeout(s, ms));

describe("anchor-history-parser", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .AnchorHistoryParser as Program<AnchorHistoryParser>;

  let aggregatorAccount: AggregatorAccount;
  let historyBuffer: anchor.web3.PublicKey;

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
