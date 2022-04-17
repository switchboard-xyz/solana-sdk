import { flags } from "@oclif/command";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  AggregatorAccount,
  OracleQueueAccount,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import * as fs from "fs";
import { copyAccount } from "../../../accounts";
import { AggregatorClass } from "../../../accounts/aggregator/aggregator";
import BaseCommand from "../../../BaseCommand";
import { OutputFileExistsNoForce } from "../../../types";
import {
  CHECK_ICON,
  getProgramPayer,
  loadKeypair,
  verifyProgramHasPayer,
} from "../../../utils";

export default class AggregatorCreateCopy extends BaseCommand {
  sourceAggregator: AggregatorAccount;

  aggregatorAuthority?: Keypair = undefined;

  aggregatorDefinition: copyAccount;

  queueAccount: OracleQueueAccount;

  existingKeypair?: Keypair;

  historyBuffer?: number;

  outputFile = "";

  static description = "copy an aggregator account to a new oracle queue";

  static flags = {
    ...BaseCommand.flags,
    force: flags.boolean({ description: "skip job confirmation" }),
    outputFile: flags.string({
      char: "f",
      description: "output file to save aggregator definition to",
    }),
    authority: flags.string({
      char: "a",
      description: "alternate keypair that will be the aggregator authority",
    }),
    existingKeypair: flags.string({
      description:
        "existing keypair file to store new account. useful for using the same public key on different clusters",
    }),
    history: flags.integer({
      description: "optional, initialize a history buffer of given size",
    }),
  };

  static args = [
    {
      name: "aggregatorSource",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the aggregator account to copy",
    },
    {
      name: "queueKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the queue to create aggregator for",
    },
  ];

  static examples = [
    "$ sbv2 aggregator:create:copy 8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee AY3vpUu6v49shWajeFjHjgikYfaBWNJgax8zoEouUDTs --keypair ../payer-keypair.json",
  ];

  async init() {
    await super.init();
    verifyProgramHasPayer(this.program);
    const { args, flags } = this.parse(AggregatorCreateCopy);

    this.sourceAggregator = new AggregatorAccount({
      program: this.program,
      publicKey: args.aggregatorSource,
    });

    this.queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: args.queueKey,
    });

    if (flags.existingKeypair) {
      this.existingKeypair = await loadKeypair(flags.existingKeypair);
    } else {
      this.existingKeypair = Keypair.generate();
      this.context.fs.saveKeypair(this.existingKeypair);
    }

    if (flags.authority) {
      this.aggregatorAuthority = await loadKeypair(flags.authority);
    }

    this.aggregatorDefinition = {
      sourcePublicKey: this.sourceAggregator.publicKey,
      existingKeypair: this.existingKeypair,
      authorityKeypair:
        this.aggregatorAuthority || getProgramPayer(this.program),
    };

    if (flags.history) {
      this.historyBuffer = flags.history;
    }

    if (flags.outputFile) {
      if (fs.existsSync(flags.outputFile) && !flags.force) {
        throw new OutputFileExistsNoForce(flags.outputFile);
      }
      this.outputFile = flags.outputFile;
    }
  }

  async run() {
    // create aggregator
    const aggregator = await AggregatorClass.fromCopyAccount(
      this.context,
      this.queueAccount,
      this.aggregatorDefinition
    );

    if (this.historyBuffer) {
      await aggregator.addHistoryBuffer(
        this.historyBuffer,
        this.aggregatorAuthority || getProgramPayer(this.program)
      );
    }

    // grant permission if optional flags provided

    if (this.silent) {
      console.log(aggregator.publicKey.toString());
    } else {
      this.logger.log(
        `${chalk.green(
          `${CHECK_ICON}Aggregator successfully copied to a new oracle queue\r\n`
        )}`
      );
      this.logger.log(aggregator.prettyPrint());
    }

    if (this.outputFile) {
      this.context.fs.saveAccount(this.outputFile, aggregator);
    }
  }

  async catch(error) {
    super.catch(error, "failed to copy aggregator account to new queue");
  }
}
