import { Flags } from "@oclif/core";
import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token-v2";
import { PublicKey } from "@solana/web3.js";
import {
  chalkString,
  getOrCreateSwitchboardTokenAccount,
} from "@switchboard-xyz/sbv2-utils";
import {
  OracleAccount,
  OracleQueueAccount,
  programWallet,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import BaseCommand from "../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../utils";

export default class OracleDeposit extends BaseCommand {
  static description = "deposit tokens into an oracle's token wallet";

  static flags = {
    ...BaseCommand.flags,
    amount: Flags.string({
      required: true,
      description:
        "token amount to load into the oracle escrow. If decimals provided, amount will be normalized to raw tokenAmount",
    }),
  };

  static args = [
    {
      name: "oracleKey",

      description: "public key of the oracle to deposit funds into",
    },
  ];

  static examples = [
    "$ sbv2 oracle:deposit 6kPsQoufdugtHLjM4fH7Z2fNv7jLt5pgvwKHt5JvRhQ6 2500 --keypair ../payer-keypair.json",
  ];

  async run() {
    verifyProgramHasPayer(this.program);
    const { args, flags } = await this.parse(OracleDeposit);

    const payer = programWallet(this.program);

    const amount = this.getTokenAmount(flags.amount);

    if (amount.lte(new anchor.BN(0))) {
      throw new Error("amount to deposit must be greater than 0");
    }

    const oracleAccount = new OracleAccount({
      program: this.program,
      publicKey: new PublicKey(args.oracleKey),
    });
    const oracle = await oracleAccount.loadData();

    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: oracle.queuePubkey,
    });

    const mint = await queueAccount.loadMint();

    const initialTokenBalance = new anchor.BN(
      (
        await this.program.provider.connection.getTokenAccountBalance(
          oracle.tokenAccount
        )
      ).value.amount
    );

    const funderTokenAddress = await getOrCreateSwitchboardTokenAccount(
      this.program,
      mint
    );

    const funderTokenBalance = new anchor.BN(
      (
        await this.program.provider.connection.getTokenAccountBalance(
          funderTokenAddress
        )
      ).value.amount
    );

    if (amount.gt(funderTokenBalance)) {
      throw new Error(
        `deposit amount ${amount} must be less than current token balance ${funderTokenBalance}`
      );
    }

    const txn = await spl.transfer(
      this.program.provider.connection,
      payer,
      funderTokenAddress,
      oracle.tokenAccount,
      payer,

      amount.toNumber(),
      undefined,
      undefined,
      spl.TOKEN_PROGRAM_ID
    );

    if (this.silent) {
      console.log(txn);
    } else {
      this.logger.log(
        `${chalk.green(
          `${CHECK_ICON}Deposited ${amount} tokens into oracle account`
        )}`
      );
      this.logger.log(
        `https://explorer.solana.com/tx/${txn}?cluster=${this.cluster}`
      );
      const finalTokenBalance = (
        await this.program.provider.connection.getTokenAccountBalance(
          oracle.tokenAccount
        )
      ).value;

      this.logger.log(
        chalkString(
          "New Oracle Token Balance",
          `${finalTokenBalance.uiAmountString} (${finalTokenBalance.amount})`
        )
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to deposit into oracle token account");
  }
}
