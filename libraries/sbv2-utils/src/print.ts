import { BN, Program } from "@project-serum/anchor";
import { AccountMeta, PublicKey, TokenAmount } from "@solana/web3.js";
import {
  AggregatorAccount,
  CrankAccount,
  CrankRow,
  JobAccount,
  LeaseAccount,
  OracleAccount,
  OracleJob,
  OracleQueueAccount,
  PermissionAccount,
  ProgramStateAccount,
  SwitchboardDecimal,
  SwitchboardPermissionValue,
  VrfAccount,
} from "@switchboard-xyz/switchboard-v2";
import type Big from "big.js";
import chalk from "chalk";
import { anchorBNtoDateTimeString } from "./date";
import type { SwitchboardAccountType } from "./switchboard";

export const chalkString = (
  label: string,
  value: string | number | boolean | PublicKey | Big | BN,
  padding = 16
): string => {
  let valueString = "";
  if (typeof value === "string") {
    valueString = value;
  } else if (typeof value === "number") {
    valueString = value.toString();
  } else if (typeof value === "boolean") {
    valueString = value.toString();
  } else if (value instanceof PublicKey) {
    if (PublicKey.default.equals(value)) {
      valueString = "N/A";
    } else {
      valueString = value.toString();
    }
  } else if (value !== undefined) {
    valueString = value.toString();
  }
  return `${chalk.blue(label.padEnd(padding, " "))}${chalk.yellow(
    valueString
  )}`;
};

export const tokenAmountString = (value: TokenAmount): string => {
  return `${value.uiAmountString ?? ""} (${value.amount})`;
};

/* eslint-disable no-control-regex */
export const buffer2string = (buf: Buffer | string | ArrayBuffer): string => {
  return Buffer.from(buf as any)
    .toString("utf8")
    .replace(/\u0000/g, ""); // removes padding from onchain fixed sized buffers
};

export const toPermissionString = (
  permission: SwitchboardPermissionValue
): string => {
  switch (permission) {
    case SwitchboardPermissionValue.PERMIT_ORACLE_HEARTBEAT:
      return "PERMIT_ORACLE_HEARTBEAT";
    case SwitchboardPermissionValue.PERMIT_ORACLE_QUEUE_USAGE:
      return "PERMIT_ORACLE_QUEUE_USAGE";
    case SwitchboardPermissionValue.PERMIT_VRF_REQUESTS:
      return "PERMIT_VRF_REQUESTS";
    default:
      return "NONE";
  }
};

