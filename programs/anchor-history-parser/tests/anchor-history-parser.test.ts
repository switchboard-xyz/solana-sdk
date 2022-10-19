import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import {
  AggregatorAccount,
  loadSwitchboardProgram,
  programWallet,
} from "@switchboard-xyz/switchboard-v2";
import { AnchorHistoryParser } from "../target/types/anchor_history_parser";

export const AGGREGATOR_PUBKEY: anchor.web3.PublicKey =
  new anchor.web3.PublicKey("GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR");

export const HISTORY_BUFFER_PUBKEY: anchor.web3.PublicKey =
  new anchor.web3.PublicKey("7LLvRhMs73FqcLkA8jvEE1AM2mYZXTmqfUv8GAEurymx");

export const sleep = (ms: number): Promise<any> =>
  new Promise((s) => setTimeout(s, ms));

describe("anchor-history-parser", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .AnchorHistoryParser as Program<AnchorHistoryParser>;

  it("Reads an aggregator history buffer", async () => {
    // const ONE_HOUR_AGO: number = Math.floor(Date.now()) - 60 * 60;

    const switchboard = await loadSwitchboardProgram(
      "devnet",
      program.provider.connection
    );
    const aggregatorAccount = new AggregatorAccount({
      program: switchboard,
      publicKey: AGGREGATOR_PUBKEY,
    });
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
