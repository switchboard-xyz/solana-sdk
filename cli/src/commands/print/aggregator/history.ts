import { PublicKey } from "@solana/web3.js";
import {
  anchorBNtoDateTimeString,
  chalkString,
} from "@switchboard-xyz/sbv2-utils";
import { AggregatorAccount } from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import BaseCommand from "../../../BaseCommand";

export default class AggregatorHistoryPrint extends BaseCommand {
  static description =
    "Print the history buffer associated with an aggregator account";

  static aliases = ["aggregator:history:print", "aggregator:print:history"];

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
    "$ sbv2 aggregator:print:history 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4",
  ];

  async run() {
    const { args } = await this.parse(AggregatorHistoryPrint);

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: new PublicKey(args.aggregatorKey),
    });
    const aggregator = await aggregatorAccount.loadData();

    const history = await aggregatorAccount.loadHistory();
    const historySize = history.length ?? 0;
    this.logger.info(
      chalk.underline(
        chalkString("## History", historySize.toString().padEnd(8), 24)
      )
    );
    for (const row of history)
      this.logger.info(
        chalkString(anchorBNtoDateTimeString(row.timestamp), row.value, 24)
      );
  }

  async catch(error) {
    super.catch(error, "failed to print aggregator history");
  }
}
