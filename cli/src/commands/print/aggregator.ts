/* eslint-disable unicorn/import-style */
import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import * as fs from "fs";
import { AggregatorClass } from "../../accounts/aggregator/aggregator";
import BaseCommand from "../../BaseCommand";
import { OutputFileExistsNoForce } from "../../types";

export default class AggregatorPrint extends BaseCommand {
  outputFile?: string;

  static description = "Print the deserialized Switchboard aggregator account";

  static aliases = ["aggregator:print"];

  static flags = {
    ...BaseCommand.flags,
    force: flags.boolean({
      description: "overwrite outputFile if existing",
    }),
    outputFile: flags.string({
      char: "f",
      description: "output aggregator schema to json file",
    }),
  };

  static args = [
    {
      name: "aggregatorKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the aggregator account to deserialize",
    },
  ];

  static examples = [
    "$ sbv2 aggregator:print 8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee",
    "$ sbv2 aggregator:print 8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee -f btc-usd.json",
  ];

  async run() {
    const { args, flags } = this.parse(AggregatorPrint);

    if (flags.outputFile) {
      if (fs.existsSync(flags.outputFile) && !flags.force) {
        throw new OutputFileExistsNoForce(flags.outputFile);
      }
      this.outputFile = flags.outputFile;
    }

    const aggregator = await AggregatorClass.fromPublicKey(
      this.context,
      this.program,
      args.aggregatorKey
    );

    this.logger.log(aggregator.prettyPrint(true));
    // for (const job of aggregator.jobs) job.prettyPrint(true);

    // const data = await aggregator.account.loadData();
    // console.log(JSON.stringify(data));

    if (this.outputFile) {
      this.context.fs.saveAccount(this.outputFile, aggregator);
    }
  }

  async catch(error) {
    super.catch(error, "failed to print aggregator account");
  }
}
