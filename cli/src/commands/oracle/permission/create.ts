import { PublicKey } from "@solana/web3.js";
import { prettyPrintPermissions } from "@switchboard-xyz/sbv2-utils";
import {
  OracleAccount,
  OracleQueueAccount,
  PermissionAccount,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../../utils";

export default class OraclePermissionCreate extends BaseCommand {
  static description = "create a permission account for an oracle";

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "oracleKey",
      description: "public key of the oracle account",
    },
  ];

  async run() {
    const { args } = await this.parse(OraclePermissionCreate);
    verifyProgramHasPayer(this.program);

    const oracleAccount = new OracleAccount({
      program: this.program,
      publicKey: new PublicKey(args.oracleKey),
    });
    const oracle = await oracleAccount.loadData();

    // assuming granter is an oracle queue, will need to fix
    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: oracle.queuePubkey,
    });
    const queue = await queueAccount.loadData();

    // Check if permission account already exists
    let permissionAccount: PermissionAccount;
    try {
      [permissionAccount] = PermissionAccount.fromSeed(
        this.program,
        queue.authority,
        queueAccount.publicKey,
        oracleAccount.publicKey
      );
      const permData = await permissionAccount.loadData();
      if (!this.silent) {
        this.logger.log(
          `Permission Account already existed ${permissionAccount.publicKey}`
        );
      }
    } catch {
      permissionAccount = await PermissionAccount.create(this.program, {
        granter: queueAccount.publicKey,
        grantee: oracleAccount.publicKey,
        authority: queue.authority,
      });
    }

    if (this.silent) {
      console.log(permissionAccount.publicKey.toString());
    } else {
      this.logger.log(
        `${chalk.green(`${CHECK_ICON}Permission account created successfully`)}`
      );
      this.logger.log(await prettyPrintPermissions(permissionAccount));
    }
  }

  async catch(error) {
    super.catch(error, "failed to create permission account for oracle");
  }
}
