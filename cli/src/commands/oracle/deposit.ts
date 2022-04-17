import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  getPayer,
  OracleAccount,
  ProgramStateAccount,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import { chalkString } from "../../accounts/utils";
import BaseCommand from "../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../utils";

export default class OracleDeposit extends BaseCommand {
  static description = "deposit tokens into an oracle's token wallet";

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "oracleKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the oracle to deposit funds into",
    },
    {
      name: "amount",
      required: true,
      parse: (amount: string) => new anchor.BN(amount),
      description: "amount to deposit into oracle's token wallet",
    },
  ];

  static examples = [
    "$ sbv2 oracle:deposit 6kPsQoufdugtHLjM4fH7Z2fNv7jLt5pgvwKHt5JvRhQ6 2500 --keypair ../payer-keypair.json",
  ];

  async run() {
    verifyProgramHasPayer(this.program);
    const { args } = this.parse(OracleDeposit);

    const payer = getPayer(this.program);

    if (args.amount.lte(new anchor.BN(0))) {
      throw new Error("amount to deposit must be greater than 0");
    }

    const oracleAccount = new OracleAccount({
      program: this.program,
      publicKey: args.oracleKey,
    });
    const oracle = await oracleAccount.loadData();

    const [programStateAccount] = ProgramStateAccount.fromSeed(this.program);
    const switchboardMint = await programStateAccount.getTokenMint();

    const initialTokenBalance =
      await this.program.provider.connection.getTokenAccountBalance(
        oracle.tokenAccount
      );

    const payerTokenAccountInfo =
      await switchboardMint.getOrCreateAssociatedAccountInfo(payer.publicKey);
    const payerTokenBalanceResponse =
      await this.program.provider.connection.getTokenAccountBalance(
        payerTokenAccountInfo.address
      );
    const payerTokenBalance = new anchor.BN(
      payerTokenBalanceResponse.value.amount
    );

    if (args.amount.gt(payerTokenBalance)) {
      throw new Error(
        `deposit amount ${args.amount} must be less than current token balance ${payerTokenBalance}`
      );
    }

    const txn = await switchboardMint.transfer(
      payerTokenAccountInfo.address,
      oracle.tokenAccount,
      payer,
      [],
      (args.amount as anchor.BN).toNumber()
    );

    if (this.silent) {
      console.log(txn);
    } else {
      this.logger.log(
        `${chalk.green(
          `${CHECK_ICON}Deposited ${args.amount} tokens into oracle account`
        )}`
      );
      this.logger.log(`https://solscan.io/tx/${txn}?cluster=${this.cluster}`);
      const finalTokenBalance =
        await this.program.provider.connection.getTokenAccountBalance(
          oracle.tokenAccount
        );
      this.logger.log(
        chalkString(
          "New Oracle Token Balance",
          `${finalTokenBalance.value.amount} (${finalTokenBalance.value.uiAmountString})`
        )
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to deposit into oracle token account");
  }
}
