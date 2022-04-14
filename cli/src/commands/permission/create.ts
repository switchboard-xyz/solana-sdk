import { PublicKey } from "@solana/web3.js";
import {
  OracleQueueAccount,
  PermissionAccount,
} from "@switchboard-xyz/switchboard-v2/src";
import * as chalk from "chalk";
import { PermissionClass } from "../../accounts";
import BaseCommand from "../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../utils";

export default class PermissionCreate extends BaseCommand {
  static description = "create a permission account";

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "granter",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the account granting permission",
    },
    {
      name: "grantee",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the account getting permissions",
    },
  ];

  async run() {
    const { args } = this.parse(PermissionCreate);
    verifyProgramHasPayer(this.program);

    // assuming granter is an oracle queue, will need to fix
    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: args.granter,
    });
    const queue = await queueAccount.loadData();

    // Check if permission account already exists
    let permissionAccount: PermissionAccount;
    try {
      [permissionAccount] = PermissionAccount.fromSeed(
        this.program,
        queue.authority,
        args.granter,
        args.grantee
      );
      const permData = await permissionAccount.loadData();
      if (!this.silent) {
        this.logger.log(
          `Permission Account already existed ${permissionAccount.publicKey}`
        );
      }
    } catch {
      permissionAccount = await PermissionAccount.create(this.program, {
        granter: args.granter,
        grantee: args.grantee,
        authority: queue.authority,
      });
    }

    if (this.silent) {
      console.log(permissionAccount.publicKey.toString());
    } else {
      this.logger.log(
        `\r\n${chalk.green(
          `${CHECK_ICON}Permission account created successfully`
        )}`
      );
      const permission = await PermissionClass.fromPublicKey(
        this.context,
        this.program,
        permissionAccount.publicKey
      );
      const printStr = permission.prettyPrint();
      this.logger.log(printStr);
    }
  }

  async catch(error) {
    super.catch(error, "failed to create permission account");
  }
}
