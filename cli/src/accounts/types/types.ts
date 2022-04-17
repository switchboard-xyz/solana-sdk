/* eslint-disable no-use-before-define */
import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  AggregatorAccount,
  CrankAccount,
  JobAccount,
  LeaseAccount,
  OracleAccount,
  OracleQueueAccount,
  PermissionAccount,
  ProgramStateAccount,
} from "@switchboard-xyz/switchboard-v2";

export const DEFAULT_KEYPAIR = Keypair.fromSeed(new Uint8Array(32).fill(1));
export const DEFAULT_PUBKEY = new PublicKey("11111111111111111111111111111111");

/** An existing on-chain account to load */
export interface fromPublicKey {
  publicKey: PublicKey;
}

export const SWITCHBOARD_ACCOUNT_TYPES = [
  "JobAccountData",
  "AggregatorAccountData",
  "OracleAccountData",
  "OracleQueueAccountData",
  "PermissionAccountData",
  "LeaseAccountData",
  "ProgramStateAccountData",
  "VrfAccountData",
  "SbState",
  "BUFFERxx",
  "CrankAccountData",
] as const;

export type SwitchboardAccountType = typeof SWITCHBOARD_ACCOUNT_TYPES[number];

export const SWITCHBOARD_DISCRIMINATOR_MAP = new Map<
  SwitchboardAccountType,
  Buffer
>(
  SWITCHBOARD_ACCOUNT_TYPES.map((accountType) => [
    accountType,
    anchor.BorshAccountsCoder.accountDiscriminator(accountType),
  ])
);

// export type SwitchboardAccountType =
//   | "JobAccount"
//   | "AggregatorAccount"
//   | "OracleAccount"
//   | "OracleQueueAccount"
//   | "PermissionAccount"
//   | "LeaseAccount"
//   | "ProgramStateAccount"
//   | "CrankAccount";

export type SwitchboardAccount =
  | JobAccount
  | AggregatorAccount
  | OracleAccount
  | ProgramStateAccount
  | CrankAccount
  | PermissionAccount
  | LeaseAccount
  | OracleQueueAccount;

export interface fromSwitchboardAccount {
  account: SwitchboardAccount;
}

/** Copy an existing account type */
export interface copyAccount {
  sourcePublicKey: PublicKey;
  existingKeypair?: Keypair;
  authorityKeypair?: Keypair;
}

/** Load a JSON definition from a file path */
export interface jsonPath {
  jsonPath: string;
}
