import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  CrankAccount,
  CrankRow,
  OracleQueueAccount,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import { buffer2string, chalkString, pubKeyConverter } from "../";
import { CommandContext } from "../../types/context";
import { DEFAULT_CONTEXT } from "../../types/context/context";
import { LogProvider } from "../../types/context/logging";
import { AggregatorClass } from "../aggregator";
import { ProgramStateClass } from "../state";
import {
  CrankAccountData,
  CrankDefinition,
  fromCrankJSON,
  ICrankClass,
} from "./types";

export class CrankClass implements ICrankClass {
  account: CrankAccount;

  logger: LogProvider;

  publicKey: PublicKey;

  queuePublicKey: PublicKey;

  maxRows: number;

  metadata: string;

  name: string;

  aggregatorKeys: PublicKey[];

  dataBuffer: PublicKey;

  size: number;

  private constructor() {}

  private static async init(
    context: CommandContext,
    account: CrankAccount
  ): Promise<CrankClass> {
    const crank = new CrankClass();
    crank.logger = context.logger;

    crank.account = account;
    crank.publicKey = crank.account.publicKey;

    await crank.loadData();

    return crank;
  }

  static async build(
    context,
    program: anchor.Program,
    definition: CrankDefinition,
    queueAccount?: OracleQueueAccount
  ) {
    if ("account" in definition) {
      if (definition.account instanceof CrankAccount) {
        return CrankClass.fromAccount(context, definition.account);
      }
      throw new TypeError(`account type should be CrankAccount`);
    } else if ("publicKey" in definition) {
      return CrankClass.fromPublicKey(context, program, definition.publicKey);
    } else if (queueAccount) {
      return CrankClass.fromJSON(context, definition, queueAccount);
    }
    throw new Error("failed to build crank class");
  }

  public static async fromAccount(
    context: CommandContext,
    account: CrankAccount
  ) {
    return CrankClass.init(context, account);
  }

  public static fromPublicKey(
    context: CommandContext,
    program: anchor.Program,
    publicKey: PublicKey
  ) {
    return CrankClass.init(
      context,
      new CrankAccount({
        program,
        publicKey,
      })
    );
  }

  public static async fromJSON(
    context: CommandContext,
    definition: fromCrankJSON,
    queueAccount: OracleQueueAccount
  ) {
    const { name, metadata, maxRows } = definition;

    const account = await CrankAccount.create(queueAccount.program, {
      queueAccount,
      name: name ? Buffer.from(name) : undefined,
      metadata: metadata ? Buffer.from(metadata) : undefined,
      maxRows,
    });

    context.logger.info(`created crank account ${name}  ${account.publicKey}`);

    return CrankClass.init(context, account);
  }

  public static async fromDefault(
    context: CommandContext,
    queueAccount: OracleQueueAccount,
    name = ""
  ) {
    return CrankClass.fromJSON(context, { name }, queueAccount);
  }

  static async turn(
    crankAccount: CrankAccount,
    context = DEFAULT_CONTEXT
  ): Promise<string> {
    const { queuePubkey } = await crankAccount.loadData();
    const queueAccount = new OracleQueueAccount({
      program: crankAccount.program,
      publicKey: queuePubkey,
    });

    const { authority } = await queueAccount.loadData();
    const authorityTokenWallet = await ProgramStateClass.getProgramTokenAddress(
      crankAccount.program
    );

    const state = await ProgramStateClass.build(crankAccount.program, context);

    const popTxn = await crankAccount.pop({
      payoutWallet: authorityTokenWallet,
      queuePubkey,
      queueAuthority: authority,
      crank: 0,
      queue: 0,
      tokenMint: state.tokenMintPublicKey,
    });
    return popTxn;
  }

  async push(aggregator: AggregatorClass): Promise<string> {
    return this.account.push({ aggregatorAccount: aggregator.account });
  }

  // loads anchor idl and parses response
  async loadData() {
    const data: CrankAccountData | any = await this.account.loadData();
    this.aggregatorKeys = data.pqData
      .slice(0, data.pqSize)
      .map((item: CrankRow) => item.pubkey);

    this.name = buffer2string(data.name as any);
    this.metadata = buffer2string(data.metadata as any);
    this.publicKey = this.account.publicKey;
    this.queuePublicKey = data.queuePubkey;
    this.maxRows = data.maxRows;
    this.dataBuffer = data.dataBuffer;
    this.size = data.pqSize;
  }

  toJSON(): ICrankClass {
    return {
      name: this.name,
      metadata: this.metadata,
      publicKey: this.publicKey,
      queuePublicKey: this.queuePublicKey,
      maxRows: this.maxRows,
    };
  }

  toString(): string {
    return JSON.stringify(this.toJSON(), pubKeyConverter, 2);
  }

  prettyPrint(all = false, SPACING = 30): string {
    let outputString = "";

    outputString += chalk.underline(
      chalkString("## Crank", this.publicKey.toString(), SPACING) + "\r\n"
    );
    outputString += chalkString("name", this.name, SPACING) + "\r\n";
    outputString += chalkString("metadata", this.metadata, SPACING) + "\r\n";
    outputString +=
      chalkString("dataBuffer", this.dataBuffer, SPACING) + "\r\n";
    outputString +=
      chalkString("queuePubkey", this.queuePublicKey, SPACING) + "\r\n";
    outputString +=
      chalkString("rows", `${this.size} / ${this.maxRows}`, SPACING) + "\r\n";

    if (all) {
      outputString +=
        chalkString(
          "maxRows",
          JSON.stringify(this.aggregatorKeys, pubKeyConverter, 2),
          SPACING
        ) + "\r\n";
    }

    return outputString;
  }
}
