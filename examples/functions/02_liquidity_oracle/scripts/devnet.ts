#!/usr/bin/env tsx
import * as anchor from "@coral-xyz/anchor";
import { BasicOracle } from "../target/types/basic_oracle";

async function main() {
  const program = anchor.workspace.BasicOracle as anchor.Program<BasicOracle>;
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
