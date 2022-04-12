import { PublicKey } from "@solana/web3.js";
import {
  AggregatorAccount,
  CrankAccount,
} from "@switchboard-xyz/switchboard-v2";
import * as chalk from "chalk";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../../utils";

export default class AggregatorAddCrank extends BaseCommand {
  static description = "add the aggregator to a crank";

  static aliases = ["crank:push", "crank:add:aggregator"];

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "aggregatorKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the aggregator to add to a crank",
    },
    {
      name: "crankKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the crank to add aggregator to",
    },
  ];

  static examples = [
    "$ sbv2 aggregator:add:crank --keypair ../payer-keypair.json",
  ];

  async run() {
    const { args } = this.parse(AggregatorAddCrank);
    verifyProgramHasPayer(this.program);

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: args.aggregatorKey,
    });

    const crankAccount = new CrankAccount({
      program: this.program,
      publicKey: args.crankKey,
    });

    const txn = await crankAccount.push({ aggregatorAccount });

    if (this.silent) {
      console.log(txn);
    } else {
      this.logger.log(
        `\r\n${chalk.green(
          `${CHECK_ICON}Aggregator added to crank successfully`
        )}`
      );
      this.logger.log(`https://solscan.io/tx/${txn}?cluster=${this.cluster}`);
    }
  }

  async catch(error) {
    super.catch(error, "failed to add aggregator to crank");
  }
}
