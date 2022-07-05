import { PublicKey } from "@solana/web3.js";
import { getOrCreateSwitchboardTokenAccount } from "@switchboard-xyz/sbv2-utils";
import {
  CrankAccount,
  OracleQueueAccount,
  ProgramStateAccount,
  programWallet,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import BaseCommand from "../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../utils";

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
      description: "public key of the crank to turn",
    },
  ];

  static examples = [
    "$ sbv2 crank:turn 85L2cFUvXaeGQ4HrzP8RJEVCL7WvRrXM2msvEmQ82AVr --keypair ../payer-keypair.json",
  ];

  async run() {
    const { args } = await this.parse(CrankTurn);
    verifyProgramHasPayer(this.program);
    const payer = programWallet(this.program);

    // load crank
    const crankAccount = new CrankAccount({
      program: this.program,
      publicKey: new PublicKey(args.crankKey),
    });
    const crank = await crankAccount.loadData();

    // load queue
    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: crank.queuePubkey,
    });
    const queue = await queueAccount.loadData();

    // load program state
    const [programStateAccount] = ProgramStateAccount.fromSeed(this.program);
    const progamState = await programStateAccount.loadData();

    // get payer payout wallet
    const mint = await programStateAccount.getTokenMint();
    const payoutTokenAddress = await getOrCreateSwitchboardTokenAccount(
      this.program,
      mint,
      payer
    );

    const txn = await crankAccount.pop({
      payoutWallet: payoutTokenAddress,
      queuePubkey: queueAccount.publicKey,
      queueAuthority: queue.authority,
      crank: 0,
      queue: 0,
      tokenMint: progamState.tokenMintPublicKey,
    });

    if (this.silent) {
      console.log(txn);
    } else {
      this.logger.log(
        `${chalk.green(`${CHECK_ICON}Crank turned successfully`)}`
      );
      this.logger.log(
        `https://explorer.solana.com/tx/${txn}?cluster=${this.cluster}`
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to turn the crank");
  }
}
