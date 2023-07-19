import {
  type CustomRandomnessRequest,
  IDL,
  // eslint-disable-next-line
} from "./target/types/custom_randomness_request";

import * as anchor from "@coral-xyz/anchor";
import type { TransactionSignature } from "@solana/web3.js";
import { clusterApiUrl } from "@solana/web3.js";
import { sleep, toUtf8 } from "@switchboard-xyz/common";
import {
  FunctionAccount,
  FunctionRequestAccount,
  loadKeypair,
  NativeMint,
  SwitchboardProgram,
  TransactionObject,
} from "@switchboard-xyz/solana.js";
import dotenv from "dotenv";
import * as fs from "fs";
import path from "path";
dotenv.config();

// The amount of funds to transfer to the new keypair to run this command
const NEW_PAYER_TRANSFER_AMOUNT = anchor.web3.LAMPORTS_PER_SOL / 50;

// The commitment level to use for reading and writing to the chain
const COMMITMENT_LEVEL: anchor.web3.Commitment = "processed";

async function main() {
  const { program, provider, switchboard, newPayer } = await loadCli();

  // 1. Load our function that we will be creating requests for
  console.log(
    green(`1. Load our function that we will be creating requests for`)
  );
  const functionAccount = new FunctionAccount(
    switchboard,
    process.env.FUNCTION_KEY ?? "7nzAjbw6k8CJYq4ggKXkZ75V2A4jiuvN5uuA1mf3MDtV"
  );
  const functionState = await functionAccount.loadData();
  console.log(`## Function - ${functionAccount.publicKey}`);
  console.log(` => queue: ${functionState.attestationQueue}`);
  console.log(` => schedule: ${toUtf8(functionState.schedule)}`);
  console.log(` => requestsDisabled: ${functionState.requestsDisabled}`);
  console.log(
    ` => container: ${toUtf8(functionState.container)}:${toUtf8(
      functionState.version
    )}`
  );

  // 2. Derive the anchor programs PDAs to build the transactions
  console.log(
    green(`2. Derive the anchor programs PDAs to build the transactions`)
  );
  const housePubkey = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("CUSTOMRANDOMNESS")],
    program.programId
  )[0];
  const houseTokenWallet = anchor.utils.token.associatedAddress({
    mint: NativeMint.address,
    owner: housePubkey,
  });
  console.log(`House Pubkey: ${housePubkey}`);
  console.log(`House Escrow: ${houseTokenWallet}`);

  // 3. Create a new user for our program
  console.log(green(`3. Create a new user for our program`));
  const userPubkey = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("CUSTOMRANDOMNESS"), newPayer.publicKey.toBytes()],
    program.programId
  )[0];
  const userTokenWallet = anchor.utils.token.associatedAddress({
    mint: NativeMint.address,
    owner: userPubkey,
  });
  console.log(`User Pubkey: ${userPubkey}`);
  console.log(`User Escrow: ${userTokenWallet}`);
  const userInitTxn = await program.methods
    .userInit()
    .accounts({
      house: housePubkey,
      houseTokenWallet: houseTokenWallet,
      user: userPubkey,
      userTokenWallet,
      mint: NativeMint.address,
    })
    .rpc();
  await awaitTxnConfirmation(provider.connection, userInitTxn, "user_init");

  // 4. Create a new request account and submit a guess for our user
  console.log(
    green(`4. Create a new request account and submit a guess for our user`)
  );
  const requestKeypair = anchor.web3.Keypair.generate();
  const requestAccount = new FunctionRequestAccount(
    switchboard,
    requestKeypair.publicKey
  );
  console.log(`Request Account: ${requestAccount.publicKey}`);
  const tx = await program.methods
    .userGuess(4, new anchor.BN(10000))
    .accounts({
      house: housePubkey,
      user: userPubkey,
      request: requestKeypair.publicKey,
      function: functionAccount.publicKey,
      requestEscrow: anchor.utils.token.associatedAddress({
        mint: NativeMint.address,
        owner: requestKeypair.publicKey,
      }),
      mint: NativeMint.address,
      state: switchboard.attestationProgramState.publicKey,
      attestationQueue: functionState.attestationQueue,
      switchboard: switchboard.attestationProgramId,
      userTokenWallet,
      houseTokenWallet,
    })
    .signers([requestKeypair])
    .rpc();
  awaitTxnConfirmation(provider.connection, tx, "user_guess").catch();

  // 5. Await off-chain verifiers to fulfill our request
  console.log(green(`5. Await off-chain verifiers to fulfill our request`));
  const requestRound = await requestAccount.poll();
  const requestState = await requestAccount.loadData();
  console.log(`\n## REQUEST - ${requestAccount.publicKey}`);
  console.log(` => status: ${requestState.status.kind}`);
  console.log(` => requestSlot: ${requestRound.requestSlot.toNumber()}`);
  console.log(` => fulfilledSlot: ${requestRound.fulfilledSlot.toNumber()}`);
  console.log(` => params: ${toUtf8(requestState.containerParams)}`);

  const userState = await program.account.userState.fetch(userPubkey);
  console.log(`\n## USER - ${userPubkey}`);
  console.log(` => status: ${Object.keys(userState.currentRound.status)[0]}`);
  console.log(` => guess: ${userState.currentRound.guess}`);
  console.log(` => result: ${userState.currentRound.result}`);
  console.log(` => wager: ${userState.currentRound.wager.toNumber()}`);
}

