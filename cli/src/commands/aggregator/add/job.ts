import { flags } from "@oclif/command";
import { Keypair, PublicKey } from "@solana/web3.js";
import { AggregatorAccount, JobAccount } from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import * as fs from "fs";
import {
  AggregatorClass,
  fromJobJSON,
  JobClass,
  pubKeyConverter,
  pubKeyReviver,
} from "../../../accounts";
import BaseCommand from "../../../BaseCommand";
import { OutputFileExistsNoForce } from "../../../types";
import { CHECK_ICON, loadKeypair } from "../../../utils";

export default class AggregatorAddJob extends BaseCommand {
  aggregatorAuthority?: Keypair | undefined = undefined;

  aggregatorAccount: AggregatorAccount;

  jobDefinition?: fromJobJSON = undefined;

  jobAccount?: JobAccount;

  outputFile = "";

  static description = "add a job account to an aggregator";

  static flags = {
    ...BaseCommand.flags,
    force: flags.boolean({
      description: "overwrite outputFile if existing",
    }),
    outputFile: flags.string({
      char: "f",
      description: "output file to save aggregator definition to",
    }),
    jobDefinition: flags.string({
      description: "filesystem path of job json definition file",
      exclusive: ["jobKey"],
    }),
    jobKey: flags.string({
      description:
        "public key of an existing job account to add to an aggregator",
      exclusive: ["jobDefinition"],
    }),
    aggregatorAuthority: flags.string({
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
  ];

  static examples = ["$ sbv2 aggregator:add:job"];

  async init() {
    await super.init();
    const { args, flags } = this.parse(AggregatorAddJob);

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

    if (flags.jobDefinition) {
      this.jobDefinition = JSON.parse(flags.jobDefinition, pubKeyReviver);
    }
    if (flags.jobKey) {
      this.jobAccount = new JobAccount({
        program: this.program,
        publicKey: new PublicKey(flags.jobKey),
      });
    }
    if (!this.jobDefinition && !this.jobAccount) {
      throw new Error("need to provide --jobDefinition or --jobKey");
    }

    if (flags.outputFile) {
      if (fs.existsSync(flags.outputFile) && !flags.force) {
        throw new OutputFileExistsNoForce(flags.outputFile);
      }
      this.outputFile = flags.outputFile;
    }
  }

  async run() {
    const job = this.jobAccount
      ? await JobClass.fromAccount(this.context, this.jobAccount)
      : await JobClass.build(this.context, this.program, this.jobDefinition);

    const txn = await this.aggregatorAccount.addJob(
      job.account,
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
          `${CHECK_ICON}Job succesfully added to aggregator account\r\n`
        )}`
      );
      this.logger.log(
        `https://explorer.solana.com/tx/${txn}?cluster=${this.cluster}`
      );
    }

    if (this.outputFile) {
      fs.writeFileSync(
        this.outputFile,
        JSON.stringify(aggregator, pubKeyConverter, 2)
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to add job to aggregator account");
  }
}
