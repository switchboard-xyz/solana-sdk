import * as anchor from "@project-serum/anchor";
import { ACCOUNT_DISCRIMINATOR_SIZE } from "@project-serum/anchor/dist/cjs/coder";
import { PublicKey } from "@solana/web3.js";
import {
  AggregatorAccount,
  CrankAccount,
  JobAccount,
  LeaseAccount,
  OracleAccount,
  OracleQueueAccount,
  PermissionAccount,
  ProgramStateAccount,
  SwitchboardDecimal,
  SwitchboardPermission,
  SwitchboardPermissionValue,
  VrfAccount,
} from "@switchboard-xyz/switchboard-v2";
import Big from "big.js";
import chalk from "chalk";
import {
  AggregatorClass,
  CrankClass,
  JobClass,
  LeaseClass,
  OracleClass,
  OracleQueueClass,
  PermissionClass,
  ProgramStateClass,
} from "..";
import { CommandContext } from "../../types";
import { loadKeypair } from "../../utils";
import {
  SwitchboardAccountType,
  SWITCHBOARD_DISCRIMINATOR_MAP,
} from "../types";

export const getArrayOfSizeN = (number_: number): number[] => {
  return Array.from({ length: number_ }, (_, index) => index + 1);
};

// list of keys that will not be included in a json output file
const IGNORE_JSON_OUTPUT_KEYS = new Set<string>([
  "account",
  "isActive",
  "logger",
]);

export const toPermissionString = (
  permission: SwitchboardPermissionValue
): string => {
  switch (permission) {
    case SwitchboardPermissionValue.PERMIT_ORACLE_HEARTBEAT:
      return "PERMIT_ORACLE_HEARTBEAT";
    case SwitchboardPermissionValue.PERMIT_ORACLE_QUEUE_USAGE:
      return "PERMIT_ORACLE_QUEUE_USAGE";
    default:
      return "NONE";
  }
};

export enum VrfStatus {
  STATUS_NONE = "statusNone",
  STATUS_REQUESTING = "statusRequesting",
  STATUS_VERIFYING = "statusVerifying",
  STATUS_VERIFIED = "statusVerifying",
  STATUS_CALLBACK_SUCCESS = "statusCallbackSuccess",
  STATUS_VERIFY_FAILURE = "statusVerifyFailure",
}

export const toVrfStatus1 = (status: object): string => {
  if ("statusNone" in status) {
    return "StatusNone";
  }
  if ("statusRequesting" in status) {
    return "StatusRequesting";
  }
  if ("statusVerifying" in status) {
    return "StatusVerifying";
  }
  if ("statusVerified" in status) {
    return "StatusVerified";
  }
  if ("statusCallbackSuccess" in status) {
    return "StatusCallbackSuccess";
  }
  if ("statusVerifyFailure" in status) {
    return "StatusVerifyFailure";
  }
  return "Unknown";
};

export const toVrfStatus = (status: object): VrfStatus => {
  if ("statusNone" in status) {
    return VrfStatus.STATUS_NONE;
  }
  if ("statusRequesting" in status) {
    return VrfStatus.STATUS_REQUESTING;
  }
  if ("statusVerifying" in status) {
    return VrfStatus.STATUS_VERIFYING;
  }
  if ("statusVerified" in status) {
    return VrfStatus.STATUS_VERIFIED;
  }
  if ("statusCallbackSuccess" in status) {
    return VrfStatus.STATUS_CALLBACK_SUCCESS;
  }
  if ("statusVerifyFailure" in status) {
    return VrfStatus.STATUS_VERIFY_FAILURE;
  }
};

export const toPermission = (
  permissionString: string
): SwitchboardPermission => {
  switch (permissionString) {
    case "PERMIT_ORACLE_HEARTBEAT":
      return SwitchboardPermission.PERMIT_ORACLE_HEARTBEAT;
    case "PERMIT_ORACLE_QUEUE_USAGE":
      return SwitchboardPermission.PERMIT_ORACLE_QUEUE_USAGE;
    default:
      return SwitchboardPermission[0];
  }
};

