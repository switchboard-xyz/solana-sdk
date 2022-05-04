import { flags } from "@oclif/command";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { getOrCreateSwitchboardMintTokenAccount } from "@switchboard-xyz/sbv2-utils";
import {
  AggregatorAccount,
  LeaseAccount,
  OracleQueueAccount,
  programWallet,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import { chalkString } from "../../../accounts/utils";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../../utils";

export default class AggregatorLeaseExtend extends BaseCommand {
  static description = "fund and re-enable an aggregator lease";

  static flags = {
    ...BaseCommand.flags,
    amount: flags.string({
      required: true,
      description:
        "token amount to load into the lease escrow. If decimals provided, amount will be normalized to raw tokenAmount",
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
    "$ sbv2 aggregator:lease:extend GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --amount 1.1 --keypair ../payer-keypair.json",
  ];

  async run() {
    const { args, flags } = this.parse(AggregatorLeaseExtend);
    verifyProgramHasPayer(this.program);

    let amount = this.getTokenAmount(flags.amount);
    if (amount.lte(new anchor.BN(0))) {
      throw new Error("amount to deposit must be greater than 0");
    }

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: args.aggregatorKey,
    });
    const aggregator = await aggregatorAccount.loadData();

    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: aggregator.queuePubkey,
    });

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

    const initialLeaseBalance = await leaseAccount.getBalance();
    this.logger.log(
      chalkString("Initial Aggregator Lease Balance", initialLeaseBalance)
    );

    const funderTokenAccount = await getOrCreateSwitchboardMintTokenAccount(
      this.program
    );
    const initialFunderBalance =
      await this.program.provider.connection.getTokenAccountBalance(
        funderTokenAccount
      );
    this.logger.log(
      chalkString(
        "Initial Funder Token Balance",
        initialFunderBalance.value.uiAmountString
      )
    );

    const funderAuthority = programWallet(this.program);

    const txn = await leaseAccount.extend({
      loadAmount: args.amount,
      funder: funderTokenAccount,
      funderAuthority,
    });

    if (this.silent) {
      console.log(txn);
    } else {
      this.logger.log(
        `${chalk.green(
          `${CHECK_ICON} Deposited ${args.amount} tokens into aggregator lease`
        )}`
      );
      this.logger.log(
        `https://explorer.solana.com/tx/${txn}?cluster=${this.cluster}`
      );
      const newBalance = await aggregator.leaseAccount.getBalance();
      this.logger.log(
        chalkString("Final Aggregator Lease Balance", newBalance)
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to deposit into aggregator lease account");
  }
}
