import { flags } from "@oclif/command";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  AggregatorAccount,
  OracleQueueAccount,
} from "@switchboard-xyz/switchboard-v2/src";
import * as chalk from "chalk";
import { PermissionClass } from "../../../accounts";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, getProgramPayer, loadKeypair } from "../../../utils";

export default class QueuePermitAggregator extends BaseCommand {
  queueAuthority: Keypair;

  queueAccount: OracleQueueAccount;

  aggregatorAccount: AggregatorAccount;

  static description =
    "permit an aggregator to use an oracle queue's resources";

  static flags = {
    ...BaseCommand.flags,
    authority: flags.string({
      char: "a",
      description: "alternate keypair that is the authority for oracle queue",
    }),
  };

  static args = [
    {
      name: "aggregatorKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description:
        "public key of the aggregator account to authorize oracle queue usage",
    },
  ];

  static examples = [
    "$ sbv2 queue:permit:aggregator 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4 --keypair ../queue-authority.json",
  ];

  async init() {
    await super.init();
    const { args, flags } = this.parse(QueuePermitAggregator);

    this.queueAuthority = flags.authority
      ? await loadKeypair(flags.authority)
      : getProgramPayer(this.program);

    this.queueAccount = new OracleQueueAccount({
      program: this.program,
      keypair: this.queueAuthority,
    });

    this.aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: args.aggregatorKey,
    });
  }

  async run() {
    const permission = await PermissionClass.grantPermission(
      this.context,
      this.aggregatorAccount,
      this.queueAuthority
    );

    if (this.silent) {
      console.log(permission.publicKey.toString());
    } else {
      this.logger.log(
        `${chalk.green(`${CHECK_ICON}Aggregator permitted on queue`)}`
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to grant aggregator permission to use a queue");
  }
}
