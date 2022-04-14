import * as anchor from "@project-serum/anchor";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import {
  Cluster,
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
} from "@solana/web3.js";
import fs from "fs";
import path from "path";
import toml from "toml";
import { NoPayerKeypairProvided } from "./errors";

const DEFAULT_KEYPAIR = Keypair.fromSeed(new Uint8Array(32).fill(1));

/** Return the default anchor.Provider that will fail if a transaction is sent. This is used to avoid accidentally loading a
 * valid keypair from the anchor environment defaults.
 * @param connection a Solana connection object for a given Solana cluster and endpoint
 * @return the anchor.Provider object
 * */
export const getDefaultProvider = (connection: Connection): anchor.Provider => {
  return new anchor.Provider(
    connection,
    new anchor.Wallet(DEFAULT_KEYPAIR),
    anchor.Provider.defaultOptions()
  );
};

/** Get the program data address for a given programId
 * @param programId the programId for a given on-chain program
 * @return the publicKey of the address holding the upgradeable program buffer
 */
export const getProgramDataAddress = (programId: PublicKey): PublicKey => {
  return findProgramAddressSync(
    [programId.toBytes()],
    new PublicKey("BPFLoaderUpgradeab1e11111111111111111111111")
  )[0];
};

/** Get the IDL address for a given programId
 * @param programId the programId for a given on-chain program
 * @return the publicKey of the IDL address
 */
export const getIdlAddress = async (
  programId: PublicKey
): Promise<PublicKey> => {
  const base = (await PublicKey.findProgramAddress([], programId))[0];
  return PublicKey.createWithSeed(base, "anchor:idl", programId);
};

export const programHasPayer = (program: anchor.Program): boolean => {
  const payer = (program.provider.wallet as anchor.Wallet).payer;
  return !payer.publicKey.equals(DEFAULT_KEYPAIR.publicKey);
};

export const getProgramPayer = (program: anchor.Program): Keypair => {
  if (programHasPayer(program)) {
    return (program.provider.wallet as anchor.Wallet).payer;
  }
  throw new NoPayerKeypairProvided();
};

export const verifyProgramHasPayer = (program: anchor.Program): void => {
  if (programHasPayer(program)) {
    return;
  }
  throw new NoPayerKeypairProvided();
};

export function getAnchorWalletPath(parsedToml?: any): string {
  let tomlData: any;
  if (parsedToml) {
    tomlData = parsedToml;
  } else {
    const tomlPath = path.join(process.cwd(), "Anchor.toml");
    if (!fs.existsSync(tomlPath)) {
      throw new Error(`failed to find Anchor.toml`);
    }
    tomlData = toml.parse(fs.readFileSync(tomlPath, "utf8"));
  }

  const walletPath = tomlData.provider.wallet;
  if (!walletPath) {
    throw new Error(`Failed to read wallet path`);
  }
  return walletPath;
}

export function loadPid(programKeypairPath: string): PublicKey {
  if (!fs.existsSync(programKeypairPath)) {
    console.log(programKeypairPath);
    throw new Error(`Could not find keypair. Have you run 'anchor build'?`);
  }
  const programKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(programKeypairPath, "utf8")))
  );
  return programKeypair.publicKey;
}

export function getWorkspace(
  programName: string,
  programPath: string
): anchor.Program {
  const tomlPath = path.join(programPath, "Anchor.toml");
  if (!fs.existsSync(tomlPath)) {
    throw new Error(`failed to find Anchor.toml`);
  }
  const tomlData = toml.parse(fs.readFileSync(tomlPath, "utf8"));

  const cluster: Cluster | "localnet" = tomlData.provider.cluster;
  const wallet = Keypair.fromSecretKey(
    Buffer.from(
      JSON.parse(
        fs.readFileSync(tomlData.provider.wallet, {
          encoding: "utf-8",
        })
      )
    )
  );
  const programKeypairPath = path.join(
    programPath,
    `target/deploy/${programName.replace("-", "_")}-keypair.json`
  );

  let programId: PublicKey;
  switch (cluster) {
    case "localnet":
      programId = new PublicKey(tomlData.programs.localnet[programName]);
      break;
    case "devnet":
      programId = new PublicKey(tomlData.programs.devnet[programName]);
      break;
    case "mainnet-beta":
      programId = new PublicKey(tomlData.programs.mainnet[programName]);
      break;
    default:
      programId = loadPid(programKeypairPath);
  }

  const programIdlPath = path.join(
    programPath,
    `target/idl/${programName.replace("-", "_")}.json`
  );

  const idl: anchor.Idl = JSON.parse(fs.readFileSync(programIdlPath, "utf-8"));
  const url =
    cluster === "localnet" ? "http://localhost:8899" : clusterApiUrl(cluster);
  const provider = new anchor.Provider(
    new Connection(url, { commitment: "confirmed" }),
    new anchor.Wallet(wallet),
    { commitment: "confirmed" }
  );
  return new anchor.Program(idl, programId, provider);
}
