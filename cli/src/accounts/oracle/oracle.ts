import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  OracleAccount,
  OracleQueueAccount,
} from "@switchboard-xyz/switchboard-v2/src";
import chalk from "chalk";
import {
  anchorBNtoDateTimeString,
  buffer2string,
  chalkString,
  pubKeyConverter,
} from "../";
import { CommandContext, DEFAULT_CONTEXT } from "../../types/context";
import { LogProvider } from "../../types/context/logging";
import { getProgramPayer } from "../../utils";
import { PermissionClass } from "../permission";
import { ProgramStateClass } from "../state";
import {
  fromOracleJSON,
  IOracleClass,
  OracleAccountData,
  OracleDefinition,
  OracleMetricsData,
} from "./types";

export class OracleClass implements IOracleClass {
  account: OracleAccount;

  logger: LogProvider;

  publicKey: PublicKey;

  name: string;

  metadata: string;

  authorityPublicKey: PublicKey;

  tokenAccountPublicKey: PublicKey;

  queuePublicKey: PublicKey;

  balance: number;

  lastHeartbeat: string;

  numInUse: number;

  metrics: OracleMetricsData;

  permissionAccount?: PermissionClass;

  private constructor() {}

  private static async init(
    context: CommandContext,
    account: OracleAccount,
    definition: OracleDefinition
  ): Promise<OracleClass> {
    const oracle = new OracleClass();
    oracle.logger = context.logger;

    oracle.account = account;
    oracle.publicKey = oracle.account.publicKey;

    await oracle.loadData();

    const queueAccount = new OracleQueueAccount({
      program: account.program,
      publicKey: oracle.queuePublicKey,
    });

    oracle.permissionAccount = await PermissionClass.build(
      context,
      oracle.account,
      queueAccount,
      definition && "permissionAccount" in definition
        ? definition.permissionAccount
        : undefined
    );

    await oracle.loadData();

    return oracle;
  }

  async grantPermission(
    context: CommandContext,
    queueAuthority = (this.account.program.provider.wallet as anchor.Wallet)
      .payer
  ): Promise<string> {
    const queueAccount = new OracleQueueAccount({
      program: this.account.program,
      publicKey: this.queuePublicKey,
    });

    const { authority } = await queueAccount.loadData();

    if (
      this.permissionAccount.permission === "NONE" &&
      queueAuthority.publicKey.equals(authority)
    ) {
      const anchorWallet = (
        this.account.program.provider.wallet as anchor.Wallet
      ).payer;
      this.permissionAccount = await PermissionClass.grantPermission(
        context,
        this.account,
        anchorWallet
      );
    }

    return this.permissionAccount.permission;
  }

  static async build(
    context: CommandContext,
    program: anchor.Program,
    definition: OracleDefinition,
    queueAccount?: OracleQueueAccount
  ): Promise<OracleClass> {
    if ("account" in definition) {
      if (definition.account instanceof OracleAccount) {
        return OracleClass.fromAccount(context, definition.account);
      }
      throw new TypeError("account must be an instance of OracleAccount");
    } else if ("publicKey" in definition) {
      return OracleClass.fromPublicKey(context, program, definition.publicKey);
    } else if (queueAccount) {
      return OracleClass.fromJSON(context, queueAccount, definition);
    }
    throw new Error(
      `need to provide oracle queue account to build new oracle account`
    );
  }

  public static async fromAccount(
    context: CommandContext,
    account: OracleAccount
  ): Promise<OracleClass> {
    return OracleClass.init(context, account, {});
  }

  public static fromPublicKey(
    context: CommandContext,
    program: anchor.Program,
    publicKey: PublicKey
  ) {
    return OracleClass.init(
      context,
      new OracleAccount({
        program,
        publicKey,
      }),
      {}
    );
  }

  private static async fromJSON(
    context: CommandContext,
    queueAccount: OracleQueueAccount,
    definition: fromOracleJSON
  ) {
    const account = await OracleAccount.create(queueAccount.program, {
      queueAccount,
      name: definition.name ? Buffer.from(definition.name) : Buffer.from(""),
      oracleAuthority: definition.authorityKeypair,
      metadata: definition.metadata
        ? Buffer.from(definition.metadata)
        : Buffer.from(""),
    });

    context.logger.info(
      `created oracle account ${definition.name}  ${account.publicKey}`
    );

    return OracleClass.init(context, account, definition);
  }

  static async fromDefault(
    context: CommandContext,
    queueAccount: OracleQueueAccount,
    name = ""
  ): Promise<OracleClass> {
    return OracleClass.build(
      context,
      queueAccount.program,
      { name },
      queueAccount
    );
  }

  static async getBalance(
    oracleAccount: OracleAccount,
    tokenAccount?: PublicKey,
    context = DEFAULT_CONTEXT
  ): Promise<number> {
    const oracleTokenAccount =
      // eslint-disable-next-line unicorn/no-await-expression-member
      tokenAccount ?? (await oracleAccount.loadData()).tokenAccount;
    const tokenAmount =
      await oracleAccount.program.provider.connection.getTokenAccountBalance(
        oracleTokenAccount
      );
    return Number.parseInt(tokenAmount.value.amount, 10);
  }

