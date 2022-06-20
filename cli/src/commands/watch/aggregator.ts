import { PublicKey } from "@solana/web3.js";
import {
  anchorBNtoDateTimeString,
  buffer2string,
  chalkString,
} from "@switchboard-xyz/sbv2-utils";
import {
  AggregatorAccount,
  SwitchboardDecimal,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import BaseCommand from "../../BaseCommand";

export default class WatchAggregator extends BaseCommand {
  static description = "watch an aggregator for a new value";

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "aggregatorKey",
      description: "public key of the aggregator account to deserialize",
    },
  ];

  static aliases = ["aggregator:watch"];

  static examples = [
    "$ sbv2 watch:aggregator J7j9xX8JP2B2ErvUzuqGAKBGeggsxPyFXj5MqZcYDxfa",
  ];

  async run() {
    const { args } = await this.parse(WatchAggregator);

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: new PublicKey(args.aggregatorKey),
    });
    const aggregator = await aggregatorAccount.loadData();
    const name = buffer2string(aggregator.name) ?? "";

    this.logger.log(
      chalk.underline(
        chalkString(
          `## Aggregator${name ? " (" + name + ")" : ""}`,
          aggregatorAccount.publicKey,
          30
        ) + "\r\n"
      )
    );

    printAggregator(aggregator);

    const ws = aggregatorAccount.onChange((aggregator) => {
      printAggregator(aggregator);
    });
  }

  async catch(error) {
    super.catch(error, "failed to watch aggregator");
  }
}

function printAggregator(aggregator: any) {
  const result = SwitchboardDecimal.from(
    aggregator.latestConfirmedRound.result
  ).toBig();
  const timestamp = anchorBNtoDateTimeString(
    aggregator.latestConfirmedRound.roundOpenTimestamp
  );
  process.stdout.moveCursor(0, -1); // up one line
  process.stdout.clearLine(1); // from cursor to end
  process.stdout.write(chalkString(timestamp, result, 30) + "\r\n");
}
