import { PublicKey } from "@solana/web3.js";
import { prettyPrintPermissions } from "@switchboard-xyz/sbv2-utils";
import {
  OracleQueueAccount,
  PermissionAccount,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
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
      description: "public key of the account granting permission",
    },
    {
      name: "grantee",
      description: "public key of the account getting permissions",
    },
  ];

  async run() {
    const { args } = await this.parse(PermissionCreate);
    verifyProgramHasPayer(this.program);

    const granter = new PublicKey(args.granter);
    const grantee = new PublicKey(args.grantee);

    // assuming granter is an oracle queue, will need to fix
    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: granter,
    });
    const queue = await queueAccount.loadData();

    // Check if permission account already exists
    let permissionAccount: PermissionAccount;
    try {
      [permissionAccount] = PermissionAccount.fromSeed(
        this.program,
        queue.authority,
        granter,
        grantee
      );
      const permData = await permissionAccount.loadData();
      if (!this.silent) {
        this.logger.log(
          `Permission Account already existed ${permissionAccount.publicKey}`
        );
      }
    } catch {
      permissionAccount = await PermissionAccount.create(this.program, {
        granter: granter,
        grantee: grantee,
        authority: queue.authority,
      });
    }

    if (this.silent) {
      console.log(permissionAccount.publicKey.toString());
    } else {
      this.logger.log(
        `${chalk.green(`${CHECK_ICON}Permission account created successfully`)}`
      );
      console.log(await prettyPrintPermissions(permissionAccount));
    }
  }

  async catch(error) {
    super.catch(error, "failed to create permission account");
  }
}
