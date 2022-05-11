import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { SwitchboardDecimal } from "@switchboard-xyz/switchboard-v2";
import {
  copyAccount,
  fromPublicKey,
  fromSwitchboardAccount,
  IJobClass,
  ILeaseClass,
  IPermissionClass,
  JobDefinition,
  jsonPath,
  PermissionDefinition,
} from "..";

export interface AggregatorHistoryRow {
  timestamp: anchor.BN;
  value: SwitchboardDecimal;
}

export interface AggregatorRound {
  numSuccess: number;
  numError: number;
  isClosed: boolean;
  roundOpenSlot: anchor.BN;
  roundOpenTimestamp: anchor.BN;
  result: SwitchboardDecimal;
  stdDeviation: SwitchboardDecimal;
  minResponse: SwitchboardDecimal;
  maxResponse: SwitchboardDecimal;
  oraclePubkeysData: PublicKey[];
  mediansData: SwitchboardDecimal[];
  currentPayout: anchor.BN[];
  mediansFulfilled: boolean[];
  errorsFulfilled: boolean[];
}

export interface AggregatorAccountData {
  name: Buffer;
  metadata: Buffer;
  authorWallet: PublicKey;
  queuePubkey: PublicKey;
  crankPubkey: PublicKey;
  oracleRequestBatchSize: number;
  minOracleResults: number;
  minJobResults: number;
  minUpdateDelaySeconds: number;
  startAfter: anchor.BN;
  varianceThreshold: SwitchboardDecimal;
  forceReportPeriod: anchor.BN;
  expiration: anchor.BN;
  consecutiveFailureCount: anchor.BN;
  nextAllowedUpdateTime: anchor.BN;
  isLocked: boolean;
  schedule: Buffer;
  latestConfirmedRound: AggregatorRound;
  currentRound: AggregatorRound;
  jobPubkeysData: PublicKey[]; // is there a way to define sizeof 16?
  jobHashes: Buffer; // Hash[16]
  jobPubkeysSize: number;
  jobsChecksum: Buffer;
  authority: PublicKey;
  historyBuffer: PublicKey;
}

/** JSON interface to construct a new Aggregator Account */
export interface fromAggregatorJSON {
  authorWalletPublicKey?: PublicKey;
  authorityPublicKey?: PublicKey;
  oracleRequestBatchSize?: number; // REQ, will default to some value
  crank?: string | number | boolean | undefined;
  expiration?: string | number; // BN
  forceReportPeriod?: string | number; // BN
  existingKeypair?: Keypair; // TODO: fs path to keypair
  metadata?: string;
  minRequiredJobResults?: number; // REQ, will default to 75% of jobs
  minRequiredOracleResults?: number; // REQ, will default to 1
  minUpdateDelaySeconds?: number; // REQ, will default to 30s
  name?: string;
  queuePublicKey: PublicKey;
  startAfter?: number;
  varianceThreshold?: number;
  historyBuffer?: number;
  // accounts
  jobs: JobDefinition[];
  leaseAccount?: ILeaseClass;
  permissionAccount?: PermissionDefinition;
}

/** Object representing a loaded onchain Aggregator Account */
export interface IAggregatorClass {
  publicKey: PublicKey;
  authorWalletPublicKey: PublicKey;
  historyBufferPublicKey?: PublicKey;
  authorityPublicKey: PublicKey;
  oracleRequestBatchSize: number; // REQ, will default to some value
  crankPublicKey?: PublicKey | string | number | boolean;
  expiration: anchor.BN;
  forceReportPeriod: anchor.BN;
  isLocked?: boolean;
  metadata: string;
  minRequiredJobResults: number; // REQ, will default to 75% of jobs
  minRequiredOracleResults: number; // REQ, will default to 1
  minUpdateDelaySeconds: number; // REQ, will default to 30s
  name: string;
  queuePublicKey: PublicKey;
  startAfter: number;
  varianceThreshold: SwitchboardDecimal;

  jobs: IJobClass[];
  leaseAccount?: ILeaseClass;
  permissionAccount?: IPermissionClass;
}

/** Type representing the different ways to build an Aggregator Account */
export type AggregatorDefinition =
  | fromSwitchboardAccount
  | fromPublicKey
  | fromAggregatorJSON
  | copyAccount
  | jsonPath;
