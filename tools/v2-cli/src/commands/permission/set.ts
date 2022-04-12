import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import { PermissionAccount } from "@switchboard-xyz/switchboard-v2";
import { loadSwitchboardAccount } from "@switchboard-xyz/v2-utils-ts";
import * as chalk from "chalk";
import BaseCommand from "../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../utils";

export default class PermissionSet extends BaseCommand {
  static description = "permit a grantee to use a granters resources";

  static flags = {
    ...BaseCommand.flags,
    authority: flags.string({
      char: "a",
      description: "alternate keypair that is the granters authority",
    }),
    disable: flags.boolean({
      description: "disable permissions",
    }),
  };

  static args = [
    {
      name: "permissionKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the permission account",
    },
  ];

  async run() {
    const { args, flags } = this.parse(PermissionSet);
    verifyProgramHasPayer(this.program);

    const permissionAccount = new PermissionAccount({
      program: this.program,
      publicKey: args.permissionKey,
    });
    const permission = await permissionAccount.loadData();

    const grantee = await loadSwitchboardAccount(
      this.program,
      permission.grantee
    );

    // check and load granters account type

    // check and load grantees account type, and assign permissions based on type

    if (this.silent) {
      console.log(permission.publicKey.toString());
    } else {
      this.logger.log(
        `${chalk.green(`${CHECK_ICON}Permissions set successfully`)}`
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to set permissions");
  }
}
