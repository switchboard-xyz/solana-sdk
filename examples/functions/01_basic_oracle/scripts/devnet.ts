#!/usr/bin/env tsx
import type { BasicOracle } from "../target/types/basic_oracle";

import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import * as sb from "@switchboard-xyz/solana.js";

const functionPubkey = "Accb21tUCWocJea6Uk3DgrNZawgmKegDVeHw8cGMDPi5";

const rpcUrl =
  "https://api.devnet.solana.com";

async function main() {
  const provider = new anchor.AnchorProvider(
    new Connection(rpcUrl),
    new anchor.Wallet(
      sb.loadKeypair(
        "~/switchboard_environments_v2/devnet/upgrade_authority/upgrade_authority.json"
      )
    ),
    {}
  );
  anchor.setProvider(provider);
  const program = anchor.workspace.BasicOracle as anchor.Program<BasicOracle>;

  console.log(`ProgramID: ${program.programId}`);

  const payer = (program.provider as anchor.AnchorProvider).publicKey;

  const programStatePubkey = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("BASICORACLE")],
    program.programId
  )[0];

  const oraclePubkey = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("ORACLE_V1_SEED")],
    program.programId
  )[0];

  console.log(`programState: ${programStatePubkey}`);
  console.log(`oracle: ${oraclePubkey}`);

  // const tx = await program.methods
  //   .initialize({})
  //   .accounts({
  //     program: programStatePubkey,
  //     oracle: oraclePubkey,
  //     authority: payer,
  //     payer: payer,
  //   })
  //   .rpc();
  // console.log("Your transaction signature", tx);

  const setFnTx = await program.methods
    .setFunction({})
    .accounts({
      program: programStatePubkey,
      function: new PublicKey(functionPubkey),
      authority: payer,
    })
    .rpc();
  console.log("Your transaction signature", setFnTx);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

const getStringArg = (arg: string): string => {
  const args = process.argv.slice(2);
  const argIdx = args.findIndex((v) => v === arg || v === `--${arg}`);
  if (argIdx === -1) {
    return "";
  }
  if (argIdx + 1 > args.length) {
    throw new Error(`Failed to find arg`);
  }
  return args[argIdx + 1];
};

const getFlag = (arg: string): boolean => {
  const args = process.argv.slice(2);
  const argIdx = args.findIndex((v) => v === arg || v === `--${arg}`);
  if (argIdx === -1) {
    return false;
  }
  return true;
};
