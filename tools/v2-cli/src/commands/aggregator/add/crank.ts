import { PublicKey } from "@solana/web3.js";
import {
  AggregatorAccount,
  CrankAccount,
} from "@switchboard-xyz/switchboard-v2";
import * as chalk from "chalk";
import { AggregatorClass, CrankClass } from "../../../accounts";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../../utils";

export default class AggregatorAddCrank extends BaseCommand {
  aggregatorAccount: AggregatorAccount;
  crankAccount: CrankAccount;

  static description = "add the aggregator to a crank";

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

  async init() {
    await super.init();
    verifyProgramHasPayer(this.program);

    const { args } = this.parse(AggregatorAddCrank);

    this.aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: args.aggregatorKey,
    });

    this.crankAccount = new CrankAccount({
      program: this.program,
      publicKey: args.crankKey,
    });
  }

  async run() {
    const aggregator = await AggregatorClass.fromAccount(
      this.context,
      this.aggregatorAccount
    );
    const crank = await CrankClass.fromAccount(this.context, this.crankAccount);

    const pushTxn = await crank.push(aggregator);

    if (this.silent) {
      console.log(pushTxn);
    } else {
      this.logger.log(
        `\r\n${chalk.green(
          `${CHECK_ICON}Aggregator added to crank successfully`
        )}`
      );
      this.logger.log(
        `https://solscan.io/tx/${pushTxn}?cluster=${this.cluster}`
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to add aggregator to crank");
  }
}
