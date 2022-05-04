import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import { AggregatorAccount } from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, loadKeypair } from "../../../utils";

export default class AggregatorSetAuthority extends BaseCommand {
  static description = "set an aggregator's authority";

  static flags = {
    ...BaseCommand.flags,
    currentAuthority: flags.string({
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
      name: "newAuthority",
      required: true,
      description: "keypair path of new authority",
    },
  ];

  //   static examples = ["$ sbv2 aggregator:set:authority"];

  async run() {
    const { args, flags } = this.parse(AggregatorSetAuthority);

    const newAuthority = await loadKeypair(args.newAuthority);

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: args.aggregatorKey,
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
