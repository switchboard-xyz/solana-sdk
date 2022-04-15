import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import {
  OracleAccount,
  OracleQueueAccount,
} from "@switchboard-xyz/switchboard-v2/src";
import chalk from "chalk";
import { chalkString } from "../../accounts";
import BaseCommand from "../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../utils";

export default class OracleCreate extends BaseCommand {
  static description = "create a new oracle account for a given queue";

  static flags = {
    ...BaseCommand.flags,
    name: flags.string({
      char: "n",
      description: "name of the oracle for easier identification",
      default: "",
    }),
    authority: flags.string({
      char: "a",
      description:
        "keypair to delegate authority to for managing the oracle account",
    }),
  };

  static args = [
    {
      name: "queueKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the oracle queue to join",
    },
  ];

  static examples = [
    "$ sbv2 oracle:create GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U --keypair ../payer-and-authority-keypair.json",
    "$ sbv2 oracle:create GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U --name=oracle-1  --keypair ../payer-and-authority-keypair.json",
    "$ sbv2 oracle:create GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U --keypair ../payer-keypair.json --authority ../oracle-keypair.json",
  ];

  async run() {
    const { args, flags } = this.parse(OracleCreate);
    verifyProgramHasPayer(this.program);

    const authority = await this.loadAuthority(flags.authority);

    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: args.queueKey,
    });

    const oracleAccount = await OracleAccount.create(this.program, {
      name: Buffer.from(flags.name ?? ""),
      oracleAuthority: authority,
      queueAccount,
    });
    const oracle = await oracleAccount.loadData();

    if (this.silent) {
      console.log(oracleAccount.publicKey.toString());
    } else {
      this.logger.log(
        `${chalk.green(`${CHECK_ICON}Oracle account created successfully`)}`
      );
      this.logger.info(
        chalkString("Created Oracle", oracleAccount.publicKey.toString())
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to create oracle account");
  }
}
