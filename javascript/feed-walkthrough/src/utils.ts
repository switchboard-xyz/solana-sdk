import { Keypair, PublicKey } from "@solana/web3.js";
import chalk from "chalk";
import fs from "fs";

export const toAccountString = (
  label: string,
  publicKey: PublicKey | string | undefined
): string => {
  if (typeof publicKey === "string") {
    return `${chalk.blue(label.padEnd(24, " "))} ${chalk.yellow(publicKey)}`;
  }
  if (!publicKey) {
    return "";
  }
  return `${chalk.blue(label.padEnd(24, " "))} ${chalk.yellow(
    publicKey.toString()
  )}`;
};

export const getKeypair = (keypairPath: string): Keypair => {
  if (!fs.existsSync(keypairPath)) {
    throw new Error(
      `failed to load authority keypair from ${keypairPath}, try providing a path to your keypair with the script 'ts-node src/main KEYPAIR_PATH'`
    );
  }
  const keypairString = fs.readFileSync(keypairPath, "utf8");
  const keypairBuffer = new Uint8Array(JSON.parse(keypairString));
  const walletKeypair = Keypair.fromSecretKey(keypairBuffer);
  return walletKeypair;
};
