import { flags } from "@oclif/command";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  AggregatorAccount,
  LeaseAccount,
  OracleQueueAccount,
  programWallet,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import { chalkString } from "../../accounts/utils";
import BaseCommand from "../../BaseCommand";
import { CHECK_ICON, loadKeypair, verifyProgramHasPayer } from "../../utils";

export default class AggregatorLeaseWithdraw extends BaseCommand {
  static description = "withdraw funds from an aggregator lease";

  static aliases = ["aggregator:lease:withdraw"];

  static flags = {
    ...BaseCommand.flags,
    withdrawAddress: flags.string({
      required: false,
      description:
        "tokenAccount to withdraw to. If not provided, payer associated token account will be used",
    }),
    amount: flags.string({
      required: true,
      description:
        "token amount to withdraw from lease account. If decimals provided, amount will be normalized to raw tokenAmount",
    }),
    authority: flags.string({
      char: "a",
      description:
        "keypair delegated as the authority for managing the oracle account",
    }),
  };

  static args = [
    {
      name: "aggregatorKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the aggregator to extend a lease for",
    },
  ];

  static examples = [
    "$ sbv2 aggregator:lease:withdraw GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --amount 1.1 --keypair ../payer-keypair.json",
  ];

  async run() {
    const { args, flags } = this.parse(AggregatorLeaseWithdraw);
    verifyProgramHasPayer(this.program);

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: args.aggregatorKey,
    });
    const aggregator = await aggregatorAccount.loadData();

    // verify authority
    const authority = await this.loadAuthority(
      flags.authority,
      aggregator.authority
    );

    // load queue
    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: aggregator.queuePubkey,
    });
    const queue = await queueAccount.loadData();
    const mint = await queueAccount.loadMint();

    let withdrawAddress: PublicKey;
    if (flags.withdrawAddress) {
      try {
        withdrawAddress = new PublicKey(flags.withdrawAddress);
      } catch {
        try {
          const withdrawKeypair = await loadKeypair(flags.withdrawAddress);
          withdrawAddress = (
            await mint.getOrCreateAssociatedAccountInfo(
              withdrawKeypair.publicKey
            )
          ).address;
        } catch {
          throw new Error(
            `failed to parse withdrawAccount flag ${flags.withdrawAddress}`
          );
        }
      }
    } else {
      withdrawAddress = (
        await mint.getOrCreateAssociatedAccountInfo(
          programWallet(this.program).publicKey
        )
      ).address;
    }

    const [leaseAccount] = LeaseAccount.fromSeed(
      this.program,
      queueAccount,
      aggregatorAccount
    );

    try {
      const lease = await leaseAccount.loadData();
    } catch {
      throw new Error(`Failed to load lease account. Has it been created yet?`);
    }

    const lease = await leaseAccount.loadData();
    const escrow: PublicKey = lease.escrow;
    let amount: anchor.BN;
    if (flags.amount) {
      amount = this.getTokenAmount(flags.amount);
    } else {
      amount = new anchor.BN(
        (
          await this.program.provider.connection.getTokenAccountBalance(escrow)
        ).value.amount
      );
    }

    const txn = await leaseAccount.withdraw({
      amount: amount,
      withdrawAuthority: authority,
      withdrawWallet: withdrawAddress,
    });

    if (!this.silent) {
      const newBalance =
        await this.program.provider.connection.getTokenAccountBalance(escrow);
      this.logger.log(
        chalkString("Final Lease Balance", newBalance.value.uiAmountString, 30)
      );
    }

    if (this.silent) {
      console.log(txn);
    } else {
      this.logger.log(
        `${chalk.green(
          `${CHECK_ICON} Withdrew ${amount} tokens from aggregator lease`
        )}`
      );
      this.logger.log(
        `https://explorer.solana.com/tx/${txn}?cluster=${this.cluster}`
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to withdraw from aggregator lease account");
  }
}
