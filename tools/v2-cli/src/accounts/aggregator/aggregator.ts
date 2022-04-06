import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  AggregatorAccount,
  OracleQueueAccount,
  SwitchboardDecimal,
} from "@switchboard-xyz/switchboard-v2";
import Big from "big.js";
import * as chalk from "chalk";
import { ProgramStateClass } from "..";
import { AggregatorIllegalRoundOpenCall } from "../../types";
import {
  CommandContext,
  DEFAULT_CONTEXT,
  LogProvider,
} from "../../types/context";
import { getProgramPayer } from "../../utils";
import { JobClass, JobDefinition } from "../job";
import { LeaseClass } from "../lease";
import { PermissionClass } from "../permission";
import { copyAccount, DEFAULT_PUBKEY } from "../types";
import {
  anchorBNtoDateTimeString,
  buffer2string,
  chalkString,
  pubKeyConverter,
} from "../utils";
import {
  AggregatorAccountData,
  AggregatorDefinition,
  fromAggregatorJSON,
  IAggregatorClass,
} from "./types";

export class AggregatorClass implements IAggregatorClass {
  account: AggregatorAccount;
  logger: LogProvider;

  publicKey: PublicKey;
  authorWalletPublicKey: PublicKey;
  authorityPublicKey: PublicKey;
  oracleRequestBatchSize: number; // REQ, will default to some value
  crankPublicKey?: PublicKey;
  historyBufferPublicKey?: PublicKey;
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

  jobs: JobClass[];
  leaseAccount: LeaseClass;
  permissionAccount: PermissionClass;

  result: string;
  resultTimestamp: string;

  private constructor() {}

  static async init(
    context: CommandContext,
    aggregatorAccount: AggregatorAccount,
    definition?: AggregatorDefinition
  ) {
    const aggregator = new AggregatorClass();
    aggregator.account = aggregatorAccount;
    aggregator.publicKey = aggregator.account.publicKey;
    aggregator.logger = context.logger;

    await aggregator.loadData();
    const queueAccount = new OracleQueueAccount({
      program: aggregatorAccount.program,
      publicKey: aggregator.queuePublicKey,
    });

    try {
      aggregator.permissionAccount = await PermissionClass.build(
        context,
        aggregator.account,
        queueAccount,
        definition && "permissionAccount" in definition
          ? definition.permissionAccount
          : undefined
      );
    } catch {}

    try {
      aggregator.leaseAccount = await LeaseClass.build(
        context,
        aggregator.account,
        queueAccount,
        definition && "leaseAccount" in definition
          ? definition.leaseAccount
          : undefined
      );
    } catch {}

    try {
      const { authority } = await queueAccount.loadData();
      if (
        aggregator.permissionAccount.permission === "NONE" &&
        authority.equals(aggregator.account.program.provider.wallet.publicKey)
      ) {
        const anchorWallet = (
          aggregator.account.program.provider.wallet as anchor.Wallet
        ).payer;
        aggregator.permissionAccount = await PermissionClass.grantPermission(
          context,
          aggregator.account,
          anchorWallet
        );
      }
    } catch {}

    await aggregator.loadData();

    return aggregator;
  }

  public static async build(
    context: CommandContext,
    program: anchor.Program,
    definition: AggregatorDefinition,
    queueAccount?: OracleQueueAccount
  ) {
    if (
      "account" in definition &&
      definition.account instanceof AggregatorAccount
    ) {
      return AggregatorClass.init(context, definition.account, definition);
    }
    if ("publicKey" in definition) {
      return AggregatorClass.fromPublicKey(
        context,
        program,
        definition.publicKey
      );
    }
    if (queueAccount) {
      // need queue account defined to create any new aggregators
      if ("jobs" in definition) {
        if (definition.jobs.length > 0) {
          return AggregatorClass.fromJSON(context, queueAccount, definition);
        }
        throw new Error(
          "need to provide at least one job definition to build an aggregator"
        );
      }
      if ("sourcePublicKey" in definition) {
        return AggregatorClass.fromCopyAccount(
          context,
          queueAccount,
          definition
        );
      }
    }
    throw new Error(`failed to build aggregator from definition ${definition}`);
  }

  public static async fromAccount(
    context: CommandContext,
    account: AggregatorAccount
  ) {
    return AggregatorClass.init(context, account);
  }

