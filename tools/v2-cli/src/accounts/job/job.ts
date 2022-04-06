import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { OracleJob } from "@switchboard-xyz/switchboard-api";
import { JobAccount } from "@switchboard-xyz/switchboard-v2";
import * as chalk from "chalk";
import { getUrlFromTask } from ".";
import { buffer2string, chalkString, copyAccount, pubKeyConverter } from "../";
import { CommandContext } from "../../types/context";
import { LogProvider } from "../../types/context/logging";
import { ProgramStateClass } from "../state";
import { buildJobTasks } from "./buildTemplate";
import {
  fromJobJSON,
  fromJobTemplate,
  IJobClass,
  JobAccountData,
  JobDefinition,
} from "./types";

export class JobClass implements IJobClass {
  account: JobAccount;
  logger: LogProvider;

  publicKey: PublicKey;
  authorWalletPublicKey: PublicKey;
  expiration: anchor.BN;
  metadata: string;
  name: string;
  tasks: OracleJob.ITask[];

  private constructor() {}

  private static async init(
    context: CommandContext,
    account: JobAccount
  ): Promise<JobClass> {
    const job = new JobClass();
    job.account = account;
    job.publicKey = job.account.publicKey;
    job.logger = context.logger;

    await job.loadData();

    return job;
  }

  static async build(
    context: CommandContext,
    program: anchor.Program,
    definition: JobDefinition
  ): Promise<JobClass> {
    if ("account" in definition) {
      if (definition.account instanceof JobAccount) {
        return JobClass.fromAccount(context, definition.account);
      }
      throw new TypeError(`account type should be CrankAccount`);
    } else if ("publicKey" in definition) {
      return JobClass.fromPublicKey(context, program, definition.publicKey);
    } else if ("template" in definition) {
      return JobClass.fromTemplate(context, program, definition);
    } else if ("tasks" in definition) {
      return JobClass.fromJSON(context, program, definition);
    } else if ("sourcePublicKey" in definition) {
      return JobClass.fromCopyAccount(context, program, definition);
    } else {
      throw new Error(`failed to build job from definition ${definition}`);
    }
  }

  public static fromAccount(context: CommandContext, account: JobAccount) {
    return JobClass.init(context, account);
  }

  public static fromPublicKey(
    context: CommandContext,
    program: anchor.Program,
    publicKey: PublicKey
  ) {
    return JobClass.init(
      context,
      new JobAccount({
        program,
        publicKey,
      })
    );
  }

  public static async fromTemplate(
    context: CommandContext,
    program: anchor.Program,
    definition: fromJobTemplate
  ) {
    const tasks = await buildJobTasks(definition.template, definition.id);
    const job = OracleJob.create({ tasks });
    const data = Buffer.from(OracleJob.encodeDelimited(job).finish());
    const jobUrl = getUrlFromTask(job);
    const account = await JobAccount.create(program, {
      data,
      name: Buffer.from(`${jobUrl} ${definition.id}`),
    });
    return JobClass.init(context, account);
  }

  public static async fromJSON(
    context: CommandContext,
    program: anchor.Program,
    definition: fromJobJSON
  ) {
    const { name, tasks, expiration, authorWalletPublicKey, existingKeypair } =
      definition;
    const data = Buffer.from(
      OracleJob.encodeDelimited(
        OracleJob.create({
          tasks,
        })
      ).finish()
    );

    const keypair = existingKeypair ?? anchor.web3.Keypair.generate();
    const account = await JobAccount.create(program, {
      data: data,
      name: name ? Buffer.from(name) : Buffer.from(""),
      expiration: expiration ? new anchor.BN(expiration) : undefined,
      authorWallet:
        authorWalletPublicKey ??
        (await ProgramStateClass.getProgramTokenAddress(program)),
      keypair,
    });

    context.fs.saveKeypair(keypair);

    context.logger.info(`created job account ${name}  ${account.publicKey}`);

    return JobClass.init(context, account);
  }

  public static async fromCopyAccount(
    context: CommandContext,
    program: anchor.Program,
    definition: copyAccount
  ) {
    const sourceJob = new JobAccount({
      program,
      publicKey: definition.sourcePublicKey,
    });
    const jobData: JobAccountData = await sourceJob.loadData();
    const account = await JobAccount.create(program, {
      data: jobData.data,
      name: Buffer.from(jobData.name),
      expiration: jobData.expiration
        ? new anchor.BN(jobData.expiration)
        : undefined,
      authorWallet: jobData.authorWallet ?? undefined,
    });
    return JobClass.init(context, account);
  }

  // loads anchor idl and parses response
  async loadData() {
    const data: JobAccountData = await this.account.loadData();

    this.authorWalletPublicKey = data.authorWallet;
    this.expiration = data.expiration;
    this.metadata = buffer2string(data.metadata as any);
    this.name = buffer2string(data.name as any);
    this.tasks = OracleJob.decodeDelimited(data.data).tasks;
  }

  toJSON(): IJobClass {
    return {
      name: this.name,
      metadata: this.metadata,
      publicKey: this.publicKey,
      authorWalletPublicKey: this.authorWalletPublicKey,
      expiration: this.expiration,
      tasks: this.tasks,
    };
  }

  toString(): string {
    return JSON.stringify(this.toJSON(), pubKeyConverter, 2);
  }

  prettyPrint(all = false): string {
    let outputString = "";

    outputString += chalk.underline(
      chalkString("## Job", this.publicKey) + "\r\n"
    );
    outputString += chalkString("name", this.name) + "\r\n";
    outputString +=
      chalkString("authorWallet", this.authorWalletPublicKey) + "\r\n";
    outputString +=
      chalkString("expiration", this.expiration.toString()) + "\r\n";
    outputString +=
      chalkString("tasks", JSON.stringify(this.tasks, undefined, 2)) + "\r\n";

    return outputString;
  }
}
