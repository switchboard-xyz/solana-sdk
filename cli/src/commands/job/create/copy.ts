import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import { JobAccount } from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import * as fs from "fs";
import { JobClass, pubKeyConverter } from "../../../accounts";
import BaseCommand from "../../../BaseCommand";
import { OutputFileExistsNoForce } from "../../../types";
import { CHECK_ICON } from "../../../utils";

export default class JobCreateCopy extends BaseCommand {
  sourceJob: JobAccount;

  outputFile = "";

  static description = "copy a job account";

  static flags = {
    ...BaseCommand.flags,
    force: flags.boolean({ description: "skip job confirmation" }),
    outputFile: flags.string({
      char: "f",
      description: "output file to save job definition to",
    }),
  };

  static args = [
    {
      name: "jobSource",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the aggregator account to copy",
    },
  ];

  static examples = [
    "$ sbv2 job:create:copy 7pdb5RVM6cVBU8XDfpGqakb1S4wX2i5QsZxT117tK4HS --keypair ../payer-keypair.json",
  ];

  async init() {
    await super.init();
    const { args, flags } = this.parse(JobCreateCopy);

    this.sourceJob = new JobAccount({
      program: this.program,
      publicKey: args.jobSource,
    });

    if (flags.outputFile) {
      if (fs.existsSync(flags.outputFile) && !flags.force) {
        throw new OutputFileExistsNoForce(flags.outputFile);
      }
      this.outputFile = flags.outputFile;
    }
  }

  async run() {
    // create aggregator
    const job = await JobClass.fromCopyAccount(this.context, this.program, {
      sourcePublicKey: this.sourceJob.publicKey,
    });

    if (this.silent) {
      console.log(job.publicKey.toString());
    } else {
      this.logger.log(job.prettyPrint());

      this.logger.log(
        `${chalk.green(`${CHECK_ICON}Job account successfully copied`)}`
      );

      if (job.account.keypair) {
        this.context.fs.saveKeypair(job.account.keypair);
      }
    }

    if (this.outputFile) {
      fs.writeFileSync(
        this.outputFile,
        JSON.stringify(job, pubKeyConverter, 2)
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to copy job account");
  }
}
