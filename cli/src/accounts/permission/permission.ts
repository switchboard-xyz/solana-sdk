import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  AggregatorAccount,
  OracleAccount,
  OracleQueueAccount,
  PermissionAccount,
  SwitchboardPermission,
} from "@switchboard-xyz/switchboard-v2/src";
import chalk from "chalk";
import { CommandContext } from "../../types/context";
import { LogProvider } from "../../types/context/logging";
import { programHasPayer } from "../../utils";
import { AggregatorAccountData } from "../aggregator";
import { OracleAccountData } from "../oracle";
import {
  anchorBNtoDateTimeString,
  chalkString,
  pubKeyConverter,
  toPermissionString,
} from "../utils";
import {
  IPermissionClass,
  PermissionAccountData,
  PermissionDefinition,
} from "./types";

export class PermissionClass implements IPermissionClass {
  account: PermissionAccount;

  logger: LogProvider;

  publicKey: PublicKey;

  authorityPublicKey: PublicKey;

  granterPublicKey: PublicKey;

  granteePublicKey: PublicKey;

  permission: string;

  expiration: anchor.BN;

  private constructor() {}

  private static async init(
    context: CommandContext,
    account: PermissionAccount
  ) {
    const permission = new PermissionClass();
    permission.logger = context.logger;

    permission.account = account;
    permission.publicKey = permission.account.publicKey;

    await permission.loadData();

    return permission;
  }

  static async build(
    context: CommandContext,
    granteeAccount: AggregatorAccount | OracleAccount,
    queueAccount?: OracleQueueAccount,
    definition?: PermissionDefinition
  ): Promise<PermissionClass | undefined> {
    // eslint-disable-next-line unicorn/prefer-ternary
    if (definition && "account" in definition) {
      if (definition.account instanceof PermissionAccount) {
        return PermissionClass.fromAccount(context, definition.account);
      }
      throw new TypeError("account must be an instance of PermissionAccount");
    } else if (definition && "publicKey" in definition) {
      return PermissionClass.fromPublicKey(
        context,
        granteeAccount.program,
        definition.publicKey
      );
    }

    if (programHasPayer(granteeAccount.program)) {
      return PermissionClass.getOrCreatePermissionAccount(
        context,
        granteeAccount,
        queueAccount
      );
    }
    return PermissionClass.getPermissionAccount(
      context,
      granteeAccount,
      queueAccount
    );
  }

  public static fromAccount(
    context: CommandContext,
    account: PermissionAccount
  ) {
    return PermissionClass.init(context, account);
  }

  public static fromPublicKey(
    context: CommandContext,
    program: anchor.Program,
    publicKey: PublicKey
  ) {
    return PermissionClass.init(
      context,
      new PermissionAccount({
        program,
        publicKey,
      })
    );
  }

  static async grantPermission(
    context: CommandContext,
    granteeAccount: OracleAccount | AggregatorAccount,
    granterAuthority: Keypair
  ): Promise<PermissionClass> {
    const permission: PermissionClass | undefined = programHasPayer(
      granteeAccount.program
    )
      ? await PermissionClass.getOrCreatePermissionAccount(
          context,
          granteeAccount
        )
      : await PermissionClass.getPermissionAccount(context, granteeAccount);
    if (permission === undefined) {
      throw new Error(
        `no payer provided and no existing permission account found for ${granteeAccount.publicKey}`
      );
    }

    if (!permission.authorityPublicKey.equals(granterAuthority.publicKey)) {
      throw new Error(
        `wrong authority provided to grant permission, expected ${permission.authorityPublicKey}, received ${granterAuthority.publicKey}`
      );
    }

    if (granteeAccount instanceof AggregatorAccount) {
      await permission.account.set({
        authority: granterAuthority,
        enable: true,
        permission: SwitchboardPermission.PERMIT_ORACLE_QUEUE_USAGE,
      });
      await permission.loadData();
      return permission;
    }
    if (granteeAccount instanceof OracleAccount) {
      await permission.account.set({
        authority: granterAuthority,
        enable: true,
        permission: SwitchboardPermission.PERMIT_ORACLE_HEARTBEAT,
      });
      await permission.loadData();
      return permission;
    }
    throw new Error(
      `permission grantee account isnt an aggregator or oracle account`
    );
  }

