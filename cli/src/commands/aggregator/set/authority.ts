import { Flags } from "@oclif/core";
import { PublicKey } from "@solana/web3.js";
import { AggregatorAccount } from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, loadKeypair } from "../../../utils";

export default class AggregatorSetAuthority extends BaseCommand {
  static description = "set an aggregator's authority";

  static flags = {
    ...BaseCommand.flags,
    currentAuthority: Flags.string({
      char: "a",
      description: "alternate keypair that is the authority for the aggregator",
    }),
  };

  static args = [
    {
      name: "aggregatorKey",
      description: "public key of the aggregator account",
    },
    {
      name: "newAuthority",
      description: "keypair path of new authority",
    },
  ];

  //   static examples = ["$ sbv2 aggregator:set:authority"];

  async run() {
    const { args, flags } = await this.parse(AggregatorSetAuthority);

    const newAuthority = await loadKeypair(args.newAuthority);

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: new PublicKey(args.aggregatorKey),
    });
    const aggregator = await aggregatorAccount.loadData();
    const currentAuthority = await this.loadAuthority(
      flags.currentAuthority,
      aggregator.authority
    );

    const txn = await aggregatorAccount.setAuthority(
      newAuthority.publicKey,
      currentAuthority
    );

    if (this.silent) {
      console.log(txn);
    } else {
      this.logger.log(
        `${chalk.green(`${CHECK_ICON}Aggregator authority set successfully`)}`
      );
      this.logger.log(
        `https://explorer.solana.com/tx/${txn}?cluster=${this.cluster}`
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to set aggregator authority");
  }
}
