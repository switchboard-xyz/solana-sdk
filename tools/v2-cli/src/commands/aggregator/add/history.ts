import { flags } from "@oclif/command";
import { Keypair, PublicKey } from "@solana/web3.js";
import { AggregatorAccount } from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import { AggregatorClass } from "../../../accounts";
import BaseCommand from "../../../BaseCommand";
import {
  CHECK_ICON,
  getProgramPayer,
  loadKeypair,
  verifyProgramHasPayer,
} from "../../../utils";

export default class AggregatorAddHistory extends BaseCommand {
  aggregatorAccount: AggregatorAccount;
  aggregatorAuthority?: Keypair = undefined;
  size: number;

  static description = "add a history buffer to an aggregator";

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

  async init() {
    await super.init();
    verifyProgramHasPayer(this.program);

    const { args, flags } = this.parse(AggregatorAddHistory);

    this.aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: args.aggregatorKey,
    });

    this.size = args.size;

    if (flags.authority) {
      this.aggregatorAuthority = await loadKeypair(flags.authority);
    }
  }

  async run() {
    const aggregator = await AggregatorClass.fromAccount(
      this.context,
      this.aggregatorAccount
    );

    const txn = await aggregator.addHistoryBuffer(
      this.size,
      this.aggregatorAuthority || getProgramPayer(this.program)
    );

    if (this.silent) {
      console.log(txn);
    } else {
      this.logger.log(
        `\r\n${chalk.green(
          `${CHECK_ICON}Added a history buffer of size ${this.size} to aggregator successfully`
        )}`
      );
      this.logger.log(`https://solscan.io/tx/${txn}?cluster=${this.cluster}`);
    }
  }

  async catch(error) {
    super.catch(error, "failed to add history buffer to aggregator");
  }
}
