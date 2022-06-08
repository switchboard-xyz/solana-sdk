import { Flags } from "@oclif/core";
import { PublicKey } from "@solana/web3.js";
import {
  chalkString,
  prettyPrintAggregator,
} from "@switchboard-xyz/sbv2-utils";
import { AggregatorAccount } from "@switchboard-xyz/switchboard-v2";
import BaseCommand from "../../BaseCommand";

export default class AggregatorPrint extends BaseCommand {
  static description = "Print the deserialized Switchboard aggregator account";

  static aliases = ["aggregator:print"];

  static flags = {
    ...BaseCommand.flags,
    jobs: Flags.boolean({
      description: "output job definitions",
      default: false,
    }),
    oraclePubkeysData: Flags.boolean({
      char: "o",
      description: "print the assigned oracles for the current round",
    }),
  };

  static args = [
    {
      name: "aggregatorKey",
      description: "public key of the aggregator account to deserialize",
    },
  ];

  static examples = [
    "$ sbv2 aggregator:print GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR",
  ];

  async run() {
    const { args, flags } = await this.parse(AggregatorPrint);

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: new PublicKey(args.aggregatorKey),
    });
    const aggregator = await aggregatorAccount.loadData();

    this.logger.log(
      await prettyPrintAggregator(
        aggregatorAccount,
        aggregator,
        true,
        true,
        flags.jobs
      )
    );

    if (flags.oraclePubkeysData) {
      this.logger.log(
        chalkString(
          "oraclePubkeyData",
          "\n" +
            (aggregator.currentRound.oraclePubkeysData as PublicKey[])
              .filter((pubkey) => !PublicKey.default.equals(pubkey))
              .map((pubkey) => pubkey.toString())
              .join("\n")
        )
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to print aggregator account");
  }
}
