import { PublicKey } from "@solana/web3.js";
import { CrankRow } from "@switchboard-xyz/switchboard-v2/src";
import { fromPublicKey, fromSwitchboardAccount } from "..";

export interface CrankAccountData {
  name: Buffer;
  metadata: Buffer;
  queuePubkey: PublicKey;
  pqSize: number;
  maxRows: number;
  jitterModifier: number; // u8
  pqData: CrankRow[];
  dataBuffer: PublicKey;
}

/** JSON interface to construct a new Crank Account */
export interface fromCrankJSON {
  name?: string;
  metadata?: string;
  maxRows?: number;
  queuePublicKey?: PublicKey;
}

/** Object representing a loaded onchain Crank Account */
export interface ICrankClass {
  publicKey: PublicKey;
  maxRows: number;
  metadata: string;
  name: string;
  queuePublicKey?: PublicKey;
}

/** Type representing the different ways to build a Crank Account */
export type CrankDefinition =
  | fromSwitchboardAccount
  | fromPublicKey
  | fromCrankJSON;

/** Type representing the different ways to build a set of Crank Accounts */
export type CrankDefinitions = CrankDefinition[] | number;
