import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import { AggregatorAccount } from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../../utils";

export default class AggregatorSetUpdateInterval extends BaseCommand {
  static description = "set an aggregator's minimum update delay";

  static flags = {
    ...BaseCommand.flags,
    authority: flags.string({
      char: "a",
      description: "alternate keypair that is the authority for the aggregator",
    }),
  };

  static args = [
    {
      name: "aggregatorKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the aggregator account",
    },
    {
      name: "updateInterval",
      required: true,
      parse: (newInterval: string) => Number.parseInt(newInterval, 10),
      description: "set an aggregator's minimum update delay",
    },
  ];

  static examples = [
    "$ sbv2 aggregator:set:updateInterval GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR 60 --keypair ../payer-keypair.json",
  ];

  async run() {
    const { args, flags } = this.parse(AggregatorSetUpdateInterval);
    verifyProgramHasPayer(this.program);

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: args.aggregatorKey,
    });
    const aggregator = await aggregatorAccount.loadData();

    if (aggregator.minUpdateDelaySeconds === args.updateInterval) {
      throw new Error(
        `Aggregator already has a minUpdateDelaySeconds of ${args.updateInterval}`
      );
    }

    if (args.updateInterval < 5) {
      throw new Error(
        `Update interval should be greater than 5 seconds, ${args.updateInterval}`
      );
    }

    const authority = await this.loadAuthority(
      flags.authority,
      aggregator.authority
    );

    const txn = await aggregatorAccount.setUpdateInterval({
      newInterval: args.updateInterval,
      authority,
    });

    if (this.silent) {
      console.log(txn);
    } else {
      this.logger.log(
        `${chalk.green(
          `${CHECK_ICON}Aggregator minimum update delay set successfully`
        )}`
      );
      this.logger.log(
        `https://explorer.solana.com/tx/${txn}?cluster=${this.cluster}`
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to set aggregator minimum update delay");
  }
}