  static async withdrawTokens(
    context: CommandContext,
    oracleAccount: OracleAccount,
    amount: number,
    withdrawAccount: PublicKey,
    authority?: Keypair,
    force = false
  ): Promise<string> {
    const { queuePubkey, tokenAccount, oracleAuthority } =
      await oracleAccount.loadData();

    const authorityKeypair =
      authority || getProgramPayer(oracleAccount.program);
    if (!oracleAuthority.equals(authorityKeypair.publicKey)) {
      throw new Error(
        `invalid oracle authority provided (expected) ${oracleAuthority}, (received) ${authority.publicKey}`
      );
    }
    const oracleQueueAccount = new OracleQueueAccount({
      program: oracleAccount.program,
      publicKey: queuePubkey,
    });
    const oracleQueueData = await oracleQueueAccount.loadData();
    const minStake: number = oracleQueueData.minStake.toNumber();

    // check final balance is greater than min stake
    const initialOracleBalance = await OracleClass.getBalance(
      oracleAccount,
      tokenAccount
    );
    const finalOracleBalance = initialOracleBalance - amount;
    if (amount > initialOracleBalance) {
      throw new Error(
        `requested withdraw amount ${amount} exceeds current balance ${initialOracleBalance}`
      );
    }
    if (!force && minStake > finalOracleBalance)
      throw new Error(
        `withdrawing will result in your account falling below the minimum stake`
      );

    // withdraw
    const withdrawTxn = await oracleAccount.withdraw({
      amount: new anchor.BN(amount),
      oracleAuthority: authorityKeypair,
      withdrawAccount,
    });
    return withdrawTxn;
  }

  static async depositTokens(
    context: CommandContext,
    oracleAccount: OracleAccount,
    amount: number,
    funderTokenAccount?: PublicKey
  ): Promise<string> {
    const oracleTokenAccount =
      // eslint-disable-next-line unicorn/no-await-expression-member
      (await oracleAccount.loadData()).tokenAccount;
    const state = await ProgramStateClass.build(oracleAccount.program, context);
    const payerTokenAccount =
      funderTokenAccount ||
      (await ProgramStateClass.getProgramTokenAddress(
        oracleAccount.program,
        context
      ));

    // check payer has enough funds
    const payerTokenBalance =
      await oracleAccount.program.provider.connection.getBalance(
        payerTokenAccount
      );
    if (amount > payerTokenBalance)
      throw new Error(
        `trying to deposit ${amount} tokens but current balance is ${payerTokenBalance}`
      );

    return state.token.transfer(
      payerTokenAccount,
      oracleTokenAccount,
      (oracleAccount.program.provider.wallet as anchor.Wallet).payer,
      [],
      amount
    );
  }

  // loads anchor idl and parses response
  async loadData() {
    const data: OracleAccountData = await this.account.loadData();

    this.publicKey = this.account.publicKey;
    this.name = buffer2string(data.name as any);
    this.metadata = buffer2string(data.metadata as any);
    this.authorityPublicKey = data.oracleAuthority;
    this.lastHeartbeat = anchorBNtoDateTimeString(data.lastHeartbeat);
    this.numInUse = data.numInUse;
    this.tokenAccountPublicKey = data.tokenAccount;
    this.queuePublicKey = data.queuePubkey;
    this.metrics = data.metrics;
    this.balance = await OracleClass.getBalance(
      this.account,
      this.tokenAccountPublicKey
    );
  }

  toJSON(): IOracleClass {
    return {
      name: this.name,
      metadata: this.metadata,
      publicKey: this.publicKey,
      authorityPublicKey: this.authorityPublicKey,
      queuePublicKey: this.queuePublicKey,
      tokenAccountPublicKey: this.tokenAccountPublicKey,
      permissionAccount: this.permissionAccount.toJSON(),
    };
  }

  toString(): string {
    return JSON.stringify(this.toJSON(), pubKeyConverter, 2);
  }

  prettyPrint(all = false, SPACING = 24): string {
    let outputString = "";

    outputString += chalk.underline(
      chalkString("## Oracle", this.publicKey.toString(), SPACING) + "\r\n"
    );
    outputString += chalkString("name", this.name, SPACING) + "\r\n";
    outputString += chalkString("metadata", this.metadata, SPACING) + "\r\n";
    outputString += chalkString("balance", this.balance, SPACING) + "\r\n";
    outputString +=
      chalkString("oracleAuthority", this.authorityPublicKey, SPACING) + "\r\n";
    outputString +=
      chalkString("tokenAccount", this.tokenAccountPublicKey, SPACING) + "\r\n";
    outputString +=
      chalkString("queuePubkey", this.queuePublicKey, SPACING) + "\r\n";
    outputString +=
      chalkString(
        "permissionAccount",
        this.permissionAccount.publicKey || "N/A",
        SPACING
      ) + "\r\n";
    outputString +=
      chalkString(
        "permissions",
        this.permissionAccount.permission || "",
        SPACING
      ) + "\r\n";
    outputString +=
      chalkString("lastHeartbeat", this.lastHeartbeat, SPACING) + "\r\n";
    outputString += chalkString("numInUse", this.numInUse, SPACING) + "\r\n";
    outputString +=
      chalkString(
        "metrics",
        JSON.stringify(this.metrics, undefined, 2),
        SPACING
      ) + "\r\n";

    if (all && this.permissionAccount) {
      outputString += this.permissionAccount.prettyPrint(all, SPACING);
    }

    return outputString;
  }
}