  public static fromPublicKey(
    context: CommandContext,
    program: anchor.Program,
    publicKey: PublicKey
  ) {
    const account = new AggregatorAccount({
      program,
      publicKey,
    });
    return AggregatorClass.init(context, account);
  }

  public static async fromJSON(
    context: CommandContext,
    queueAccount: OracleQueueAccount,
    definition: fromAggregatorJSON
  ) {
    if (!definition.jobs || definition.jobs.length === 0)
      throw new Error("cannot create an aggregator with no jobs provided");
    const aggregatorAccount = await AggregatorAccount.create(
      queueAccount.program,
      {
        authority:
          definition.authorityPublicKey ??
          getProgramPayer(queueAccount.program).publicKey,
        authorWallet:
          definition.authorWalletPublicKey ??
          (await ProgramStateClass.getProgramTokenAddress(
            queueAccount.program
          )),
        batchSize: definition.oracleRequestBatchSize ?? 1,
        expiration: definition.expiration
          ? new anchor.BN(definition.expiration)
          : undefined,
        keypair: definition.existingKeypair ?? undefined,
        minRequiredOracleResults: definition.minRequiredOracleResults ?? 1,
        minRequiredJobResults: definition.minRequiredJobResults ?? 1,
        minUpdateDelaySeconds: definition.minUpdateDelaySeconds ?? 30,
        name: definition.name ? Buffer.from(definition.name) : undefined,
        metadata: definition.metadata
          ? Buffer.from(definition.metadata)
          : undefined,
        queueAccount,
      }
    );

    if (aggregatorAccount.keypair) {
      context.fs.saveKeypair(aggregatorAccount.keypair);
    }

    try {
      if (definition.historyBuffer) {
        const size = Math.floor(definition.historyBuffer);
        await aggregatorAccount.setHistoryBuffer({
          size,
        });
        context.logger.debug(`created history buffer of size ${size}`);
      }
    } catch {}

    context.logger.info(
      `created aggregator ${definition.name}  ${aggregatorAccount.publicKey}`
    );

    await AggregatorClass.buildJobs(
      context,
      aggregatorAccount,
      definition.jobs
    );
    return AggregatorClass.init(context, aggregatorAccount, definition);
  }

  public static async fromCopyAccount(
    context: CommandContext,
    queueAccount: OracleQueueAccount,
    definition: copyAccount
  ) {
    const sourceAggregator = new AggregatorAccount({
      program: queueAccount.program,
      publicKey: definition.sourcePublicKey,
    });
    const source = await AggregatorClass.fromAccount(context, sourceAggregator);

    const variance = new Big(source.varianceThreshold.mantissa.toString()).div(
      new Big(10).pow(source.varianceThreshold.scale)
    );

    const targetDefinition: fromAggregatorJSON = {
      ...source.toJSON(),
      authorityPublicKey:
        definition.authorityKeypair?.publicKey ||
        queueAccount.program.provider.wallet.publicKey,
      crank: undefined,
      expiration: source.expiration.toString(),
      forceReportPeriod: source.forceReportPeriod.toString(),
      queuePublicKey: queueAccount.publicKey,
      varianceThreshold: variance.toNumber(),
    };

    return AggregatorClass.fromJSON(context, queueAccount, targetDefinition);
  }

  async addJob(
    jobDefinition: JobDefinition,
    context = DEFAULT_CONTEXT
  ): Promise<number> {
    const job = await JobClass.build(
      context,
      this.account.program,
      jobDefinition
    );
    await this.account.addJob(
      job.account,
      getProgramPayer(this.account.program)
    );
    this.jobs.push(job);
    const newJobIndex = this.jobs.findIndex((existingJob) =>
      existingJob.publicKey.equals(job.publicKey)
    );
    if (newJobIndex === -1) {
      throw new Error(`failed to find new job in aggregator`);
    }
    return newJobIndex;
  }

  async removeJob(jobKey: PublicKey, authority?: Keypair): Promise<JobClass> {
    const removeIndex = this.jobs.findIndex((job) =>
      job.publicKey.equals(jobKey)
    );
    if (removeIndex === -1) {
      throw new Error(`failed to remove job with publicKey ${jobKey}`);
    }
    const removedJob = this.jobs[removeIndex];
    await this.account.removeJob(removedJob.account, authority);
    this.jobs = this.jobs.filter((job, index) => index !== removeIndex);
    return removedJob;
  }

