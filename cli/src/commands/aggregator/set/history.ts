import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import { AggregatorAccount } from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../../utils";

export default class AggregatorSetHistoryBuffer extends BaseCommand {
  static description =
    "set an aggregator's history buffer account to record the last N accepted results";

  static aliases = ["aggregator:add:history"];

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
      description: "public key of the aggregator to add to a crank",
    },
    {
      name: "size",
      required: true,
      parse: (value: string) => Number.parseInt(value, 10),
      description: "size of history buffer",
    },
  ];

  static examples = [
    "$ sbv2 aggregator:add:history --keypair ../payer-keypair.json GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR 10000",
  ];

  async run() {
    const { args, flags } = this.parse(AggregatorSetHistoryBuffer);
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

    const size = Number.parseInt(args.size, 10);

    const txn = await aggregatorAccount.setHistoryBuffer({ authority, size });

    if (this.silent) {
      console.log(txn);
    } else {
      this.logger.log(
        `\r\n${chalk.green(
          `${CHECK_ICON}Added a history buffer of size ${size} to aggregator successfully`
        )}`
      );
      this.logger.log(`https://solscan.io/tx/${txn}?cluster=${this.cluster}`);
    }
  }

  async catch(error) {
    super.catch(error, "failed to add history buffer to aggregator");
  }
}
