import { PublicKey } from "@solana/web3.js";
import { prettyPrintPermissions } from "@switchboard-xyz/sbv2-utils";
import {
  OracleAccount,
  OracleQueueAccount,
  PermissionAccount,
} from "@switchboard-xyz/switchboard-v2";
import BaseCommand from "../../../BaseCommand";

export default class OraclePermissionPrint extends BaseCommand {
  static description =
    "Print the permission account associated with a Switchboard oracle account";

  static aliases = ["oracle:permission:print", "oracle:print:permission"];

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "oracleKey",
      description:
        "public key of the oracle account to fetch permission account and deserialize",
    },
  ];

  static examples = [
    "$ sbv2 oracle:permission:print 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4",
  ];

  async run() {
    const { args } = await this.parse(OraclePermissionPrint);

    const oracleAccount = new OracleAccount({
      program: this.program,
      publicKey: new PublicKey(args.oracleKey),
    });
    const oracle = await oracleAccount.loadData();

    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: oracle.queuePubkey,
    });
    const queue = await queueAccount.loadData();

    const [permissionAccount] = PermissionAccount.fromSeed(
      this.program,
      queue.authority,
      queueAccount.publicKey,
      oracleAccount.publicKey
    );

    try {
      const permission = await permissionAccount.loadData();
      this.logger.log(
        await prettyPrintPermissions(permissionAccount, permission)
      );
    } catch {
      this.logger.error(`failed to find a permission account`);
    }
  }

  async catch(error) {
    super.catch(error, "failed to print oracle permission account");
  }
}
