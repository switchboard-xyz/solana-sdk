import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { SwitchboardDecimal } from "@switchboard-xyz/switchboard-v2/src";
import {
  AggregatorDefinition,
  CrankDefinitions,
  fromPublicKey,
  fromSwitchboardAccount,
  IAggregatorClass,
  ICrankClass,
  IOracleClass,
  OracleDefinitions,
} from "..";

export interface OracleQueueAccountData {
  name: Buffer;
  metadata: Buffer;
  authority: PublicKey;
  oracleTimeout: anchor.BN;
  reward: anchor.BN;
  minStake: anchor.BN;
  slashingEnabled: boolean;
  varianceToleranceMultiplier: SwitchboardDecimal;
  feedProbationPeriod: number;
  currIdx: number;
  size: number;
  gcIdx: number;
  consecutiveFeedFailureLimit: anchor.BN;
  consecutiveOracleFailureLimit: anchor.BN;
  unpermissionedFeedsEnabled: boolean;
  unpermissionedVrfEnabled: boolean;
  maxSize: number;
  dataBuffer: PublicKey;
}

/** JSON interface to construct a new Oracle Queue Account */
export interface fromQueueJSON {
  authorityPublicKey?: PublicKey;
  consecutiveFeedFailureLimit?: string | number; // BN
  consecutiveOracleFailureLimit?: string | number; // BN
  feedProbationPeriod?: number;
  metadata?: string; // Buffer
  minStake?: string | number; // BN
  minUpdateDelaySeconds?: number;
  // queues should be named for easy lookup
  name: string; // Buffer
  oracleTimeout?: string | number; // BN
  queueSize?: number;
  reward?: string | number; // BN
  slashingEnabled?: boolean;
  unpermissionedFeedsEnabled?: boolean;
  unpermissionedVrfEnabled?: boolean;
  varianceToleranceMultiplier?: number;
  // accounts
  cranks?: CrankDefinitions; // can have crank-less queues
  oracles?: OracleDefinitions;
  aggregators?: AggregatorDefinition[];
}

/** Object representing a loaded onchain Oracle Queue Account */
export interface IOracleQueueClass {
  publicKey: PublicKey;
  authorityPublicKey: PublicKey;
  consecutiveFeedFailureLimit: anchor.BN;
  consecutiveOracleFailureLimit: anchor.BN;
  feedProbationPeriod: number;
  metadata: string; // Buffer
  minStake: anchor.BN;
  minUpdateDelaySeconds: number;
  // queues should be named for easy lookup
  name: string; // Buffer
  oracleTimeout: anchor.BN;
  queueSize: number;
  reward: anchor.BN;
  slashingEnabled: boolean;
  unpermissionedFeedsEnabled?: boolean;
  unpermissionedVrfEnabled?: boolean;
  varianceToleranceMultiplier: SwitchboardDecimal;
  // accounts
  cranks?: ICrankClass[];
  oracles?: IOracleClass[];
  aggregators?: IAggregatorClass[];
}

export type QueueDefinition =
  | fromSwitchboardAccount
  | fromPublicKey
  | fromQueueJSON
  | IOracleQueueClass;