  async extendLease(
    funderTokenAccount: PublicKey,
    amount: anchor.BN
  ): Promise<string> {
    return this.leaseAccount.account.extend({
      funder: funderTokenAccount,
      funderAuthority: getProgramPayer(this.account.program),
      loadAmount: amount,
    });
  }

  async addHistoryBuffer(size: number, authority?: Keypair): Promise<string> {
    return this.account.setHistoryBuffer({
      size,
      authority: authority || undefined,
    });
  }

  static async buildJobs(
    context: CommandContext,
    aggregatorAccount: AggregatorAccount,
    jobs: JobDefinition[]
  ) {
    const newJobs: JobClass[] = [];
    for await (const jobDefinition of jobs) {
      try {
        const newJob = await JobClass.build(
          context,
          aggregatorAccount.program,
          jobDefinition
        );
        newJobs.push(newJob);
        await aggregatorAccount.addJob(
          newJob.account,
          getProgramPayer(aggregatorAccount.program)
        );
      } catch (error) {
        context.logger.log(
          `failed to add job to aggregator ${error.message}\r\n${jobDefinition} `
        );
      }
    }
  }

  async grantPermission(
    context: CommandContext,
    queueAuthority = (this.account.program.provider.wallet as anchor.Wallet)
      .payer
  ): Promise<string> {
    if (
      this.permissionAccount.permission === "NONE" &&
      this.authorityPublicKey.equals(
        this.account.program.provider.wallet.publicKey
      )
    ) {
      this.permissionAccount = await PermissionClass.grantPermission(
        context,
        this.account,
        queueAuthority
      );
    }
    return this.permissionAccount.permission;
  }

  static updateReady(aggregator: AggregatorAccountData) {
    const timestamp: anchor.BN = new anchor.BN(Math.round(Date.now() / 1000));
    const minUpdateDelay: number = aggregator.minUpdateDelaySeconds;
    const currentTimestamp = aggregator.currentRound.roundOpenTimestamp;
    const diff = timestamp.sub(currentTimestamp).abs().toNumber();

    if (diff < minUpdateDelay) {
      throw new AggregatorIllegalRoundOpenCall(
        `${diff} / ${minUpdateDelay} sec`
      );
    }
  }

  async update(
    payoutAddress?: PublicKey,
    context = DEFAULT_CONTEXT
  ): Promise<string> {
    AggregatorClass.updateReady(await this.account.loadData());

    const oracleQueueAccount = new OracleQueueAccount({
      program: this.account.program,
      publicKey: this.queuePublicKey,
    });

    const payoutWallet =
      payoutAddress ??
      (await ProgramStateClass.getProgramTokenAddress(
        this.account.program,
        context
      ));

    return this.account.openRound({
      oracleQueueAccount,
      payoutWallet,
    });
  }

  static async getJobs(
    aggregatorAccount: AggregatorAccount,
    aggregatorData?: Promise<AggregatorAccountData>,
    context = DEFAULT_CONTEXT
  ): Promise<JobClass[]> {
    const data: AggregatorAccountData = aggregatorData
      ? await aggregatorData
      : await aggregatorAccount.loadData();

    const jobs: JobClass[] = [];
    for await (const jobKey of data.jobPubkeysData) {
      if (!jobKey.equals(DEFAULT_PUBKEY)) {
        const job = await JobClass.build(context, aggregatorAccount.program, {
          publicKey: jobKey,
        });
        jobs.push(job);
      }
    }
    return jobs;
  }

  // loads onchain jobs, lease, permission, and account data
  async loadData() {
    const dataPromise: Promise<AggregatorAccountData> = this.account.loadData();
    this.jobs = await AggregatorClass.getJobs(this.account, dataPromise);
    const data = await dataPromise;

    this.result = new SwitchboardDecimal(
      data.latestConfirmedRound.result.mantissa,
      data.latestConfirmedRound.result.scale
    )
      .toBig()
      .toString();
    this.resultTimestamp = anchorBNtoDateTimeString(
      data.latestConfirmedRound.roundOpenTimestamp
    );
    this.publicKey = this.account.publicKey;
    this.authorWalletPublicKey = data.authorWallet;
    this.authorityPublicKey = data.authority;
    this.crankPublicKey = data.crankPubkey;
    this.historyBufferPublicKey = data.historyBuffer;
    this.oracleRequestBatchSize = data.oracleRequestBatchSize;
    this.expiration = data.expiration;
    this.forceReportPeriod = data.forceReportPeriod;
    this.isLocked = data.isLocked;
    this.metadata = buffer2string(data.metadata as any);
    this.minRequiredJobResults = data.minJobResults;
    this.minRequiredOracleResults = data.minOracleResults;
    this.minUpdateDelaySeconds = data.minUpdateDelaySeconds;
    this.name = buffer2string(data.name as any);
    this.queuePublicKey = data.queuePubkey;
    this.startAfter = data.startAfter.toNumber();
    this.varianceThreshold = data.varianceThreshold;
  }

