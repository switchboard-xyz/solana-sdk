import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import { prettyPrintQueue } from "@switchboard-xyz/sbv2-utils";
import { OracleQueueAccount } from "@switchboard-xyz/switchboard-v2";
import BaseCommand from "../../BaseCommand";

export default class QueuePrint extends BaseCommand {
  outputFile?: string;

  static description = "Print the deserialized Switchboard oraclequeue account";

  static aliases = ["queue:print"];

  static flags = {
    ...BaseCommand.flags,
    oracles: flags.boolean({
      description: "output oracles that are heartbeating on the queue",
      default: false,
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

    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: args.queueKey,
    });
    const data = await queueAccount.loadData();

    this.logger.log(await prettyPrintQueue(queueAccount, data, flags.oracles));
  }

  async catch(error) {
    super.catch(error, "failed to print oracle queue account");
  }
}
