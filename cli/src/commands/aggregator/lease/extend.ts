import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  AggregatorAccount,
  getPayer,
  LeaseAccount,
  OracleQueueAccount,
} from "@switchboard-xyz/switchboard-v2/src";
import { getOrCreateSwitchboardMintTokenAccount } from "@switchboard-xyz/v2-utils-ts";
import chalk from "chalk";
import { chalkString } from "../../../accounts/utils";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../../utils";

export default class AggregatorLeaseExtend extends BaseCommand {
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

  async run() {
    const { args } = this.parse(AggregatorLeaseExtend);
    verifyProgramHasPayer(this.program);

    if (args.amount.lte(new anchor.BN(0))) {
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

    const funderAuthority = getPayer(this.program);

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
      this.logger.log(`https://solscan.io/tx/${txn}?cluster=${this.cluster}`);
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
