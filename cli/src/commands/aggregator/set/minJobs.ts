import { Flags } from "@oclif/core";
import { PublicKey } from "@solana/web3.js";
import { verifyProgramHasPayer } from "@switchboard-xyz/sbv2-utils";
import { AggregatorAccount } from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON } from "../../../utils";

export default class AggregatorSetMinJobResults extends BaseCommand {
  static description =
    "set an aggregator's minimum number of jobs before an oracle responds";

  static flags = {
    ...BaseCommand.flags,
    authority: Flags.string({
      char: "a",
      description: "alternate keypair that is the authority for the aggregator",
    }),
  };

  static args = [
    {
      name: "aggregatorKey",
      description: "public key of the aggregator account",
    },
    {
      name: "minJobResults",
      description: "number of jobs that must respond before an oracle responds",
    },
  ];

  //   static examples = ["$ sbv2 aggregator:set:authority"];

  async run() {
    const { args, flags } = await this.parse(AggregatorSetMinJobResults);
    verifyProgramHasPayer(this.program);

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: new PublicKey(args.aggregatorKey),
    });
    const aggregator = await aggregatorAccount.loadData();
    const authority = await this.loadAuthority(
      flags.authority,
      aggregator.authority
    );

    const minJobResults = Number.parseInt(args.minJobResults, 10);
    if (minJobResults <= 0 || minJobResults > 16) {
      throw new Error(`Invalid min job size (1 - 16), ${minJobResults}`);
    }

    if (minJobResults > aggregator.jobPubkeysSize) {
      throw new Error(
        `Min jobs ${minJobResults} is greater than current number of jobs ${aggregator.jobPubkeysSize} `
      );
    }

    const txn = await aggregatorAccount.setMinJobs({
      authority,
      minJobResults,
    });

    if (this.silent) {
      console.log(txn);
    } else {
      this.logger.log(
        `${chalk.green(`${CHECK_ICON}Aggregator min job set successfully`)}`
      );
      this.logger.log(
        `https://explorer.solana.com/tx/${txn}?cluster=${this.cluster}`
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to set aggregator min jobs");
  }
}
