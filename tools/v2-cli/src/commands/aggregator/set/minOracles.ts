import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import { AggregatorAccount } from "@switchboard-xyz/switchboard-v2";
import * as chalk from "chalk";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../../utils";

export default class AggregatorSetMinOracleResults extends BaseCommand {
  static description =
    "set an aggregator's minimum number of oracles that must respond before a result is accepted on-chain";

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
      description: "public key of the aggregator account",
    },
    {
      name: "minOracleResults",
      required: true,
      description:
        "number of oracles that must respond before a value is accepted on-chain",
    },
  ];

  //   static examples = ["$ sbv2 aggregator:set:authority"];

  async run() {
    const { args, flags } = this.parse(AggregatorSetMinOracleResults);
    verifyProgramHasPayer(this.program);

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: args.aggregatorKey,
    });
    const aggregator = await aggregatorAccount.loadData();

    const minOracleResults = Number.parseInt(args.minOracleResults, 10);
    if (minOracleResults <= 0 || minOracleResults > 16) {
      throw new Error(`Invalid min oracle size (1 - 16), ${minOracleResults}`);
    }

    const authority = await this.loadAuthority(
      flags.authority,
      aggregator.authority
    );

    const txn = await aggregatorAccount.setMinOracles({
      authority,
      minOracleResults,
    });

    if (this.silent) {
      console.log(txn);
    } else {
      this.logger.log(
        `${chalk.green(
          `${CHECK_ICON}Aggregator minimum oracles set successfully\r\n`
        )}`
      );
      this.logger.log(`https://solscan.io/tx/${txn}?cluster=${this.cluster}`);
    }
  }

  async catch(error) {
    super.catch(error, "failed to set aggregator minimum oracles");
  }
}
