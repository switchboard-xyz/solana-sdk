import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  fromPublicKey,
  fromSwitchboardAccount,
  IPermissionClass,
  PermissionDefinition,
} from "..";

export interface OracleMetricsData {
  consecutiveSuccess: anchor.BN;
  consecutiveError: anchor.BN;
  consecutiveDisagreement: anchor.BN;
  consecutiveLateResponse: anchor.BN;
  consecutiveFailure: anchor.BN;
  totalSuccess: anchor.BN;
  totalError: anchor.BN;
  totalDisagreement: anchor.BN;
  totalLateResponse: anchor.BN;
}

export interface OracleAccountData {
  name: Buffer;
  metadata: Buffer;
  oracleAuthority: PublicKey;
  lastHeartbeat: anchor.BN;
  numInUse: number;
  tokenAccount: PublicKey;
  queuePubkey: PublicKey;
  metrics: OracleMetricsData;
}

/** JSON interface to construct a new Oracle Account */
export interface fromOracleJSON {
  name?: string;
  metadata?: string;
  queuePublicKey?: PublicKey;
  tokenAccountPublicKey?: PublicKey;
  authorityKeypair?: Keypair;
  permissionAccount?: PermissionDefinition;
}

/** Object representing a loaded onchain Oracle Account */
export interface IOracleClass {
  publicKey: PublicKey;
  name: string;
  metadata: string;
  queuePublicKey?: PublicKey;
  tokenAccountPublicKey?: PublicKey;
  authorityPublicKey?: PublicKey;
  permissionAccount?: IPermissionClass;
}

/** Type representing the different ways to build an Oracle Account */
export type OracleDefinition =
  | fromSwitchboardAccount
  | fromPublicKey
  | fromOracleJSON;

/** Type representing the different ways to build a set of Oracle Accounts */
export type OracleDefinitions = OracleDefinition[] | number;
