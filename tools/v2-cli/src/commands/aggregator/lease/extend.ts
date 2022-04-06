import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { AggregatorAccount } from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import { AggregatorClass, ProgramStateClass } from "../../../accounts";
import { chalkString } from "../../../accounts/utils";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../../utils";

export default class AggregatorLeaseExtend extends BaseCommand {
  aggregatorAccount: AggregatorAccount;

  amount: anchor.BN;

  static description = "fund and re-enable an aggregator lease";

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "aggregatorKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the aggregator to extend a lease for",
    },
    {
      name: "amount",
      required: true,
      parse: (amount: string) => new anchor.BN(amount),
      description: "amount to deposit into aggregator lease",
    },
  ];

  static examples = [
    "$ sbv2 aggregator:lease:extend GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR 2500 --keypair ../payer-keypair.json",
  ];

  async init() {
    await super.init();
    verifyProgramHasPayer(this.program);

    const { args } = this.parse(AggregatorLeaseExtend);
    this.amount = args.amount;
    if (this.amount.lte(new anchor.BN(0)))
      throw new Error("amount to deposit must be greater than 0");

    this.aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: args.aggregatorKey,
    });
  }

  async run() {
    const funderTokenAccount = await ProgramStateClass.getProgramTokenAddress(
      this.program,
      this.context
    );

    const aggregator = await AggregatorClass.fromAccount(
      this.context,
      this.aggregatorAccount
    );
    this.logger.log(
      chalkString(
        "Initial Aggregator Lease Balance",
        aggregator.leaseAccount.escrowBalance
      )
    );

    const tx = await aggregator.extendLease(funderTokenAccount, this.amount);

    if (this.silent) {
      console.log(tx);
    } else {
      this.logger.log(
        `${chalk.green(
          `${CHECK_ICON} Deposited ${this.amount} tokens into aggregator lease`
        )}`
      );
      this.logger.log(`https://solscan.io/tx/${tx}?cluster=${this.cluster}`);
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