  toJSON(): IAggregatorClass {
    return {
      name: this.name,
      metadata: this.metadata,
      publicKey: this.publicKey,
      authorityPublicKey: this.authorityPublicKey,
      crankPublicKey: this.crankPublicKey,
      authorWalletPublicKey: this.authorWalletPublicKey,
      oracleRequestBatchSize: this.oracleRequestBatchSize,
      expiration: this.expiration,
      forceReportPeriod: this.forceReportPeriod,
      isLocked: this.isLocked,
      minRequiredJobResults: this.minRequiredJobResults,
      minRequiredOracleResults: this.minRequiredOracleResults,
      minUpdateDelaySeconds: this.minUpdateDelaySeconds,
      queuePublicKey: this.queuePublicKey,
      startAfter: this.startAfter,
      varianceThreshold: this.varianceThreshold,
      leaseAccount: this.leaseAccount.toJSON(),
      permissionAccount: this.permissionAccount.toJSON(),
      jobs: this.jobs ? this.jobs.map((job) => job.toJSON()) : [],
    };
  }

  toString(): string {
    return JSON.stringify(this.toJSON(), pubKeyConverter, 2);
  }

  prettyPrint(all = false, SPACING = 24): string {
    let outputString = "";

    outputString += chalk.underline(
      chalkString("## Aggregator", this.account.publicKey.toString(), SPACING) +
        "\r\n"
    );

    outputString +=
      chalkString(
        "latestResult",
        `${this.result} (${this.resultTimestamp})`,
        SPACING
      ) + "\r\n";

    outputString += chalkString("name", this.name, SPACING) + "\r\n";
    outputString += chalkString("metadata", this.metadata, SPACING) + "\r\n";
    outputString +=
      chalkString("authority", this.authorityPublicKey, SPACING) + "\r\n";
    outputString +=
      chalkString("queuePubkey", this.queuePublicKey, SPACING) + "\r\n";
    outputString +=
      chalkString("crankPubkey", this.crankPublicKey, SPACING) + "\r\n";
    outputString +=
      chalkString(
        "historyBufferPublicKey",
        this.historyBufferPublicKey,
        SPACING
      ) + "\r\n";
    outputString +=
      chalkString("authorWallet", this.authorWalletPublicKey, SPACING) + "\r\n";
    outputString +=
      chalkString("jobPubkeysSize", this.jobs.length, SPACING) + "\r\n";
    outputString +=
      chalkString("minJobResults", this.minRequiredJobResults, SPACING) +
      "\r\n";
    outputString +=
      chalkString(
        "oracleRequestBatchSize",
        this.oracleRequestBatchSize,
        SPACING
      ) + "\r\n";
    outputString +=
      chalkString("minOracleResults", this.minRequiredOracleResults, SPACING) +
      "\r\n";
    // outputString +=
    //   chalkString(
    //     "varianceThreshold",
    //     this.varianceThreshold.toBig().toString(),
    //     SPACING
    //   ) + "\r\n";
    outputString +=
      chalkString(
        "minUpdateDelaySeconds",
        this.minUpdateDelaySeconds,
        SPACING
      ) + "\r\n";
    outputString +=
      chalkString(
        "forceReportPeriod",
        this.forceReportPeriod.toNumber(),
        SPACING
      ) + "\r\n";
    outputString += chalkString("isLocked", this.isLocked, SPACING) + "\r\n";

    if (all) {
      if (this.permissionAccount) {
        outputString += `\r\n${this.permissionAccount.prettyPrint(
          true,
          SPACING
        )}`;
      }
      if (this.leaseAccount) {
        outputString += `\r\n${this.leaseAccount.prettyPrint(true, SPACING)}`;
      }
      for (const job of this.jobs) {
        outputString += `\r\n${job.prettyPrint(true)}`;
      }
    }

    return outputString;
  }
}
