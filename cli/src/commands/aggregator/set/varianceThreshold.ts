import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import {
  AggregatorAccount,
  SwitchboardDecimal,
} from "@switchboard-xyz/switchboard-v2";
import Big from "big.js";
import chalk from "chalk";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../../utils";

export default class AggregatorSetVarianceThreshold extends BaseCommand {
  static description = "set an aggregator's variance threshold";

  static flags = {
    ...BaseCommand.flags,
    authority: flags.string({
      char: "a",
      description: "alternate keypair that is the authority for the aggregator",
    }),
  };

  static args = [
    {
      name: "aggregatorKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the aggregator",
    },
    {
      name: "varianceThreshold",
      required: true,
      parse: (variance: string) => new Big(variance),
      description:
        "percentage change between a previous accepted result and the next round before an oracle reports a value on-chain. Used to conserve lease cost during low volatility",
    },
  ];

  static examples = [
    "$ sbv2 aggregator:set:variance GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR 0.1 --keypair ../payer-keypair.json # 0.1% varianceThreshold",
  ];

  async run() {
    const { args, flags } = this.parse(AggregatorSetVarianceThreshold);
    verifyProgramHasPayer(this.program);

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: args.aggregatorKey,
    });
    const aggregator = await aggregatorAccount.loadData();
    const authority = await this.loadAuthority(
      flags.authority,
      aggregator.authority
    );

    const txn = await this.program.rpc.aggregatorSetVarianceThreshold(
      { varianceThreshold: SwitchboardDecimal.fromBig(args.varianceThreshold) },
      {
        accounts: {
          aggregator: aggregatorAccount.publicKey,
          authority: authority.publicKey,
        },
        signers: [authority],
      }
    );

    if (this.silent) {
      console.log(txn);
    } else {
      this.logger.log(
        `${chalk.green(
          `${CHECK_ICON}Aggregator variance threshold set successfully`
        )}`
      );
      this.logger.log(
        `https://explorer.solana.com/tx/${txn}?cluster=${this.cluster}`
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to set aggregator's variance threshold");
  }
}
