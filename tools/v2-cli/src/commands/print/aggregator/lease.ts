import { PublicKey } from "@solana/web3.js";
import chalk from "chalk";
import { AggregatorClass } from "../../../accounts";
import BaseCommand from "../../../BaseCommand";

export default class AggregatorLeasePrint extends BaseCommand {
  static description =
    "Print the lease account associated with a Switchboard aggregator account";

  static aliases = ["aggregator:lease:print"];

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
    "$ sbv2 aggregator:lease:print 8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee",
  ];

  async run() {
    const { args } = this.parse(AggregatorLeasePrint);

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

    if (!aggregator.leaseAccount) {
      throw new Error(
        `failed to find lease account for aggregator ${aggregator.publicKey}`
      );
    }

    this.logger.log(aggregator.leaseAccount.prettyPrint());
  }

  async catch(error) {
    super.catch(error, "failed to print lease account");
  }
}
