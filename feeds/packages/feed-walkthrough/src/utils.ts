import type { PublicKey } from "@solana/web3.js";
import { Keypair } from "@solana/web3.js";
import chalk from "chalk";
import fs from "fs";

export const toAccountString = (
  label: string,
  publicKey: PublicKey | string | undefined
): string => {
  if (typeof publicKey === "string") {
    return `${chalk.blue(label.padEnd(24, " "))} ${chalk.yellow(publicKey)}`;
  }
  if (!publicKey) return "";
  return `${chalk.blue(label.padEnd(24, " "))} ${chalk.yellow(
    publicKey.toString()
  )}`;
};

export const sleep = (ms: number): Promise<any> =>
  new Promise((s) => setTimeout(s, ms));

export const getKeypair = (path: string): Keypair => {
  if (!fs.existsSync(path)) {
    throw new Error(`failed to load authority keypair from ${path}`);
  }
  const keypairString = fs.readFileSync(path, "utf8");
  const keypairBuffer = new Uint8Array(JSON.parse(keypairString));
  const walletKeypair = Keypair.fromSecretKey(keypairBuffer);
  return walletKeypair;
};
