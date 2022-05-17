import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { fromPublicKey, fromSwitchboardAccount } from "..";

export interface LeaseAccountData {
  escrow: PublicKey;
  queue: PublicKey;
  aggregator: PublicKey;
  tokenProgram: PublicKey;
  isActive: boolean;
  crankRowCount: number;
  createdAt: anchor.BN;
  updateCount: anchor.BN;
  withdrawAuthority: PublicKey;
}

/** Object representing a loaded onchain Lease Account */
export interface ILeaseClass {
  publicKey: PublicKey;
  aggregatorPublicKey: PublicKey;
  escrowPublicKey: PublicKey;
  isActive: boolean;
  tokenProgramPublicKey: PublicKey;
  queuePublicKey: PublicKey;
  withdrawAuthorityPublicKey: PublicKey;
}

export type LeaseDefinition =
  | fromSwitchboardAccount
  | fromPublicKey
  | ILeaseClass;
