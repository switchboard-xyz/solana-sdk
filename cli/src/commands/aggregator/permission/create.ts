import { PublicKey } from "@solana/web3.js";
import { prettyPrintPermissions } from "@switchboard-xyz/sbv2-utils";
import {
  AggregatorAccount,
  OracleQueueAccount,
  PermissionAccount,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../../utils";

export default class AggregatorPermissionCreate extends BaseCommand {
  static description = "create a permission account for an aggregator";

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "aggregatorKey",
      description: "public key of the aggregator account",
    },
  ];

  async run() {
    const { args } = await this.parse(AggregatorPermissionCreate);
    verifyProgramHasPayer(this.program);

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: new PublicKey(args.aggregatorKey),
    });
    const aggregator = await aggregatorAccount.loadData();

    // assuming granter is an oracle queue, will need to fix
    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: aggregator.queuePubkey,
    });
    const queue = await queueAccount.loadData();

    // Check if permission account already exists
    let permissionAccount: PermissionAccount;
    try {
      [permissionAccount] = PermissionAccount.fromSeed(
        this.program,
        queue.authority,
        queueAccount.publicKey,
        aggregatorAccount.publicKey
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
        grantee: aggregatorAccount.publicKey,
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
    super.catch(error, "failed to create permission account for aggregator");
  }
}
