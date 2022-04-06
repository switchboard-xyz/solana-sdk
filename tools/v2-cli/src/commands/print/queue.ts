import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import { OracleQueueAccount } from "@switchboard-xyz/switchboard-v2";
import fs from "fs";
import { OracleQueueClass } from "../../accounts";
import BaseCommand from "../../BaseCommand";
import { OutputFileExistsNoForce } from "../../types";

export default class QueuePrint extends BaseCommand {
  outputFile?: string;

  static description = "Print the deserialized Switchboard oraclequeue account";

  static aliases = ["queue:print"];

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
      name: "queueKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the oracle queue account to deserialize",
    },
  ];

  static examples = [
    "$ sbv2 queue:print GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U",
  ];

  async run() {
    const { args, flags } = this.parse(QueuePrint);

    if (flags.outputFile) {
      if (fs.existsSync(flags.outputFile) && !flags.force) {
        throw new OutputFileExistsNoForce(flags.outputFile);
      }
      this.outputFile = flags.outputFile;
    }

    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: args.queueKey,
    });

    const queue = await OracleQueueClass.fromAccount(
      this.context,
      queueAccount
    );

    this.logger.log(queue.prettyPrint(true));

    if (this.outputFile) {
      this.context.fs.saveAccount(this.outputFile, queue);
    }
  }

  async catch(error) {
    super.catch(error, "failed to print oracle queue account");
  }
}