  static async getPermissionAccount(
    context: CommandContext,
    granteeAccount: OracleAccount | AggregatorAccount,
    oracleQueueAccount?: OracleQueueAccount
  ): Promise<PermissionClass | undefined> {
    let queueAccount = oracleQueueAccount;
    if (!queueAccount) {
      const data: AggregatorAccountData | OracleAccountData =
        await granteeAccount.loadData();
      queueAccount = new OracleQueueAccount({
        program: granteeAccount.program,
        publicKey: data.queuePubkey,
      });
    }

    const queueAuthority: anchor.web3.PublicKey =
      // eslint-disable-next-line unicorn/no-await-expression-member
      new PublicKey((await queueAccount.loadData()).authority);

    try {
      const [permissionAccount] = PermissionAccount.fromSeed(
        granteeAccount.program,
        queueAuthority,
        queueAccount.publicKey,
        granteeAccount.publicKey
      );
      await permissionAccount.loadData();
      context.logger.debug(
        `loaded permission account ${permissionAccount.publicKey} from seed for ${granteeAccount.publicKey}`
      );
      return await PermissionClass.init(context, permissionAccount);
    } catch {}
    context.logger.debug(
      `no permission account found for ${granteeAccount.publicKey}`
    );
  }

  static async getOrCreatePermissionAccount(
    context: CommandContext,
    granteeAccount: OracleAccount | AggregatorAccount,
    oracleQueueAccount?: OracleQueueAccount
  ): Promise<PermissionClass> {
    let queueAccount = oracleQueueAccount;
    if (!queueAccount) {
      const data: AggregatorAccountData | OracleAccountData =
        await granteeAccount.loadData();
      queueAccount = new OracleQueueAccount({
        program: granteeAccount.program,
        publicKey: data.queuePubkey,
      });
    }

    const queueAuthority: anchor.web3.PublicKey =
      // eslint-disable-next-line unicorn/no-await-expression-member
      new PublicKey((await queueAccount.loadData()).authority);

    try {
      const [permissionAccount] = PermissionAccount.fromSeed(
        granteeAccount.program,
        queueAuthority,
        queueAccount.publicKey,
        granteeAccount.publicKey
      );
      await permissionAccount.loadData();
      context.logger.debug(
        `loaded permission account ${permissionAccount.publicKey} from seed for ${granteeAccount.publicKey}`
      );
      return await PermissionClass.init(context, permissionAccount);
    } catch {
      try {
        const permissionAccount = await PermissionAccount.create(
          queueAccount.program,
          {
            authority: queueAuthority,
            grantee: granteeAccount.publicKey,
            granter: queueAccount.publicKey,
          }
        );
        await permissionAccount.loadData();
        context.logger.debug(
          `created new permission account ${permissionAccount.publicKey} for ${granteeAccount.publicKey}`
        );
        return PermissionClass.init(context, permissionAccount);
      } catch (error) {
        throw new Error(`failed to create permission account ${error.message}`);
      }
    }
  }

  // loads anchor idl and parses response
  async loadData() {
    const data: PermissionAccountData = await this.account.loadData();

    this.publicKey = this.account.publicKey;
    this.permission = toPermissionString(data.permissions);
    this.authorityPublicKey = data.authority;
    this.expiration = data.expiration;
    this.granterPublicKey = data.granter;
    this.granteePublicKey = data.grantee;
  }

  toJSON(): IPermissionClass {
    return {
      publicKey: this.account.publicKey,
      permission: this.permission,
      authorityPublicKey: this.authorityPublicKey,
      expiration: this.expiration,
      granterPublicKey: this.granterPublicKey,
      granteePublicKey: this.granteePublicKey,
    };
  }

  toString(): string {
    return JSON.stringify(this.toJSON(), pubKeyConverter, 2);
  }

  prettyPrint(all = false, SPACING = 24): string {
    let outputString = "";

    outputString += chalk.underline(
      chalkString("## Permission", this.publicKey, SPACING) + "\r\n"
    );
    outputString +=
      chalkString("authority", this.authorityPublicKey, SPACING) + "\r\n";
    outputString +=
      chalkString("permissions", this.permission, SPACING) + "\r\n";
    outputString +=
      chalkString("granter", this.granterPublicKey, SPACING) + "\r\n";
    outputString +=
      chalkString("grantee", this.granteePublicKey, SPACING) + "\r\n";
    outputString +=
      chalkString(
        "expiration",
        anchorBNtoDateTimeString(this.expiration),
        SPACING
      ) + "\r\n";

    return outputString;
  }
}
