import { PublicKey } from "@solana/web3.js";
import {
  prettyPrintOracle,
  prettyPrintPermissions,
} from "@switchboard-xyz/sbv2-utils";
import {
  OracleAccount,
  PermissionAccount,
} from "@switchboard-xyz/switchboard-v2";
import BaseCommand from "../../BaseCommand";

export default class PermissionPrint extends BaseCommand {
  static description = "Print the deserialized Switchboard permission account";

  static aliases = ["permission:print"];

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "permissionKey",
      description: "public key of the permission account to deserialize",
    },
  ];

  static examples = [
    "$ sbv2 permission:print 94XXM72K2aKu2wcuJaawV8njuGaFZvhy8iKgPxoa1tJk",
  ];

  async run() {
    const { args, flags } = await this.parse(PermissionPrint);

    const permissionAccount = new PermissionAccount({
      program: this.program,
      publicKey: new PublicKey(args.permissionKey),
    });
    const data = await permissionAccount.loadData();

    this.logger.log(await prettyPrintPermissions(permissionAccount, data));
  }

  async catch(error) {
    super.catch(error, "failed to print permission account");
  }
}
