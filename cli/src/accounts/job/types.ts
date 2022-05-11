import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { OracleJob } from "@switchboard-xyz/switchboard-v2";
import {
  copyAccount,
  fromPublicKey,
  fromSwitchboardAccount,
  jsonPath,
} from "../types/types";

export interface JobAccountData {
  name: Buffer; // Uint8Array
  metadata: Buffer;
  authority: PublicKey;
  expiration: anchor.BN;
  hash: Buffer;
  data: Buffer; // ??
  referenceCount: number;
}

export const TEMPLATE_SOURCES = [
  "ascendex",
  "binanceCom",
  "binanceUs",
  "bitfinex",
  "bitstamp",
  "bittrex",
  "bonfida",
  "coinbase",
  "ftxCom",
  "ftxUs",
  "gate",
  "huobi",
  "kraken",
  "kucoin",
  "mexc",
  "okex",
  "orca",
  "raydium",
  "smb",
] as const;

/** Type representing the different predefined job templates */
export type TemplateSource = typeof TEMPLATE_SOURCES[number];

/** Create a job account from a predefined template */
export interface fromJobTemplate {
  template: TemplateSource;
  id?: string;
  existingKeypair?: Keypair;
  name?: string;
}

/** JSON interface to construct a new Job Account */
export interface fromJobJSON {
  aggregator?: string | PublicKey; // add by agg name (BTC_USD)
  authorityWalletPublicKey?: PublicKey; // Defaults to authority who created
  existingKeypair?: Keypair;
  expiration?: number;
  metadata?: string;
  name?: string;
  tasks: OracleJob.ITask[];
}

/** Type representing the different ways to build a Job Account */
export type JobDefinition =
  | fromSwitchboardAccount
  | fromPublicKey
  | fromJobJSON
  | fromJobTemplate
  | copyAccount
  | jsonPath;

/** Object representing a loaded onchain Job Account */
export interface IJobClass {
  publicKey: PublicKey;
  authorityWalletPublicKey: PublicKey;
  expiration: anchor.BN;
  metadata: string;
  name: string;
  tasks: OracleJob.ITask[];
}
