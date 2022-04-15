import { flags } from "@oclif/command";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  OracleAccount,
  OracleQueueAccount,
} from "@switchboard-xyz/switchboard-v2/src";
import chalk from "chalk";
import { PermissionClass } from "../../../accounts";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, getProgramPayer, loadKeypair } from "../../../utils";

export default class QueuePermitOracle extends BaseCommand {
  queueAuthority: Keypair;

  queueAccount: OracleQueueAccount;

  oracleAccount: OracleAccount;

  static description = "permit an oracle to heartbeat on a queue";

  static flags = {
    ...BaseCommand.flags,
    authority: flags.string({
      char: "a",
      description: "alternate keypair that is the authority for oracle queue",
    }),
  };

  static args = [
    {
      name: "oracleKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description:
        "public key of the oracle account to authorize oracle queue usage",
    },
  ];

  static examples = [
    "$ sbv2 queue:permit:oracle 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4 --keypair ../queue-authority.json",
  ];

  async init() {
    await super.init();
    const { args, flags } = this.parse(QueuePermitOracle);

    this.queueAuthority = flags.authority
      ? await loadKeypair(flags.authority)
      : getProgramPayer(this.program);

    this.queueAccount = new OracleQueueAccount({
      program: this.program,
      keypair: this.queueAuthority,
    });

    this.oracleAccount = new OracleAccount({
      program: this.program,
      publicKey: args.oracleKey,
    });
  }

  async run() {
    const permission = await PermissionClass.grantPermission(
      this.context,
      this.oracleAccount,
      this.queueAuthority
    );

    if (this.silent) {
      console.log(permission.publicKey.toString());
    } else {
      this.logger.log(
        `${chalk.green(`${CHECK_ICON}Oracle heartbeat permitted on queue`)}`
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to grant oracle permission to use a queue");
  }
}
