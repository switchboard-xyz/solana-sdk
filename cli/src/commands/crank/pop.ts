import { PublicKey } from "@solana/web3.js";
import { getOrCreateSwitchboardTokenAccount } from "@switchboard-xyz/sbv2-utils";
import {
  CrankAccount,
  OracleQueueAccount,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import BaseCommand from "../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../utils";

export default class CrankPop extends BaseCommand {
  static description = "pop the crank";

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "crankKey",
      description: "public key of the crank",
    },
  ];

  async run() {
    const { args } = await this.parse(CrankPop);
    verifyProgramHasPayer(this.program);

    const crankAccount = new CrankAccount({
      program: this.program,
      publicKey: new PublicKey(args.crankKey),
    });
    const crank = await crankAccount.loadData();

    const oracleQueueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: crank.queuePubkey,
    });
    const queue = await oracleQueueAccount.loadData();

    const mint = await oracleQueueAccount.loadMint();

    const payoutWallet = await getOrCreateSwitchboardTokenAccount(
      this.program,
      mint
    );

    const txn = await crankAccount.pop({
      payoutWallet,
      queuePubkey: oracleQueueAccount.publicKey,
      queueAuthority: queue.authority,
      crank,
      queue,
      tokenMint: mint.address,
    });

    if (this.silent) {
      console.log(txn);
    } else {
      this.logger.log(`${chalk.green(`${CHECK_ICON}Crank pop successful`)}`);
      this.logger.log(
        `https://explorer.solana.com/tx/${txn}?cluster=${this.cluster}`
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to pop the crank");
  }
}
