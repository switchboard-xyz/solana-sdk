import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { SwitchboardPermissionValue } from "@switchboard-xyz/switchboard-v2/src";
import { fromPublicKey, fromSwitchboardAccount } from "..";

export interface PermissionAccountData {
  authority: PublicKey;
  permissions: SwitchboardPermissionValue;
  granter: PublicKey;
  grantee: PublicKey;
  expiration: anchor.BN;
}

/** Object representing a loaded onchain Permission Account */
export interface IPermissionClass {
  publicKey: PublicKey;
  authorityPublicKey: PublicKey;
  granterPublicKey: PublicKey;
  granteePublicKey: PublicKey;
  permission: string;
  expiration: anchor.BN;
}

export type PermissionDefinition =
  | fromSwitchboardAccount
  | fromPublicKey
  | IPermissionClass;
