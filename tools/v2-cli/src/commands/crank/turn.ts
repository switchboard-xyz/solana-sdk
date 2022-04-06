import { PublicKey } from "@solana/web3.js";
import { CrankAccount } from "@switchboard-xyz/switchboard-v2";
import * as chalk from "chalk";
import { CrankClass } from "../../accounts/crank/crank";
import BaseCommand from "../../BaseCommand";
import { CHECK_ICON } from "../../utils";

export default class CrankTurn extends BaseCommand {
  crankAccount: CrankAccount;

  static description =
    "turn the crank and get rewarded if aggregator updates available";

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "crankKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the crank to turn",
    },
  ];

  static examples = [
    "$ sbv2 crank:turn 85L2cFUvXaeGQ4HrzP8RJEVCL7WvRrXM2msvEmQ82AVr --keypair ../payer-keypair.json",
  ];

  async init() {
    await super.init();
    const { args } = this.parse(CrankTurn);

    this.crankAccount = new CrankAccount({
      program: this.program,
      publicKey: args.crankKey,
    });
  }

  async run() {
    const popTxn = await CrankClass.turn(this.crankAccount);

    if (this.silent) {
      console.log(popTxn);
    } else {
      this.logger.log(
        `\r\n${chalk.green(`${CHECK_ICON}Crank turned successfully`)}`
      );
      this.logger.log(
        `https://solscan.io/tx/${popTxn}?cluster=${this.cluster}`
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to turn the crank");
  }
}
