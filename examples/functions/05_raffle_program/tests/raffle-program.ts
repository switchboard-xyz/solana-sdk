import type { RaffleProgram } from "../target/types/raffle_program";

import { printLogs } from "./utils";

import type { Program } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import {
  BN,
  BNtoDateTimeString,
  parseMrEnclave,
  parseRawMrEnclave,
  sleep,
  toUtf8,
} from "@switchboard-xyz/common";
import type {
  BootstrappedAttestationQueue,
  FunctionAccount,
  SwitchboardWallet,
} from "@switchboard-xyz/solana.js";
import {
  AttestationProgramStateAccount,
  attestationTypes,
  FunctionRequestAccount,
  TransactionObject,
} from "@switchboard-xyz/solana.js";
import {
  AttestationQueueAccount,
  NativeMint,
  SwitchboardProgram,
} from "@switchboard-xyz/solana.js";
import assert from "assert";

const MRENCLAVE = parseRawMrEnclave(
  "0x0162074de74faf6e896b6c0b60341e0edc5470adee26fce7297ccbed306537db",
  true
);
// const MRENCLAVE = new Uint8Array(new Array(32).fill(0));

describe("raffle-program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.RaffleProgram as Program<RaffleProgram>;

  const payer = (program.provider as anchor.AnchorProvider).publicKey;
  const [rafflePubkey, raffleBump] =
    anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("MY_RAFFLE"), payer.toBytes()],
      program.programId
    );

  console.log(`rafflePubkey (${raffleBump}): ${rafflePubkey}`);

  let switchboard: BootstrappedAttestationQueue;
  let functionAccount: FunctionAccount;
  let requestAccount: FunctionRequestAccount;
  let wallet: SwitchboardWallet;

  before(async () => {
    const switchboardProgram = await SwitchboardProgram.fromProvider(
      program.provider as anchor.AnchorProvider
    );

    let initState = false;
    try {
      const switchboardStatePubkey = await provider.connection.getAccountInfo(
        switchboardProgram.attestationProgramState.publicKey
      );
      if (!switchboardStatePubkey || !switchboardStatePubkey.data) {
        initState = true;
      }
    } catch {
      initState = true;
    }
    if (initState) {
      await AttestationProgramStateAccount.getOrCreate(
        switchboardProgram
      ).catch();
    }

    switchboard = await AttestationQueueAccount.bootstrapNewQueue(
      switchboardProgram
    );

    [functionAccount] =
      await switchboard.attestationQueue.account.createFunction({
        name: "test function",
        metadata: "this function handles XYZ for my protocol",
        schedule: "15 * * * * *",
        container: "switchboardlabs/basic-oracle-function",
        version: "latest",
        mrEnclave: MRENCLAVE,
        // authority: programStatePubkey,
      });
    wallet = await functionAccount.wallet;

    console.log(
      `state: ${switchboardProgram.attestationProgramState.publicKey}`
    );
    console.log(`attestationQueue: ${switchboard.attestationQueue.publicKey}`);
    console.log(`function: ${functionAccount.publicKey}`);
  });

  it("Initializes the raffle", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize({ slotsPerRound: 25 /* seconds */ })
      .accounts({
        raffle: rafflePubkey,
        function: functionAccount.publicKey,
        payer: payer,
      })
      .rpc();
    console.log("initialize transaction signature", tx);
    await printLogs(program.provider.connection, tx);
  });

  it("Starts a new round", async () => {
    const requestKeypair = anchor.web3.Keypair.generate();

    requestAccount = new FunctionRequestAccount(
      switchboard.program,
      requestKeypair.publicKey
    );

    // Add your test here.
    const tx = await program.methods
      .startRound()
      .accounts({
        raffle: rafflePubkey,
        function: functionAccount.publicKey,
        request: requestAccount.publicKey,
        requestEscrow: anchor.utils.token.associatedAddress({
          mint: NativeMint.address,
          owner: requestKeypair.publicKey,
        }),
        mint: NativeMint.address,
        state: switchboard.program.attestationProgramState.publicKey,
        attestationQueue: switchboard.attestationQueue.publicKey,
        switchboard: switchboard.program.attestationProgramId,
        payer: payer,
      })
      .signers([requestKeypair])
      .rpc();
    console.log("start_round transaction signature", tx);
    await printLogs(program.provider.connection, tx);

    const raffleState = await program.account.raffleAccount.fetch(rafflePubkey);
    assert(
      raffleState.currentRound.closeTimestamp.toNumber() > 0 &&
        raffleState.currentRound.id.toNumber() === 1,
      "Failed to start the round"
    );
    console.log(
      `closeTimestamp: ${raffleState.currentRound.closeTimestamp.toNumber()} = ${BNtoDateTimeString(
        raffleState.currentRound.closeTimestamp as any
      )}`
    );
  });

  it("Closes a round", async () => {
    let raffleState = await program.account.raffleAccount.fetch(rafflePubkey);
    const closeTimestamp = raffleState.currentRound.closeTimestamp.toNumber();
    assert(
      raffleState.currentRound.closeTimestamp.toNumber() > 0 &&
        raffleState.currentRound.id.toNumber() > 0,
      "Round is not active"
    );

    const now = Math.round(Date.now() / 1000);
    const timeUntilExpiration = closeTimestamp - now;

    console.log(`Need to wait ${timeUntilExpiration}`);

    await sleep(timeUntilExpiration * 1000);

    console.log(`ready to close`);

    const enclaveSigner = anchor.web3.Keypair.generate();

    const requestState = await requestAccount.loadData();

    const receiver = await switchboard.program.mint.getOrCreateAssociatedUser(
      payer
    );

    const requestVerifyIxn = attestationTypes.functionRequestVerify(
      switchboard.program,
      {
        params: {
          observedTime: new BN(Math.floor(Date.now() / 1000)),
          mrEnclave: Array.from(MRENCLAVE),
          isFailure: false,
          requestSlot: requestState.activeRequest.requestSlot,
          containerParamsHash: requestState.containerParamsHash,
        },
      },
      {
        request: requestAccount.publicKey,
        function: functionAccount.publicKey,
        functionEnclaveSigner: enclaveSigner.publicKey,
        verifierQuote: switchboard.verifier.publicKey,
        verifierEnclaveSigner: switchboard.verifier.signer.publicKey,
        attestationQueue: switchboard.attestationQueue.publicKey,
        verifierPermission: switchboard.verifier.permissionAccount.publicKey,
        state: switchboard.program.attestationProgramState.publicKey,
        escrow: requestAccount.getEscrow(),
        functionEscrow: wallet.tokenWallet,
        receiver,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      }
    );

    const tx = await program.methods
      .closeRound()
      .accounts({
        raffle: rafflePubkey,
        request: requestAccount.publicKey,
        function: functionAccount.publicKey,
        enclaveSigner: enclaveSigner.publicKey,
      })
      .preInstructions([requestVerifyIxn])
      .signers([switchboard.verifier.signer, enclaveSigner])
      .rpc();

    console.log("close_round transaction signature", tx);
    await printLogs(program.provider.connection, tx);

    raffleState = await program.account.raffleAccount.fetch(rafflePubkey);

    assert(raffleState.currentRound.isClosed, "Round is not closed");
  });
});
