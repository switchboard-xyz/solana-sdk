import * as anchor from "@project-serum/anchor";
import { ACCOUNT_DISCRIMINATOR_SIZE } from "@project-serum/anchor";
import type { PublicKey } from "@solana/web3.js";
import {
  AggregatorAccount,
  CrankAccount,
  JobAccount,
  LeaseAccount,
  OracleAccount,
  OracleQueueAccount,
  PermissionAccount,
  ProgramStateAccount,
  VrfAccount,
} from "@switchboard-xyz/switchboard-v2";

export class InvalidSwitchboardAccount extends Error {
  constructor(message = "failed to match account type by discriminator") {
    super(message);
    Object.setPrototypeOf(this, InvalidSwitchboardAccount.prototype);
  }
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

export type SwitchboardAccount =
  | JobAccount
  | AggregatorAccount
  | OracleAccount
  | OracleQueueAccount
  | PermissionAccount
  | LeaseAccount
  | ProgramStateAccount
  | VrfAccount
  | CrankAccount;

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

// should also check if pubkey is a token account
export const findAccountType = async (
  program: anchor.Program,
  publicKey: PublicKey
): Promise<SwitchboardAccountType> => {
  const account = await program.provider.connection.getAccountInfo(publicKey);
  if (!account) {
    throw new Error(`failed to fetch account info for ${publicKey}`);
  }

  const accountDiscriminator = account.data.slice(
    0,
    ACCOUNT_DISCRIMINATOR_SIZE
  );

  for (const [name, discriminator] of SWITCHBOARD_DISCRIMINATOR_MAP.entries()) {
    if (Buffer.compare(accountDiscriminator, discriminator) === 0) {
      return name;
    }
  }

  throw new InvalidSwitchboardAccount();
};

export const loadSwitchboardAccount = async (
  program: anchor.Program,
  publicKey: PublicKey
): Promise<[SwitchboardAccountType, SwitchboardAccount]> => {
  const accountType = await findAccountType(program, publicKey);
  switch (accountType) {
    case "JobAccountData": {
      return [accountType, new JobAccount({ program, publicKey })];
    }

    case "AggregatorAccountData": {
      return [accountType, new AggregatorAccount({ program, publicKey })];
    }

    case "OracleAccountData": {
      return [accountType, new OracleAccount({ program, publicKey })];
    }

    case "PermissionAccountData": {
      return [accountType, new PermissionAccount({ program, publicKey })];
    }

    case "LeaseAccountData": {
      return [accountType, new LeaseAccount({ program, publicKey })];
    }

    case "OracleQueueAccountData": {
      return [accountType, new OracleQueueAccount({ program, publicKey })];
    }

    case "CrankAccountData": {
      return [accountType, new CrankAccount({ program, publicKey })];
    }

    case "SbState":
    case "ProgramStateAccountData": {
      return [accountType, new ProgramStateAccount({ program, publicKey })];
    }

    case "VrfAccountData": {
      return [accountType, new VrfAccount({ program, publicKey })];
    }
  }

  throw new InvalidSwitchboardAccount();
};
