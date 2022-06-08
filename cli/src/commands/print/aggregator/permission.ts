import { PublicKey } from "@solana/web3.js";
import { prettyPrintPermissions } from "@switchboard-xyz/sbv2-utils";
import {
  AggregatorAccount,
  OracleQueueAccount,
  PermissionAccount,
} from "@switchboard-xyz/switchboard-v2";
import BaseCommand from "../../../BaseCommand";

export default class AggregatorPermissionPrint extends BaseCommand {
  static description =
    "Print the permission account associated with a Switchboard aggregator account";

  static aliases = [
    "aggregator:permission:print",
    "aggregator:print:permission",
  ];

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "aggregatorKey",
      description:
        "public key of the aggregator account to fetch permission account and deserialize",
    },
  ];

  static examples = [
    "$ sbv2 aggregator:permission:print 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4",
  ];

  async run() {
    const { args } = await this.parse(AggregatorPermissionPrint);

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: new PublicKey(args.aggregatorKey),
    });
    const aggregator = await aggregatorAccount.loadData();

    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: aggregator.queuePubkey,
    });
    const queue = await queueAccount.loadData();

    const [permissionAccount] = PermissionAccount.fromSeed(
      this.program,
      queue.authority,
      queueAccount.publicKey,
      aggregatorAccount.publicKey
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
    super.catch(error, "failed to print aggregator permission account");
  }
}
