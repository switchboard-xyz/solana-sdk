import { flags } from "@oclif/command";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { AggregatorAccount, getPayer } from "@switchboard-xyz/switchboard-v2";
import * as chalk from "chalk";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, loadKeypair, verifyProgramHasPayer } from "../../../utils";

export default class AggregatorSetVariance extends BaseCommand {
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
      parse: (variance: string) => new anchor.BN(variance),
      description: "public key of the oracle queue",
    },
  ];

  async run() {
    const { args, flags } = this.parse(AggregatorSetVariance);
    verifyProgramHasPayer(this.program);

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: args.aggregatorKey,
    });

    const authority = flags.authority
      ? await loadKeypair(flags.authority)
      : getPayer(this.program);

    const txn = await this.program.rpc.aggregatorSetVarianceThreshold(
      { varianceThreshold: args.varianceThreshold },
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
        `\r\n${chalk.green(
          `${CHECK_ICON}Aggregator variance threshold set successfully`
        )}`
      );
      this.logger.log(`https://solscan.io/tx/${txn}?cluster=${this.cluster}`);
    }
  }

  async catch(error) {
    super.catch(error, "failed to set aggregator's variance threshold");
  }
}
