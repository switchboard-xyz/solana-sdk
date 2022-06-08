import * as anchor from "@project-serum/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  programWallet,
  SBV2_DEVNET_PID,
  SBV2_MAINNET_PID,
} from "@switchboard-xyz/switchboard-v2";
import { NoPayerKeypairProvided } from "../types";

export const loadAnchor = async (
  cluster: string,
  connection: Connection,
  authority?: Keypair
): Promise<anchor.Program> => {
  let PID: PublicKey;
  switch (cluster) {
    case "devnet": {
      PID = SBV2_DEVNET_PID;
      break;
    }

    case "mainnet-beta": {
      PID = SBV2_MAINNET_PID;
      break;
    }

    case "testnet": {
      throw new Error(`${cluster} PID not implemented yet`);
    }
  }

  const programId = new anchor.web3.PublicKey(PID);
  const keypair: Keypair = authority
    ? authority
    : anchor.web3.Keypair.generate(); // no keypair provided, defaulting to dummy keypair

  const wallet = new anchor.Wallet(keypair);
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "finalized",
    // preflightCommitment: "finalized",
  });

  const anchorIdl = await anchor.Program.fetchIdl(programId, provider);
  if (!anchorIdl) throw new Error(`failed to read idl for ${programId}`);

  // fs.writeFileSync(
  //   `${programId}.json`,
  //   JSON.stringify(anchorIdl, undefined, 2)
  // );

  const program = new anchor.Program(anchorIdl, programId, provider);
  return program;
};

export const getNewProgram = (
  program: anchor.Program,
  keypair: Keypair
): anchor.Program => {
  const wallet = new anchor.Wallet(keypair);
  const provider = new anchor.AnchorProvider(
    program.provider.connection,
    wallet,
    {
      commitment: "finalized",
      // preflightCommitment: "finalized",
    }
  );
  const programId = program.programId;

  const anchorIdl = program.idl;
  if (!anchorIdl) throw new Error(`failed to read idl for ${programId}`);

  return new anchor.Program(anchorIdl, programId, provider);
};

export const programHasPayer = (program: anchor.Program): boolean => {
  const payer = programWallet(program);
  return !payer.publicKey.equals(
    Keypair.fromSeed(new Uint8Array(32).fill(1)).publicKey
  );
};

export const getProgramPayer = (program: anchor.Program): Keypair => {
  if (programHasPayer(program)) return programWallet(program);
  throw new NoPayerKeypairProvided();
};

export const verifyProgramHasPayer = (program: anchor.Program): void => {
  if (programHasPayer(program)) return;
  throw new NoPayerKeypairProvided();
};
