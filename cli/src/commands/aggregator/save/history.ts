import { PublicKey } from "@solana/web3.js";
import { AggregatorAccount } from "@switchboard-xyz/switchboard-v2";
import OutputFileBaseCommand from "../../../OutputFileBaseCommand";

export default class AggregatorUpdate extends OutputFileBaseCommand {
  static description = "request a new aggregator result from a set of oracles";

  static flags = {
    ...OutputFileBaseCommand.flags,
  };

  static args = [
    {
      name: "aggregatorKey",
      description: "public key of the aggregator account to deserialize",
    },
  ];

  static examples = [
    "$ sbv2 aggregator:save:history --outputFile ../aggregator-history.json --csv",
  ];

  async run() {
    const { args, flags } = await this.parse(AggregatorUpdate);

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: new PublicKey(args.aggregatorKey),
    });
    const aggregator = await aggregatorAccount.loadData();

    const history = await aggregatorAccount.loadHistory();

    this.save(
      history.map((r) => {
        return {
          timestamp: Number.parseInt(r.timestamp.toString(10)),
          datetime: `"${new Date(
            r.timestamp.toNumber() * 1000
          ).toUTCString()}"`,
          value: r.value,
        };
      }),
      ["timestamp", "datetime", "value"]
    );

    if (this.silent) {
      return;
    } else {
      this.logger.log(`Files saved`);
    }
  }

  async catch(error) {
    // if (
    //   error instanceof AggregatorIllegalRoundOpenCall ||
    //   error.toString().includes("0x177d")
    // ) {
    //   this.context.logger.info(error.toString());
    //   this.exit(0);
    // }

    super.catch(error, "failed to save aggregator history");
  }
}
