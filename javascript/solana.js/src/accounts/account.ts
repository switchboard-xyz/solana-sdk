import {
  AggregatorAccountData,
  BufferRelayerAccountData,
  CrankAccountData,
  JobAccountData,
  LeaseAccountData,
  OracleAccountData,
  OracleQueueAccountData,
  PermissionAccountData,
  SbState,
  SlidingResultAccountData,
  VrfAccountData,
} from "../generated/index.js";
import { SwitchboardProgram } from "../SwitchboardProgram.js";

import { AggregatorAccount } from "./aggregatorAccount.js";
import { AggregatorHistoryBuffer } from "./aggregatorHistoryBuffer.js";
import { BufferRelayerAccount } from "./bufferRelayAccount.js";
import { CrankAccount } from "./crankAccount.js";
import { CrankDataBuffer } from "./crankDataBuffer.js";
import { JobAccount } from "./jobAccount.js";
import { LeaseAccount } from "./leaseAccount.js";
import { OracleAccount } from "./oracleAccount.js";
import { PermissionAccount } from "./permissionAccount.js";
import { ProgramStateAccount } from "./programStateAccount.js";
import { QueueAccount } from "./queueAccount.js";
import { QueueDataBuffer } from "./queueDataBuffer.js";
import { VrfAccount } from "./vrfAccount.js";

import * as anchor from "@coral-xyz/anchor";

export abstract class Account<T> {
  public readonly publicKey: anchor.web3.PublicKey;

  /**
   * Account constructor
   * @param program SwitchboardProgram
   * @param publicKey PublicKey of the on-chain resource
   */
  public constructor(
    public readonly program: SwitchboardProgram,
    publicKey: anchor.web3.PublicKey | string
  ) {
    this.publicKey =
      typeof publicKey === "string"
        ? new anchor.web3.PublicKey(publicKey)
        : publicKey;
  }

  /**
   * @return on-chain account size.
   */
  public abstract get size(): number;

  /**
   * Retrieve and decode the data in this account.
   */
  public abstract loadData(): Promise<T>;
}

/** Callback to pass deserialized account data when updated on-chain */
export type OnAccountChangeCallback<T> = (accountData: T) => void;

export const BUFFER_DISCRIMINATOR = Buffer.from([
  66,
  85,
  70,
  70,
  69,
  82,
  120,
  120, // BUFFERxx
]);

export type SwitchboardAccountType =
  | "Aggregator"
  | "AggregatorHistory"
  | "BufferRelayer"
  | "Crank"
  | "CrankBuffer"
  | "Job"
  | "Lease"
  | "Oracle"
  | "Permission"
  | "ProgramState"
  | "Queue"
  | "QueueBuffer"
  | "SlidingWindow"
  | "Vrf"
  | "Buffer";

export type SwitchboardAccount =
  | AggregatorAccount
  | AggregatorHistoryBuffer
  | BufferRelayerAccount
  | CrankAccount
  | CrankDataBuffer
  | JobAccount
  | LeaseAccount
  | OracleAccount
  | PermissionAccount
  | ProgramStateAccount
  | QueueAccount
  | QueueDataBuffer
  | VrfAccount;

export type SwitchboardAccountData =
  | AggregatorAccountData
  | BufferRelayerAccountData
  | CrankAccountData
  | JobAccountData
  | LeaseAccountData
  | OracleAccountData
  | PermissionAccountData
  | SbState
  | OracleQueueAccountData
  | SlidingResultAccountData
  | VrfAccountData;

export const DISCRIMINATOR_MAP: Map<string, SwitchboardAccountType> = new Map([
  [AggregatorAccountData.discriminator.toString("utf-8"), "Aggregator"],
  [BufferRelayerAccountData.discriminator.toString("utf-8"), "BufferRelayer"],
  [CrankAccountData.discriminator.toString("utf-8"), "Crank"],
  [JobAccountData.discriminator.toString("utf-8"), "Job"],
  [LeaseAccountData.discriminator.toString("utf-8"), "Lease"],
  [OracleAccountData.discriminator.toString("utf-8"), "Oracle"],
  [PermissionAccountData.discriminator.toString("utf-8"), "Permission"],
  [SbState.discriminator.toString("utf-8"), "ProgramState"],
  [OracleQueueAccountData.discriminator.toString("utf-8"), "Queue"],
  [SlidingResultAccountData.discriminator.toString("utf-8"), "SlidingWindow"],
  [VrfAccountData.discriminator.toString("utf-8"), "Vrf"],
  [BUFFER_DISCRIMINATOR.toString("utf-8"), "Buffer"],
]);
