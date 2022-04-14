import { flags } from "@oclif/command";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  getPayer,
  OracleAccount,
  OracleQueueAccount,
  ProgramStateAccount,
} from "@switchboard-xyz/switchboard-v2/src";
import * as chalk from "chalk";
import { chalkString } from "../../accounts/utils";
import BaseCommand from "../../BaseCommand";
import { CHECK_ICON, loadKeypair, verifyProgramHasPayer } from "../../utils";

export default class OracleWithdraw extends BaseCommand {
  static description = "withdraw tokens from an oracle's token wallet";

  static flags = {
    ...BaseCommand.flags,
    force: flags.boolean({
      char: "f",
      description:
        "skip minStake balance check. your oracle may be removed from the queue",
    }),
    withdrawAccount: flags.string({
      char: "w",
      required: false,
      description:
        "optional solana pubkey or keypair filesystem path to withdraw funds to. default destination is oracle authority's token wallet",
    }),
    authority: flags.string({
      char: "a",
      description:
        "keypair delegated as the authority for managing the oracle account",
    }),
  };

  static args = [
    {
      name: "oracleKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the oracle to withdraw from",
    },
    {
      name: "amount",
      required: true,
      parse: (amount: string) => new anchor.BN(amount),
      description: "amount to withdraw from oracle's token wallet",
    },
  ];

  static examples = [
    "$ sbv2 oracle:withdraw 6kPsQoufdugtHLjM4fH7Z2fNv7jLt5pgvwKHt5JvRhQ6 2500 --keypair ../oracle-keypair.json",
    "$ sbv2 oracle:withdraw 6kPsQoufdugtHLjM4fH7Z2fNv7jLt5pgvwKHt5JvRhQ6 2500 --keypair ../payer-keypair.json --authority ../oracle-keypair.json -w ByJs8E29jxvqf2KFLwfyiE2gUh5fivaS7aShcRMAsnzg",
  ];

  async run() {
    verifyProgramHasPayer(this.program);
    const { args, flags } = this.parse(OracleWithdraw);
    const payer = getPayer(this.program);

    // get oracle account
    const oracleAccount = new OracleAccount({
      program: this.program,
      publicKey: args.oracleKey,
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

    // load switchboard mint
    const [programStateAccount] = ProgramStateAccount.fromSeed(this.program);
    const switchboardMint = await programStateAccount.getTokenMint();

    const initialTokenBalanceResponse =
      await this.program.provider.connection.getTokenAccountBalance(
        oracle.tokenAccount
      );
    const initialTokenBalance = new anchor.BN(
      initialTokenBalanceResponse.value.amount
    );
    const finalTokenBalance = initialTokenBalance.sub(args.amount);

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
          withdrawAccount = withdrawKeypair.publicKey;
        } catch {
          throw new Error(
            `failed to parse withdrawAccount flag ${flags.withdrawAccount}`
          );
        }
      }
    } else {
      withdrawAccount = this.program.provider.wallet.publicKey;
    }

    const txn = await oracleAccount.withdraw({
      amount: args.amount,
      oracleAuthority: authority,
      withdrawAccount,
    });

    if (this.silent) {
      console.log(txn);
    } else {
      this.logger.log(
        `${chalk.green(
          `${CHECK_ICON}Withdrew ${args.amount} tokens from oracle account`
        )}`
      );
      this.logger.log(`https://solscan.io/tx/${txn}?cluster=${this.cluster}`);
      const newTokenBalance =
        await this.program.provider.connection.getTokenAccountBalance(
          oracle.tokenAccount
        );
      this.logger.log(
        chalkString(
          "New Oracle Token Balance",
          `${newTokenBalance.value.amount} (${newTokenBalance.value.uiAmountString})`
        )
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to withdraw tokens from oracle token account");
  }
}