// JSON.stringify: Object => String
export const pubKeyConverter = (key: any, value: any): any => {
  if (value instanceof PublicKey || key.toLowerCase().endsWith("publickey")) {
    return value.toString();
  }
  if (value instanceof Uint8Array) {
    return `[${value.toString()}]`;
  }
  if (value instanceof anchor.BN) {
    return value.toString();
  }
  if (value instanceof Big) {
    return value.toString();
  }
  if (value instanceof SwitchboardDecimal) {
    return new Big(value.mantissa.toString())
      .div(new Big(10).pow(value.scale))
      .toString();
  }
  if (IGNORE_JSON_OUTPUT_KEYS.has(key)) return undefined;
  return value;
};

// JSON.parse: String => Object
export const pubKeyReviver = (key, value): any => {
  if (key.toLowerCase().endsWith("publickey")) {
    return new PublicKey(value);
  }
  if (key.toLowerCase().endsWith("secretkey")) {
    return new Uint8Array(JSON.parse(value));
  }
  if (key.toLowerCase().endsWith("keypair")) {
    return loadKeypair(value);
  }
  if (key.toLowerCase().startsWith("variancethreshold")) {
    return new SwitchboardDecimal(new anchor.BN(value.mantissa), value.scale);
  }
  return value;
};

export const chalkString = (
  label: string,
  value: string | number | boolean | PublicKey | Big | anchor.BN,
  padding = 16
): string => {
  return `${chalk.blue(label.padEnd(padding, " "))}${chalk.yellow(
    value ? value.toString() : "undefined"
  )}`;
};

/* eslint-disable no-control-regex */
export const buffer2string = (buf: Buffer | string | ArrayBuffer): string => {
  return Buffer.from(buf as any)
    .toString("utf8")
    .replace(/\u0000/g, ""); // removes padding from onchain fixed sized buffers
};

const padTime = (number_: number): string => {
  return number_.toString().padStart(2, "0");
};

export function toDateString(d: Date | undefined): string {
  if (d)
    return `${d.getFullYear()}-${padTime(d.getMonth() + 1)}-${padTime(
      d.getDate()
    )} L`;
  return "";
}

export function anchorBNtoDateString(ts: anchor.BN): string {
  if (!ts.toNumber()) return "N/A";
  return toDateString(new Date(ts.toNumber() * 1000));
}

export function toDateTimeString(d: Date | undefined): string {
  if (d)
    return `${d.getFullYear()}-${padTime(d.getMonth() + 1)}-${padTime(
      d.getDate()
    )} ${padTime(d.getHours())}:${padTime(d.getMinutes())}:${padTime(
      d.getSeconds()
    )} L`;
  return "";
}

export function anchorBNtoDateTimeString(ts: anchor.BN): string {
  if (!ts.toNumber()) return "N/A";
  return toDateTimeString(new Date(ts.toNumber() * 1000));
}

export const isJobAccount = async (
  program: anchor.Program,
  publicKey: PublicKey
): Promise<JobAccount | undefined> => {
  try {
    const account = new JobAccount({ program, publicKey });
    await account.loadData();
    return account;
  } catch {
    return undefined;
  }
};

export const isAggregatorAccount = async (
  program: anchor.Program,
  publicKey: PublicKey
): Promise<AggregatorAccount | undefined> => {
  try {
    const account = new AggregatorAccount({ program, publicKey });
    await account.loadData();
    return account;
  } catch {
    return undefined;
  }
};

export const isOracleAccount = async (
  program: anchor.Program,
  publicKey: PublicKey
): Promise<OracleAccount | undefined> => {
  try {
    const account = new OracleAccount({ program, publicKey });
    await account.loadData();
    return account;
  } catch {
    return undefined;
  }
};

export const isCrankAccount = async (
  program: anchor.Program,
  publicKey: PublicKey
): Promise<CrankAccount | undefined> => {
  try {
    const account = new CrankAccount({ program, publicKey });
    await account.loadData();
    return account;
  } catch {
    return undefined;
  }
};

