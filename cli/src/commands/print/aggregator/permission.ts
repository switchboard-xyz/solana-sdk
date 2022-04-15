import { PublicKey } from "@solana/web3.js";
import chalk from "chalk";
import { AggregatorClass } from "../../../accounts/aggregator/aggregator";
import BaseCommand from "../../../BaseCommand";

export default class AggregatorPermissionPrint extends BaseCommand {
  static description =
    "Print the permission account associated with a Switchboard aggregator account";

  static aliases = ["aggregator:permission:print"];

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "aggregatorKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description:
        "public key of the aggregator account to fetch permission account and deserialize",
    },
  ];

  static examples = [
    "$ sbv2 aggregator:permission:print 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4",
  ];

  async run() {
    const { args } = this.parse(AggregatorPermissionPrint);

    const aggregator = await AggregatorClass.fromPublicKey(
      this.context,
      this.program,
      args.aggregatorKey
    );

    this.logger.debug(
      `${chalk.yellow("aggregator:")} ${chalk.blue(
        aggregator.publicKey.toString()
      )}`
    );

    if (!aggregator.permissionAccount) {
      throw new Error(
        `failed to find permission account for aggregator ${aggregator.publicKey}`
      );
    }

    this.logger.log(aggregator.permissionAccount.prettyPrint());
  }

  async catch(error) {
    super.catch(error, "failed to print aggregator permission account");
  }
}
