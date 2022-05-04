import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  AggregatorAccount,
  LeaseAccount,
  OracleQueueAccount,
  programWallet,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import {
  AggregatorAccountData,
  chalkString,
  LeaseAccountData,
  pubKeyConverter,
} from "../";
import { CommandContext } from "../../types/context";
import { LogProvider } from "../../types/context/logging";
import { programHasPayer } from "../../utils";
import { ProgramStateClass } from "../state";
import { ILeaseClass, LeaseDefinition } from "./types";

export class LeaseClass implements ILeaseClass {
  account: LeaseAccount;

  logger: LogProvider;

  publicKey: PublicKey;

  aggregatorPublicKey: PublicKey;

  escrowPublicKey: PublicKey;

  isActive: boolean;

  tokenProgramPublicKey: PublicKey;

  queuePublicKey: PublicKey;

  withdrawAuthorityPublicKey: PublicKey;

  escrowBalance: number;

  private constructor() {}

  private static async init(context: CommandContext, account: LeaseAccount) {
    const lease = new LeaseClass();
    lease.account = account;
    lease.publicKey = lease.account.publicKey;
    lease.logger = context.logger;

    await lease.loadData();
    return lease;
  }

  public static async build(
    context: CommandContext,
    aggregatorAccount: AggregatorAccount,
    queueAccount: OracleQueueAccount,
    definition?: LeaseDefinition
  ): Promise<LeaseClass> {
    // eslint-disable-next-line unicorn/prefer-ternary
    if (definition && "account" in definition) {
      if (definition.account instanceof LeaseAccount) {
        return LeaseClass.fromAccount(context, definition.account);
      }
      throw new TypeError("account must be an instance of PermissionAccount");
    } else if (definition && "publicKey" in definition) {
      return LeaseClass.fromPublicKey(
        context,
        aggregatorAccount.program,
        definition.publicKey
      );
    }

    if (programHasPayer(aggregatorAccount.program)) {
      return LeaseClass.getOrCreateLeaseAccount(
        context,
        aggregatorAccount,
        queueAccount
      );
    }

    return LeaseClass.getLeaseAccount(context, aggregatorAccount, queueAccount);
  }

  public static fromAccount(context: CommandContext, account: LeaseAccount) {
    return LeaseClass.init(context, account);
  }

  public static fromPublicKey(
    context: CommandContext,
    program: anchor.Program,
    publicKey: PublicKey
  ) {
    return LeaseClass.init(
      context,
      new LeaseAccount({
        program,
        publicKey,
      })
    );
  }

  public static async getLeaseAccount(
    context: CommandContext,
    aggregatorAccount: AggregatorAccount,
    queueAccount?: OracleQueueAccount
  ): Promise<LeaseClass | undefined> {
    let leaseAccount: LeaseAccount;

    let queue = queueAccount;
    if (!queue) {
      const agg: AggregatorAccountData = await aggregatorAccount.loadData();
      queue = new OracleQueueAccount({
        program: aggregatorAccount.program,
        publicKey: agg.queuePubkey,
      });
    }

    try {
      [leaseAccount] = LeaseAccount.fromSeed(
        aggregatorAccount.program,
        queueAccount,
        aggregatorAccount
      );
      await leaseAccount.loadData();
      return await LeaseClass.init(context, leaseAccount);
    } catch {
      context.logger.debug(
        `no lease account found for ${aggregatorAccount.publicKey}`
      );
    }
  }

  public static async getOrCreateLeaseAccount(
    context: CommandContext,
    aggregatorAccount: AggregatorAccount,
    queueAccount?: OracleQueueAccount
  ): Promise<LeaseClass | undefined> {
    let queue = queueAccount;
    if (!queue) {
      const agg: AggregatorAccountData = await aggregatorAccount.loadData();
      queue = new OracleQueueAccount({
        program: aggregatorAccount.program,
        publicKey: agg.queuePubkey,
      });
    }

    // find existing account
    const lease: LeaseClass | undefined = await LeaseClass.getLeaseAccount(
      context,
      aggregatorAccount,
      queue
    );
    if (lease) return lease;

    // if payer, create new
    if (programHasPayer(aggregatorAccount.program)) {
      const programTokenWallet = await ProgramStateClass.getProgramTokenAddress(
        aggregatorAccount.program
      );
      try {
        const leaseAccount = await LeaseAccount.create(
          aggregatorAccount.program,
          {
            aggregatorAccount,
            oracleQueueAccount: queueAccount,
            loadAmount: new anchor.BN(0),
            funder: programTokenWallet,
            funderAuthority: programWallet(aggregatorAccount.program),
            withdrawAuthority: programTokenWallet,
          }
        );
        return await LeaseClass.init(context, leaseAccount);
      } catch (error) {
        throw new Error(`failed to create lease account ${error.message}`);
      }
    }
  }

  async getBalance(): Promise<number> {
    const resp =
      await this.account.program.provider.connection.getTokenAccountBalance(
        this.escrowPublicKey
      );
    return Number.parseInt(resp.value.amount, 10);
  }

  // loads anchor idl and parses response
  async loadData() {
    const data: LeaseAccountData = await this.account.loadData();

    this.publicKey = this.account.publicKey;
    this.aggregatorPublicKey = data.aggregator;
    this.escrowPublicKey = data.escrow;
    this.isActive = data.isActive;
    this.tokenProgramPublicKey = data.tokenProgram;
    this.queuePublicKey = data.queue;
    this.withdrawAuthorityPublicKey = data.withdrawAuthority;

    this.escrowBalance = await this.getBalance();
  }

  toJSON(): ILeaseClass {
    return {
      publicKey: this.account.publicKey,
      aggregatorPublicKey: this.aggregatorPublicKey,
      queuePublicKey: this.queuePublicKey,
      escrowPublicKey: this.escrowPublicKey,
      isActive: this.isActive,
      tokenProgramPublicKey: this.tokenProgramPublicKey,
      withdrawAuthorityPublicKey: this.withdrawAuthorityPublicKey,
    };
  }

  toString(): string {
    return JSON.stringify(this.toJSON(), pubKeyConverter, 2);
  }

  prettyPrint(all = false, SPACING = 24): string {
    let outputString = "";

    outputString += chalk.underline(
      chalkString("## Lease", this.publicKey, SPACING) + "\r\n"
    );
    outputString +=
      chalkString("escrow", this.escrowPublicKey, SPACING) + "\r\n";
    outputString +=
      chalkString("escrowBalance", this.escrowBalance, SPACING) + "\r\n";
    outputString +=
      chalkString(
        "withdrawAuthority",
        this.withdrawAuthorityPublicKey,
        SPACING
      ) + "\r\n";
    outputString += chalkString("queue", this.queuePublicKey, SPACING) + "\r\n";
    outputString +=
      chalkString("aggregator", this.aggregatorPublicKey, SPACING) + "\r\n";
    outputString += chalkString("isActive", this.isActive, SPACING) + "\r\n";

    return outputString;
  }
}
