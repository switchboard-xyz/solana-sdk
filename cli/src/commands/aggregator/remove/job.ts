import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import {
  AggregatorAccount,
  JobAccount,
} from "@switchboard-xyz/switchboard-v2/src";
import chalk from "chalk";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../../utils";

export default class AggregatorRemoveJob extends BaseCommand {
  static description = "remove a switchboard job account from an aggregator";

  static flags = {
    ...BaseCommand.flags,
    force: flags.boolean({
      description: "overwrite outputFile if existing",
    }),
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
      name: "jobKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description:
        "public key of an existing job account to remove from an aggregator",
    },
  ];

  static examples = ["$ sbv2 aggregator:remove:job"];

  async run() {
    const { args, flags } = this.parse(AggregatorRemoveJob);
    verifyProgramHasPayer(this.program);

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: args.aggregatorKey,
    });
    const aggregator = await aggregatorAccount.loadData();
    const authority = await this.loadAuthority(
      flags.authority,
      aggregator.authority
    );

    const jobAccount = new JobAccount({
      program: this.program,
      publicKey: new PublicKey(args.jobKey),
    });

    const txn = await aggregatorAccount.removeJob(jobAccount, authority);

    if (this.silent) {
      console.log(txn);
    } else {
      this.logger.log(
        `${chalk.green(
          `${CHECK_ICON}Job succesfully removed from aggregator account\r\n`
        )}`
      );
      this.logger.log(`https://solscan.io/tx/${txn}?cluster=${this.cluster}`);
    }
  }

  async catch(error) {
    super.catch(error, "failed to remove job to aggregator account");
  }
}
