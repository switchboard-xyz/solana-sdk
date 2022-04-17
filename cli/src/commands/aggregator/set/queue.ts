import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import {
  AggregatorAccount,
  OracleQueueAccount,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../../utils";

export default class AggregatorSetQueue extends BaseCommand {
  static description = "set an aggregator's oracle queue";

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
      name: "queueKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the oracle queue",
    },
  ];

  async run() {
    const { args, flags } = this.parse(AggregatorSetQueue);
    verifyProgramHasPayer(this.program);

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: args.aggregatorKey,
    });
    const aggregator = await aggregatorAccount.loadData();

    const oracleQueue = new OracleQueueAccount({
      program: this.program,
      publicKey: args.queueKey,
    });

    const authority = await this.loadAuthority(
      flags.authority,
      aggregator.authority
    );

    const txn = await this.program.rpc.aggregatorSetQueue(
      {},
      {
        accounts: {
          aggregator: aggregatorAccount.publicKey,
          authority: authority.publicKey,
          queue: oracleQueue.publicKey,
        },
        signers: [authority],
      }
    );

    if (this.silent) {
      console.log(txn);
    } else {
      this.logger.log(
        `\r\n${chalk.green(
          `${CHECK_ICON}Aggregator oracle queue set successfully`
        )}`
      );
      this.logger.log(`https://solscan.io/tx/${txn}?cluster=${this.cluster}`);
    }
  }

  async catch(error) {
    super.catch(error, "failed to set aggregator's history buffer");
  }
}
