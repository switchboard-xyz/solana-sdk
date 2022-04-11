import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import { AggregatorAccount, getPayer } from "@switchboard-xyz/switchboard-v2";
import * as chalk from "chalk";
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
      description:
        "public key of an existing job account to remove from an aggregator",
    },
  ];

  //   static examples = ["$ sbv2 aggregator:set:authority"];

  async run() {
    const { args, flags } = this.parse(AggregatorSetAuthority);

    const newAuthority = await loadKeypair(args.newAuthority);

    const currentAuthority = flags.currentAuthority
      ? await loadKeypair(flags.currentAuthority)
      : getPayer(this.program);

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: args.aggregatorKey,
    });

    const txn = await aggregatorAccount.setAuthority(
      newAuthority.publicKey,
      currentAuthority
    );

    if (this.silent) {
      console.log(txn);
    } else {
      this.logger.log(
        `${chalk.green(
          `${CHECK_ICON}Aggregator authority set successfully\r\n`
        )}`
      );
      this.logger.log(`https://solscan.io/tx/${txn}?cluster=${this.cluster}`);
    }
  }

  async catch(error) {
    super.catch(error, "failed to set aggregator authority");
  }
}