export const isOracleQueueAccount = async (
  program: anchor.Program,
  publicKey: PublicKey
): Promise<OracleQueueAccount | undefined> => {
  try {
    const account = new OracleQueueAccount({ program, publicKey });
    await account.loadData();
    return account;
  } catch {
    return undefined;
  }
};

export const isPermissionAccount = async (
  program: anchor.Program,
  publicKey: PublicKey
): Promise<PermissionAccount | undefined> => {
  try {
    const account = new PermissionAccount({ program, publicKey });
    await account.loadData();
    return account;
  } catch {
    return undefined;
  }
};

export const isLeaseAccount = async (
  program: anchor.Program,
  publicKey: PublicKey
): Promise<LeaseAccount | undefined> => {
  try {
    const account = new LeaseAccount({ program, publicKey });
    await account.loadData();
    return account;
  } catch {
    return undefined;
  }
};

export const isProgramStateAccount = async (
  program: anchor.Program,
  publicKey: PublicKey
): Promise<ProgramStateAccount | undefined> => {
  try {
    const account = new ProgramStateAccount({ program, publicKey });
    await account.loadData();
    return account;
  } catch {
    return undefined;
  }
};

// should also check if pubkey is a token account
export const findAccountType = async (
  program: anchor.Program,
  publicKey: PublicKey
): Promise<SwitchboardAccountType> => {
  const account = await program.provider.connection.getAccountInfo(publicKey);
  const accountDiscriminator = account.data.slice(
    0,
    ACCOUNT_DISCRIMINATOR_SIZE
  );

  for (const [name, discriminator] of SWITCHBOARD_DISCRIMINATOR_MAP.entries()) {
    if (Buffer.compare(accountDiscriminator, discriminator) === 0) {
      return name;
    }
  }

  throw new Error(`no switchboard account found for ${publicKey}`);
};

export const buildClassFromKey = async (
  context: CommandContext,
  program: anchor.Program,
  publicKey: PublicKey
): Promise<
  | JobClass
  | AggregatorClass
  | OracleClass
  | PermissionClass
  | LeaseClass
  | OracleQueueClass
  | CrankClass
  | ProgramStateClass
  | VrfAccount
> => {
  const accountType = await findAccountType(program, publicKey);
  switch (accountType) {
    case "JobAccountData": {
      const job = await JobClass.fromAccount(
        context,
        new JobAccount({ program, publicKey })
      );
      context.logger.log(job.prettyPrint());
      break;
    }
    case "AggregatorAccountData": {
      const aggregator = await AggregatorClass.fromAccount(
        context,
        new AggregatorAccount({ program, publicKey })
      );
      context.logger.log(aggregator.prettyPrint());
      break;
    }
    case "OracleAccountData": {
      const oracle = await OracleClass.fromAccount(
        context,
        new OracleAccount({ program, publicKey })
      );
      context.logger.log(oracle.prettyPrint());
      break;
    }
    case "PermissionAccountData": {
      const permission = await PermissionClass.fromAccount(
        context,
        new PermissionAccount({ program, publicKey })
      );
      context.logger.log(permission.prettyPrint());
      break;
    }
    case "LeaseAccountData": {
      const lease = await LeaseClass.fromAccount(
        context,
        new LeaseAccount({ program, publicKey })
      );
      context.logger.log(lease.prettyPrint());
      break;
    }
    case "OracleQueueAccountData": {
      const queue = await OracleQueueClass.fromAccount(
        context,
        new OracleQueueAccount({ program, publicKey })
      );
      context.logger.log(queue.prettyPrint());
      break;
    }
    case "CrankAccountData": {
      const crank = await CrankClass.fromAccount(
        context,
        new CrankAccount({ program, publicKey })
      );
      context.logger.log(crank.prettyPrint());
      break;
    }
    case "ProgramStateAccountData": {
      const state = await ProgramStateClass.build(program);
      context.logger.log(state.prettyPrint());
      break;
    }
    // case "VrfAccountData": {
    //   const state = new VrfAccount
    //   context.logger.log(state.prettyPrint());
    //   break;
    // }
  }
  throw new Error(`no switchboard account found for ${publicKey}`);
};
