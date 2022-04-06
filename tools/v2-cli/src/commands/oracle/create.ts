import { flags } from "@oclif/command";
import { Keypair, PublicKey } from "@solana/web3.js";
import { OracleQueueAccount } from "@switchboard-xyz/switchboard-v2";
import * as chalk from "chalk";
import { OracleDefinition } from "../../accounts";
import { OracleClass } from "../../accounts/oracle/oracle";
import BaseCommand from "../../BaseCommand";
import {
  CHECK_ICON,
  getProgramPayer,
  loadKeypair,
  verifyProgramHasPayer,
} from "../../utils";

export default class OracleCreate extends BaseCommand {
  queueAccount: OracleQueueAccount;

  oracleDefinition: OracleDefinition;

  oracleAuthority?: Keypair | undefined = undefined;

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

  async init() {
    await super.init();
    verifyProgramHasPayer(this.program);

    const { args, flags } = this.parse(OracleCreate);

    this.queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: args.queueKey,
    });

    if (flags.authority) {
      this.oracleAuthority = await loadKeypair(flags.authority);
    }

    this.oracleDefinition = {
      name: flags.name || "",
      authorityKeypair: this.oracleAuthority ?? getProgramPayer(this.program),
    };
  }

  async run() {
    const oracle = await OracleClass.build(
      this.context,
      this.program,
      this.oracleDefinition,
      this.queueAccount
    );

    if (this.silent) {
      console.log(oracle.account.publicKey.toString());
    } else {
      this.logger.log(
        `${chalk.green(`${CHECK_ICON} Oracle account created successfully`)}`
      );
      this.logger.info(oracle.prettyPrint());
    }
  }

  async catch(error) {
    super.catch(error, "failed to create oracle account");
  }
}
