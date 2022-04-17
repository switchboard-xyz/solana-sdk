import { flags } from "@oclif/command";
import { Keypair, PublicKey } from "@solana/web3.js";
import { OracleQueueAccount } from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import { fromCrankJSON } from "../../../accounts";
import { CrankClass } from "../../../accounts/crank/crank";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON } from "../../../utils";

export default class QueueAddCrank extends BaseCommand {
  queueAccount: OracleQueueAccount;

  crankDefinition: fromCrankJSON;

  queueAuthority: Keypair | undefined = undefined;

  static description = "add a crank to an existing oracle queue";

  static flags = {
    ...BaseCommand.flags,
    name: flags.string({
      char: "n",
      description: "name of the crank for easier identification",
    }),
    maxRows: flags.integer({
      char: "r",
      description: "maximum number of rows a crank can support",
    }),
    // authority: flags.string({
    //   char: "a",
    //   description: "alternate keypair that is the authority for oracle queue",
    // }),
  };

  static args = [
    {
      name: "queueKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the oracle queue to create a crank on",
    },
  ];

  static examples = [
    "$ sbv2 queue:add:crank 5aYuxRdcB9GpWrEXVMBQp2R5uf94uoBiFdMEBwcmHuU4 -k ../authority-keypair.json -n crank-1",
    // "$ sbv2 queue:add:crank 5aYuxRdcB9GpWrEXVMBQp2R5uf94uoBiFdMEBwcmHuU4 -k ../payer-keypair.json -a ../authority-keypair.json",
  ];

  async init() {
    await super.init();
    const { args, flags } = this.parse(QueueAddCrank);

    this.queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: args.queueKey,
    });

    // TODO: Not implemented yet
    // if (flags.authority) {
    //   this.queueAuthority = await loadKeypair(flags.authority);
    // }

    if (flags.maxRows < 0) {
      throw new Error("max rows must be a positive number");
    }

    this.crankDefinition = {
      name: flags.name || "",
      maxRows: flags.maxRows || undefined,
    };
  }

  async run() {
    const crank = await CrankClass.fromJSON(
      this.context,
      this.crankDefinition,
      this.queueAccount
    );

    if (this.silent) {
      console.log(crank.account.publicKey.toString());
    } else {
      this.logger.log(crank.prettyPrint());
      this.logger.log(
        `${chalk.green(`${CHECK_ICON}Crank created successfully\r\n`)}`
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to create crank");
  }
}