export const toVrfStatusString = (status: Record<string, unknown>): string => {
  if (status === undefined) {
    return "";
  }
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

export async function prettyPrintProgramState(
  programState: ProgramStateAccount,
  accountData?: any,
  SPACING = 24
): Promise<string> {
  const data = accountData ?? (await programState.loadData());

  let outputString = "";
  outputString += chalk.underline(
    chalkString("## SbState", programState.publicKey, SPACING) + "\r\n"
  );
  outputString += chalkString("authority", data.authority, SPACING) + "\r\n";
  outputString += chalkString("tokenMint", data.tokenMint, SPACING) + "\r\n";
  outputString += chalkString("tokenVault", data.tokenVault, SPACING);
  return outputString;
}

export async function prettyPrintOracle(
  oracleAccount: OracleAccount,
  accountData?: any,
  printPermissions = false,
  SPACING = 24
): Promise<string> {
  const data = accountData ?? (await oracleAccount.loadData());
  const oracleTokenAmount =
    await oracleAccount.program.provider.connection.getTokenAccountBalance(
      data.tokenAccount
    );

  let outputString = "";

  outputString += chalk.underline(
    chalkString("## Oracle", oracleAccount.publicKey, SPACING) + "\r\n"
  );
  outputString +=
    chalkString("name", buffer2string(data.name as any), SPACING) + "\r\n";
  outputString +=
    chalkString("metadata", buffer2string(data.metadata as any), SPACING) +
    "\r\n";
  outputString +=
    chalkString(
      "balance",
      tokenAmountString(oracleTokenAmount.value),
      SPACING
    ) + "\r\n";
  outputString +=
    chalkString("oracleAuthority", data.oracleAuthority, SPACING) + "\r\n";
  outputString +=
    chalkString("tokenAccount", data.tokenAccount, SPACING) + "\r\n";
  outputString +=
    chalkString("queuePubkey", data.queuePubkey, SPACING) + "\r\n";
  outputString +=
    chalkString(
      "lastHeartbeat",
      anchorBNtoDateTimeString(data.lastHeartbeat),
      SPACING
    ) + "\r\n";
  outputString += chalkString("numInUse", data.numInUse, SPACING) + "\r\n";
  outputString += chalkString(
    "metrics",
    JSON.stringify(data.metrics, undefined, 2),
    SPACING
  );

  if (printPermissions) {
    let permissionAccount: PermissionAccount;
    try {
      const queueAccount = new OracleQueueAccount({
        program: oracleAccount.program,
        publicKey: data.queuePubkey,
      });
      const queue = await queueAccount.loadData();
      [permissionAccount] = PermissionAccount.fromSeed(
        oracleAccount.program,
        queue.authority,
        queueAccount.publicKey,
        oracleAccount.publicKey
      );
      const permissionData = await permissionAccount.loadData();
      outputString +=
        "\r\n" +
        (await prettyPrintPermissions(permissionAccount, permissionData));
    } catch {
      outputString += `\r\nFailed to load permission account. Has it been created yet?`;
    }
  }

  return outputString;
}

export async function prettyPrintPermissions(
  permissionAccount: PermissionAccount,
  accountData?: any,
  SPACING = 24
): Promise<string> {
  const data = accountData ?? (await permissionAccount.loadData());

  let outputString = "";

  outputString += chalk.underline(
    chalkString("## Permission", permissionAccount.publicKey, SPACING) + "\r\n"
  );
  outputString += chalkString("authority", data.authority, SPACING) + "\r\n";
  outputString +=
    chalkString("permissions", toPermissionString(data.permissions), SPACING) +
    "\r\n";
  outputString += chalkString("granter", data.granter, SPACING) + "\r\n";
  outputString += chalkString("grantee", data.grantee, SPACING) + "\r\n";
  outputString += chalkString(
    "expiration",
    anchorBNtoDateTimeString(data.expiration),
    SPACING
  );
  return outputString;
}

export async function prettyPrintQueue(
  queueAccount: OracleQueueAccount,
  accountData?: any,
  printOracles = false,
  SPACING = 30
): Promise<string> {
  const data = accountData ?? (await queueAccount.loadData());

  const varianceToleranceMultiplier = SwitchboardDecimal.from(
    data.varianceToleranceMultiplier
  ).toBig();

  let outputString = "";

  outputString += chalk.underline(
    chalkString("## Queue", queueAccount.publicKey, SPACING) + "\r\n"
  );
  outputString +=
    chalkString("name", buffer2string(data.name as any), SPACING) + "\r\n";
  outputString +=
    chalkString("metadata", buffer2string(data.metadata as any), SPACING) +
    "\r\n";
  outputString +=
    chalkString("oracleBuffer", data.dataBuffer, SPACING) + "\r\n";
  outputString += chalkString("authority", data.authority, SPACING) + "\r\n";
  outputString +=
    chalkString("oracleTimeout", data.oracleTimeout, SPACING) + "\r\n";
  outputString += chalkString("reward", data.reward, SPACING) + "\r\n";
  outputString += chalkString("minStake", data.minStake, SPACING) + "\r\n";
  outputString +=
    chalkString("slashingEnabled", data.slashingEnabled, SPACING) + "\r\n";
  outputString +=
    chalkString(
      "consecutiveFeedFailureLimit",
      data.consecutiveFeedFailureLimit.toString(),
      SPACING
    ) + "\r\n";
  outputString +=
    chalkString(
      "consecutiveOracleFailureLimit",
      data.consecutiveOracleFailureLimit.toString(),
      SPACING
    ) + "\r\n";
  outputString +=
    chalkString(
      "varianceToleranceMultiplier",
      varianceToleranceMultiplier,
      SPACING
    ) + "\r\n";
  outputString +=
    chalkString(
      "feedProbationPeriod",
      data.feedProbationPeriod.toString(),
      SPACING
    ) + "\r\n";
  outputString +=
    chalkString(
      "unpermissionedFeedsEnabled",
      data.unpermissionedFeedsEnabled.toString(),
      SPACING
    ) + "\r\n";
  outputString +=
    chalkString(
      "unpermissionedVrfEnabled",
      data.unpermissionedVrfEnabled.toString(),
      SPACING
    ) + "\r\n";
  outputString += chalkString(
    "unpermissionedVrfEnabled",
    data.enableBufferRelayers?.toString() ?? "",
    SPACING
  );

  if (printOracles && data.queue) {
    outputString += chalk.underline(
      chalkString("\r\n## Oracles", " ".repeat(32), SPACING) + "\r\n"
    );
    outputString += (data.queue as PublicKey[])
      .filter((pubkey) => !PublicKey.default.equals(pubkey))
      .map((pubkey) => pubkey.toString())
      .join("\n");

    // (data.queue as PublicKey[]).forEach(
    //   (row, index) =>
    //     (outputString +=
    //       chalkString(`# ${index + 1},`, row.toString(), SPACING) + "\r\n")
    // );
  }

  return outputString;
}

export async function prettyPrintLease(
  leaseAccount: LeaseAccount,
  accountData?: any,
  SPACING = 24
): Promise<string> {
  const data = accountData ?? (await leaseAccount.loadData());

  const escrowTokenAmount =
    await leaseAccount.program.provider.connection.getTokenAccountBalance(
      data.escrow
    );
  const balance = Number.parseInt(escrowTokenAmount.value.amount, 10);

  let outputString = "";

  outputString += chalk.underline(
    chalkString("## Lease", leaseAccount.publicKey, SPACING) + "\r\n"
  );
  outputString += chalkString("escrow", data.escrow, SPACING) + "\r\n";
  outputString +=
    chalkString(
      "escrowBalance",
      tokenAmountString(escrowTokenAmount.value),
      SPACING
    ) + "\r\n";
  outputString +=
    chalkString("withdrawAuthority", data.withdrawAuthority, SPACING) + "\r\n";
  outputString += chalkString("queue", data.queue, SPACING) + "\r\n";
  outputString += chalkString("aggregator", data.aggregator, SPACING) + "\r\n";
  outputString += chalkString("isActive", data.isActive, SPACING);

  return outputString;
}

export async function prettyPrintJob(
  jobAccount: JobAccount,
  accountData?: any,
  SPACING = 24
): Promise<string> {
  const data = accountData ?? (await jobAccount.loadData());

  let outputString = "";

  outputString += chalk.underline(
    chalkString("## Job", jobAccount.publicKey, SPACING) + "\r\n"
  );
  outputString +=
    chalkString("name", buffer2string(data.name as any), SPACING) + "\r\n";
  outputString +=
    chalkString("metadata", buffer2string(data.metadata as any), SPACING) +
    "\r\n";
  outputString +=
    chalkString("authorWallet", data.authorWallet, SPACING) + "\r\n";
  outputString += chalkString("expiration", data.expiration, SPACING) + "\r\n";
  outputString += chalkString(
    "tasks",
    JSON.stringify(OracleJob.decodeDelimited(data.data).tasks, undefined, 2),
    SPACING
  );

  return outputString;
}

// TODO: Add rest of fields
export async function prettyPrintAggregator(
  aggregatorAccount: AggregatorAccount,
  accountData?: any,
  printPermissions = false,
  printLease = false,
  printJobs = false,
  SPACING = 24
): Promise<string> {
  const data = accountData ?? (await aggregatorAccount.loadData());

  const result = SwitchboardDecimal.from(data.latestConfirmedRound.result)
    .toBig()
    .toString();

  const resultTimestamp = anchorBNtoDateTimeString(
    data.latestConfirmedRound.roundOpenTimestamp ?? new BN(0)
  );

  const varianceThreshold = parseFloat(
    SwitchboardDecimal.from(data.varianceThreshold).toBig().toString()
  ).toFixed(2);

  let outputString = "";
  outputString += chalk.underline(
    chalkString("## Aggregator", aggregatorAccount.publicKey, SPACING) + "\r\n"
  );

  outputString +=
    chalkString(
      "latestResult",
      `${result} (${resultTimestamp ?? ""})`,
      SPACING
    ) + "\r\n";
  outputString +=
    chalkString("name", buffer2string(data.name as any), SPACING) + "\r\n";
  outputString +=
    chalkString("metadata", buffer2string(data.metadata as any), SPACING) +
    "\r\n";
  outputString += chalkString("authority", data.authority, SPACING) + "\r\n";
  outputString +=
    chalkString("queuePubkey", data.queuePubkey, SPACING) + "\r\n";
  outputString +=
    chalkString("crankPubkey", data.crankPubkey, SPACING) + "\r\n";
  outputString +=
    chalkString("historyBufferPublicKey", data.historyBuffer, SPACING) + "\r\n";
  outputString +=
    chalkString(
      "authorWallet",
      data.authorWallet ?? PublicKey.default,
      SPACING
    ) + "\r\n";
  outputString +=
    chalkString("minUpdateDelaySeconds", data.minUpdateDelaySeconds, SPACING) +
    "\r\n";
  outputString +=
    chalkString("jobPubkeysSize", data.jobPubkeysSize, SPACING) + "\r\n";
  outputString +=
    chalkString("minJobResults", data.minJobResults, SPACING) + "\r\n";
  outputString +=
    chalkString(
      "oracleRequestBatchSize",
      data.oracleRequestBatchSize,
      SPACING
    ) + "\r\n";
  outputString +=
    chalkString("minOracleResults", data.minOracleResults, SPACING) + "\r\n";
  outputString +=
    chalkString("varianceThreshold", `${varianceThreshold} %`, SPACING) +
    "\r\n";
  outputString +=
    chalkString("forceReportPeriod", data.forceReportPeriod, SPACING) + "\r\n";
  outputString += chalkString("isLocked", data.isLocked, SPACING);

  if (printPermissions) {
    let permissionAccount: PermissionAccount;
    try {
      const queueAccount = new OracleQueueAccount({
        program: aggregatorAccount.program,
        publicKey: data.queuePubkey,
      });
      const queue = await queueAccount.loadData();
      [permissionAccount] = PermissionAccount.fromSeed(
        aggregatorAccount.program,
        queue.authority,
        queueAccount.publicKey,
        aggregatorAccount.publicKey
      );
      const permissionData = await permissionAccount.loadData();
      outputString +=
        "\r\n" +
        (await prettyPrintPermissions(permissionAccount, permissionData));
    } catch {
      outputString += `\r\nFailed to load permission account. Has it been created yet?`;
    }
  }

  if (printLease) {
    let leaseAccount: LeaseAccount;
    try {
      const queueAccount = new OracleQueueAccount({
        program: aggregatorAccount.program,
        publicKey: data.queuePubkey,
      });
      const { authority } = await queueAccount.loadData();
      [leaseAccount] = LeaseAccount.fromSeed(
        aggregatorAccount.program,
        queueAccount,
        aggregatorAccount
      );
      const leaseData = await leaseAccount.loadData();
      outputString +=
        "\r\n" + (await prettyPrintLease(leaseAccount, leaseData));
    } catch {
      outputString += `\r\nFailed to load lease account. Has it been created yet?`;
    }
  }

  if (printJobs) {
    const jobKeys: PublicKey[] = (data.jobPubkeysData as PublicKey[]).filter(
      (pubkey) => !PublicKey.default.equals(pubkey)
    );
    for await (const jobKey of jobKeys) {
      const jobAccount = new JobAccount({
        program: aggregatorAccount.program,
        publicKey: jobKey,
      });
      outputString += "\r\n" + (await prettyPrintJob(jobAccount));
    }
  }

  return outputString;
}

export async function prettyPrintVrf(
  vrfAccount: VrfAccount,
  accountData?: any,
  printPermissions = false,
  SPACING = 24
): Promise<string> {
  const data = accountData ?? (await vrfAccount.loadData());
  const escrowTokenAmount =
    await vrfAccount.program.provider.connection.getTokenAccountBalance(
      data.escrow
    );

  let outputString = "";
  outputString += chalk.underline(
    chalkString("## VRF", vrfAccount.publicKey, SPACING) + "\r\n"
  );
  outputString += chalkString("authority", data.authority, SPACING) + "\r\n";
  outputString +=
    chalkString("oracleQueue", data.oracleQueue, SPACING) + "\r\n";
  outputString += chalkString("escrow", data.escrow, SPACING) + "\r\n";
  outputString +=
    chalkString(
      "escrowBalance",
      tokenAmountString(escrowTokenAmount.value),
      SPACING
    ) + "\r\n";

  outputString += chalkString("batchSize", data.batchSize, SPACING) + "\r\n";
  outputString +=
    chalkString(
      "callback",
      JSON.stringify(
        {
          ...data.callback,
          accounts: data.callback.accounts.filter(
            (a: AccountMeta) => !a.pubkey.equals(PublicKey.default)
          ),
          ixData: `[${data.callback.ixData
            .slice(0, data.callback.ixDataLen)
            .map((n) => n.toString())
            .join(",")}]`,
        },
        undefined,
        // (key, value) => {
        //   if (Array.isArray(value)) {
        //     return `[${value
        //       .map((v) =>
        //         typeof v === "object" ? JSON.stringify(v) : v.toString()
        //       )
        //       .join(",")}]`;
        //   }

        //   return value;
        // },
        2
      ),
      SPACING
    ) + "\r\n";
  outputString += chalkString("counter", data.counter, SPACING) + "\r\n";
  outputString +=
    chalkString("status", toVrfStatusString(data.status), SPACING) + "\r\n";
  outputString += chalkString(
    "latestResult",
    JSON.stringify(
      {
        producer: data.builders[0]?.producer.toString() ?? "",
        status: toVrfStatusString(data.builders[0]?.status) ?? "",
        verified: data.builders[0]?.verified ?? "",
        txRemaining: data.builders[0]?.txRemaining ?? "",
        currentRound: {
          result: `[${data.currentRound.result.map((value) =>
            value.toString()
          )}]`,
          alpha: `[${data.currentRound.alpha.map((value) =>
            value.toString()
          )}]`,
          requestSlot: data.currentRound?.requestSlot?.toString() ?? "",
          requestTimestamp: anchorBNtoDateTimeString(
            data.currentRound.requestTimestamp
          ),
          numVerified: data.currentRound.numVerified.toString(),
        },
      },
      undefined,
      2
    ),
    SPACING
  );

  if (printPermissions) {
    let permissionAccount: PermissionAccount;
    try {
      const queueAccount = new OracleQueueAccount({
        program: vrfAccount.program,
        publicKey: data.oracleQueue,
      });
      const queue = await queueAccount.loadData();
      [permissionAccount] = PermissionAccount.fromSeed(
        vrfAccount.program,
        queue.authority,
        queueAccount.publicKey,
        vrfAccount.publicKey
      );
      const permissionData = await permissionAccount.loadData();
      outputString +=
        "\r\n" +
        (await prettyPrintPermissions(permissionAccount, permissionData));
    } catch {
      outputString += `\r\nFailed to load permission account. Has it been created yet?`;
    }
  }

  return outputString;
}

export async function prettyPrintCrank(
  crankAccount: CrankAccount,
  accountData?: any,
  printRows = false,
  SPACING = 24
): Promise<string> {
  const data = accountData ?? (await crankAccount.loadData());

  let outputString = "";

  outputString += chalk.underline(
    chalkString("## Crank", crankAccount.publicKey, SPACING) + "\r\n"
  );
  outputString +=
    chalkString("name", buffer2string(data.name as any), SPACING) + "\r\n";
  outputString +=
    chalkString("metadata", buffer2string(data.metadata as any), SPACING) +
    "\r\n";
  outputString +=
    chalkString("queuePubkey", data.queuePubkey, SPACING) + "\r\n";
  outputString += chalkString("dataBuffer", data.dataBuffer, SPACING) + "\r\n";
  outputString +=
    chalkString(
      "Size",
      `${(data.pqData as CrankRow[]).length
        .toString()
        .padStart(4)} / ${data.maxRows.toString().padEnd(4)}`,
      SPACING
    ) + "\r\n";

  if (printRows) {
    outputString += chalk.underline(
      chalkString("## Crank Buffer", data.dataBuffer, SPACING) + "\r\n"
    );
    const rowStrings = (data.pqData as CrankRow[]).map(
      (row) =>
        `${anchorBNtoDateTimeString(row.nextTimestamp).padEnd(
          16
        )} - ${row.pubkey.toString()}\r\n`
    );
    outputString.concat(...rowStrings);
  }
  return outputString;
}

export async function prettyPrintSwitchboardAccount(
  program: Program,
  publicKey: PublicKey,
  accountType: SwitchboardAccountType
): Promise<string> {
  switch (accountType) {
    case "JobAccountData": {
      const job = new JobAccount({ program, publicKey });
      return prettyPrintJob(job);
    }
    case "AggregatorAccountData": {
      const aggregator = new AggregatorAccount({ program, publicKey });
      return prettyPrintAggregator(aggregator, undefined);
    }
    case "OracleAccountData": {
      const oracle = new OracleAccount({ program, publicKey });
      return prettyPrintOracle(oracle, undefined);
    }
    case "PermissionAccountData": {
      const permission = new PermissionAccount({ program, publicKey });
      return prettyPrintPermissions(permission, undefined);
    }
    case "LeaseAccountData": {
      const lease = new LeaseAccount({ program, publicKey });
      return prettyPrintLease(lease, undefined);
    }
    case "OracleQueueAccountData": {
      const queue = new OracleQueueAccount({ program, publicKey });
      return prettyPrintQueue(queue, undefined);
    }
    case "CrankAccountData": {
      const crank = new CrankAccount({ program, publicKey });
      return prettyPrintCrank(crank, undefined);
    }
    case "SbState":
    case "ProgramStateAccountData": {
      const [programState] = ProgramStateAccount.fromSeed(program);
      return prettyPrintProgramState(programState);
    }
    case "VrfAccountData": {
      const vrfAccount = new VrfAccount({ program, publicKey });
      return prettyPrintVrf(vrfAccount, undefined);
    }
    case "BUFFERxx": {
      return `Found buffer account but dont know which one`;
    }
  }
}
