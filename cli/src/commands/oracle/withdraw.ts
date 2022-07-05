import { Flags } from "@oclif/core";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  chalkString,
  getOrCreateSwitchboardTokenAccount,
} from "@switchboard-xyz/sbv2-utils";
import {
  OracleAccount,
  OracleQueueAccount,
  PermissionAccount,
  programWallet,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import BaseCommand from "../../BaseCommand";
import { CHECK_ICON, loadKeypair, verifyProgramHasPayer } from "../../utils";

export default class OracleWithdraw extends BaseCommand {
  static description = "withdraw tokens from an oracle's token wallet";

  static flags = {
    ...BaseCommand.flags,
    force: Flags.boolean({
      char: "f",
      description:
        "skip minStake balance check. your oracle may be removed from the queue",
    }),
    withdrawAccount: Flags.string({
      char: "w",
      required: false,
      description:
        "optional solana pubkey or keypair filesystem path to withdraw funds to. default destination is oracle authority's token wallet",
    }),
    authority: Flags.string({
      char: "a",
      description:
        "keypair delegated as the authority for managing the oracle account",
    }),
    amount: Flags.string({
      required: true,
      description:
        "token amount to withdraw from oracle escrow. If decimals provided, amount will be normalized to raw tokenAmount",
    }),
  };

  static args = [
    {
      name: "oracleKey",

      description: "public key of the oracle to withdraw from",
    },
  ];

  static examples = [
    "$ sbv2 oracle:withdraw 6kPsQoufdugtHLjM4fH7Z2fNv7jLt5pgvwKHt5JvRhQ6 2500 --keypair ../oracle-keypair.json",
    "$ sbv2 oracle:withdraw 6kPsQoufdugtHLjM4fH7Z2fNv7jLt5pgvwKHt5JvRhQ6 2500 --keypair ../payer-keypair.json --authority ../oracle-keypair.json -w ByJs8E29jxvqf2KFLwfyiE2gUh5fivaS7aShcRMAsnzg",
  ];

  async run() {
    verifyProgramHasPayer(this.program);
    const { args, flags } = await this.parse(OracleWithdraw);
    const payer = programWallet(this.program);

    const amount = this.getTokenAmount(flags.amount);

    // get oracle account
    const oracleAccount = new OracleAccount({
      program: this.program,
      publicKey: new PublicKey(args.oracleKey),
    });
    const oracle = await oracleAccount.loadData();

    // verify authority
    const authority = await this.loadAuthority(
      flags.authority,
      oracle.oracleAuthority
    );

    // load queue
    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: oracle.queuePubkey,
    });
    const queue = await queueAccount.loadData();
    const mint = await queueAccount.loadMint();

    // check permission account has been initialized
    const [permissionAccount] = PermissionAccount.fromSeed(
      this.program,
      queue.authority,
      queueAccount.publicKey,
      oracleAccount.publicKey
    );
    try {
      const permissions = await permissionAccount.loadData();
    } catch {
      this.logger.error(
        `Need to create a permission account before withdrawing`
      );
      return;
    }

    // check final token balance isnt less than queue's minStake
    const initialTokenBalance = new anchor.BN(
      (
        await this.program.provider.connection.getTokenAccountBalance(
          oracle.tokenAccount
        )
      ).value.amount
    );
    const finalTokenBalance = initialTokenBalance.sub(amount);
    if (!flags.force && finalTokenBalance.lt(queue.minStake)) {
      throw new Error(
        `Final oracle token balance is less than the queue's minStake`
      );
    }

    let withdrawAccount: PublicKey;
    if (flags.withdrawAccount) {
      try {
        withdrawAccount = new PublicKey(flags.withdrawAccount);
      } catch {
        try {
          const withdrawKeypair = await loadKeypair(flags.withdrawAccount);
          withdrawAccount = await getOrCreateSwitchboardTokenAccount(
            this.program,
            mint,
            withdrawKeypair
          );
        } catch {
          throw new Error(
            `failed to parse withdrawAccount flag ${flags.withdrawAccount}`
          );
        }
      }
    } else {
      withdrawAccount = await getOrCreateSwitchboardTokenAccount(
        this.program,
        mint
      );
    }

    const txn = await oracleAccount.withdraw({
      amount,
      oracleAuthority: authority,
      withdrawAccount,
    });

    if (this.silent) {
      console.log(txn);
    } else {
      this.logger.log(
        `${chalk.green(
          `${CHECK_ICON}Withdrew ${amount} tokens from oracle account`
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
    super.catch(error, "failed to withdraw tokens from oracle token account");
  }
}