main()
  .then()
  .catch((err) => {
    console.error(err);
    throw err;
  });

function loadProgramId() {
  if (process.env.RANDOMNESS_CALLBACK_PID) {
    return new anchor.web3.PublicKey(process.env.RANDOMNESS_CALLBACK_PID);
  }
  if (fs.existsSync("target/deploy/custom_randomness_request-keypair.json")) {
    return loadKeypair("target/deploy/custom_randomness_request-keypair.json")
      .publicKey;
  }
  return new anchor.web3.PublicKey(
    "Csx5AU83fPiaSChJUBZg2cW9GcCVVwZ4rwFqDA2pomX2"
  );
}

interface ICli {
  program: anchor.Program<CustomRandomnessRequest>;
  switchboard: SwitchboardProgram;
  origPayer: anchor.web3.PublicKey;
  provider: anchor.AnchorProvider;
  newPayer: {
    publicKey: anchor.web3.PublicKey;
    signer: anchor.web3.Keypair;
  };
}

async function loadCli(): Promise<ICli> {
  const provider = new anchor.AnchorProvider(
    new anchor.web3.Connection(
      process.env.ANCHOR_PROVIDER_URL ?? clusterApiUrl("devnet"),
      { commitment: COMMITMENT_LEVEL }
    ),
    new anchor.Wallet(
      loadKeypair(process.env.ANCHOR_WALLET ?? "~/.config/solana/id.json")
    ),
    { commitment: COMMITMENT_LEVEL }
  );

  const program: anchor.Program<CustomRandomnessRequest> = new anchor.Program(
    IDL,
    loadProgramId(),
    provider
  );

  const switchboard = await SwitchboardProgram.fromProvider(provider);

  const newPayer = anchor.web3.Keypair.generate();
  const transferTx = await switchboard.signAndSend(
    new TransactionObject(
      provider.publicKey,
      [
        anchor.web3.SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          toPubkey: newPayer.publicKey,
          lamports: NEW_PAYER_TRANSFER_AMOUNT,
        }),
      ],
      []
    )
  );

  // 0. Setup new payer and transfer some SOL
  console.log(green(`0. Setup new payer and transfer some SOL`));

  console.log(`New Payer: ${newPayer.publicKey}`);

  awaitTxnConfirmation(
    provider.connection,
    transferTx,
    "transfer SOL to new payer"
  ).catch();

  // set provider to new payer
  const newSwitchboard = switchboard.newWithPayer(newPayer);
  const newProgram = new anchor.Program(
    program.idl,
    program.programId,
    newSwitchboard.provider
  );
  return {
    newPayer: {
      publicKey: newPayer.publicKey,
      signer: newPayer,
    },
    origPayer: provider.publicKey,
    provider: provider,
    program: newProgram,
    switchboard: newSwitchboard,
  };
}

async function awaitTxnConfirmation(
  connection: anchor.web3.Connection,
  signature: TransactionSignature,
  label?: string,
  maxAttempts = 10
) {
  console.log(
    `\n[TXN]${
      label ? ": " + label : ""
    }\n => https://explorer.solana.com/tx/${signature}?cluster=custom&customUrl=${
      connection.rpcEndpoint.includes("rpcpool")
        ? clusterApiUrl("devnet")
        : connection.rpcEndpoint
    }\n`
  );

  let attempts = maxAttempts;

  while (attempts > 0) {
    try {
      const txnStatus = await connection.getParsedTransaction(signature, {
        commitment:
          COMMITMENT_LEVEL === "finalized" ? "finalized" : "confirmed",
      });
      if (txnStatus) {
        return;
      }
    } catch {}

    await sleep(1000);
    attempts = attempts - 1;
  }

  throw new Error(`Failed to await txn confirmation`);
}

const green = (message: string) => `\x1b[32m${message}\x1b[0m`;
