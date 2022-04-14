import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import * as fs from "fs";
import { JobClass } from "../../accounts";
import BaseCommand from "../../BaseCommand";
import { OutputFileExistsNoForce } from "../../types";

export default class JobPrint extends BaseCommand {
  outputFile?: string;

  static description = "Print the deserialized Switchboard job account";

  static aliases = ["job:print"];

  static flags = {
    ...BaseCommand.flags,
    force: flags.boolean({
      description: "overwrite outputFile if existing",
    }),
    outputFile: flags.string({
      char: "f",
      description: "output queue json file",
    }),
  };

  static args = [
    {
      name: "jobKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the job account to deserialize",
    },
  ];

  static examples = [
    "$ sbv2 job:print SzTvFZLz3hwjZFMwVWzuEnr1oUF6qyvXwXCvsqf7qeA",
  ];

  async run() {
    const { args, flags } = this.parse(JobPrint);

    if (flags.outputFile) {
      if (fs.existsSync(flags.outputFile) && !flags.force) {
        throw new OutputFileExistsNoForce(flags.outputFile);
      }
      this.outputFile = flags.outputFile;
    }

    const job = await JobClass.fromPublicKey(
      this.context,
      this.program,
      args.jobKey
    );

    this.logger.log(job.prettyPrint(true));

    if (this.outputFile) {
      this.context.fs.saveAccount(this.outputFile, job);
    }
  }

  async catch(error) {
    super.catch(error, "failed to print job account");
  }
}
