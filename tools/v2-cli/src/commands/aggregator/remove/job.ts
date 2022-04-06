import { flags } from "@oclif/command";
import { Keypair, PublicKey } from "@solana/web3.js";
import { AggregatorAccount, JobAccount } from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import fs from "fs";
import { AggregatorClass } from "../../../accounts";
import BaseCommand from "../../../BaseCommand";
import { OutputFileExistsNoForce } from "../../../types";
import { CHECK_ICON, loadKeypair } from "../../../utils";

export default class AggregatorRemoveJob extends BaseCommand {
  aggregatorAuthority?: Keypair | undefined = undefined;

  aggregatorAccount: AggregatorAccount;

  jobAccount?: JobAccount;

  outputFile = "";

  static description = "remove a switchboard job account from an aggregator";

  static flags = {
    ...BaseCommand.flags,
    force: flags.boolean({
      description: "overwrite outputFile if existing",
    }),
    outputFile: flags.string({
      char: "f",
      description: "output file to save aggregator definition to",
    }),
    aggregatorAuthority: flags.string({
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

  async init() {
    await super.init();
    const { args, flags } = this.parse(AggregatorRemoveJob);

    if (flags.aggregatorAuthority) {
      this.aggregatorAuthority = await loadKeypair(flags.aggregatorAuthority);
      this.context.logger.debug(
        `using aggregator authority ${this.aggregatorAuthority.publicKey}`
      );
    }

    this.aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: args.aggregatorKey,
    });

    this.jobAccount = new JobAccount({
      program: this.program,
      publicKey: new PublicKey(args.jobKey),
    });

    if (flags.outputFile) {
      if (fs.existsSync(flags.outputFile) && !flags.force) {
        throw new OutputFileExistsNoForce(flags.outputFile);
      }
      this.outputFile = flags.outputFile;
    }
  }

  async run() {
    const txn = await this.aggregatorAccount.removeJob(
      this.jobAccount,
      this.aggregatorAuthority
    );
    const aggregator = await AggregatorClass.fromAccount(
      this.context,
      this.aggregatorAccount
    );

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

    if (this.outputFile) {
      this.context.fs.saveAccount(this.outputFile, aggregator);
    }
  }

  async catch(error) {
    super.catch(error, "failed to remove job to aggregator account");
  }
}
