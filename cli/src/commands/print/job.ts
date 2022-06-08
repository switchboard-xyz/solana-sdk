import { PublicKey } from "@solana/web3.js";
import { prettyPrintJob } from "@switchboard-xyz/sbv2-utils";
import { JobAccount } from "@switchboard-xyz/switchboard-v2";
import BaseCommand from "../../BaseCommand";

export default class JobPrint extends BaseCommand {
  outputFile?: string;

  static description = "Print the deserialized Switchboard job account";

  static aliases = ["job:print"];

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "jobKey",
      description: "public key of the job account to deserialize",
    },
  ];

  static examples = [
    "$ sbv2 job:print SzTvFZLz3hwjZFMwVWzuEnr1oUF6qyvXwXCvsqf7qeA",
  ];

  async run() {
    const { args, flags } = await this.parse(JobPrint);

    const jobAccount = new JobAccount({
      program: this.program,
      publicKey: new PublicKey(args.jobKey),
    });

    this.logger.log(await prettyPrintJob(jobAccount));
  }

  async catch(error) {
    super.catch(error, "failed to print job account");
  }
}
