import { PublicKey } from "@solana/web3.js";
import { anchorBNtoDateTimeString, chalkString } from "../../../accounts";
import { AggregatorClass } from "../../../accounts/aggregator/aggregator";
import BaseCommand from "../../../BaseCommand";

export default class AggregatorHistoryPrint extends BaseCommand {
  static description =
    "Print the history buffer associated with an aggregator account";

  static aliases = ["aggregator:history:print"];

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
    "$ sbv2 aggregator:history:print 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4",
  ];

  async run() {
    const { args } = this.parse(AggregatorHistoryPrint);

    const aggregator = await AggregatorClass.fromPublicKey(
      this.context,
      this.program,
      args.aggregatorKey
    );

    this.logger.log(aggregator.permissionAccount.prettyPrint());

    const history = await aggregator.account.loadHistory();
    this.logger.info(chalkString("## History", history.length));
    for (const row of history)
      this.logger.info(
        chalkString(anchorBNtoDateTimeString(row.timestamp), row.value)
      );
  }

  async catch(error) {
    super.catch(error, "failed to print aggregator permission account");
  }
}
