import { flags } from "@oclif/command";
import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { OracleQueueAccount } from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import {
  AggregatorClass,
  fromAggregatorJSON,
  PermissionClass,
  pubKeyReviver,
} from "../../../accounts";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, loadKeypair, verifyProgramHasPayer } from "../../../utils";

export default class JsonCreateAggregator extends BaseCommand {
  program: anchor.Program;

  authority: Keypair;

  definitionFile: string;

  schemaFile?: string;

  queueAccount: OracleQueueAccount;

  queueKeypair?: Keypair;

  static description = "create an aggregator from a json file";

  static aliases = ["json:create:aggregator"];

  static flags = {
    ...BaseCommand.flags,
    force: flags.boolean({
      description: "overwrite output file",
    }),
    outputFile: flags.string({
      description: "output aggregator definition to a json file",
      char: "f",
    }),
    queueKey: flags.string({
      description: "public key of the oracle queue to create aggregator for",
      char: "q",
    }),
    authority: flags.string({
      description:
        "alternate keypair that will be the authority for the aggregator",
      char: "a",
    }),
  };

  static args = [
    {
      name: "definitionFile",
      required: true,
      description: "filesystem path of queue definition json file",
    },
  ];

  static examples = [
    "$ sbv2 aggregator:create:json examples/aggregator.json --keypair ../payer-keypair.json --queueKey GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U --outputFile aggregator.schema.json",
  ];

  async init() {
    await super.init();
    const { args, flags } = this.parse(JsonCreateAggregator);
    verifyProgramHasPayer(this.program);

    this.definitionFile = args.definitionFile.startsWith("/")
      ? args.definitionFile
      : path.join(process.cwd(), args.definitionFile);
    if (!fs.existsSync(this.definitionFile)) {
      throw new Error("input file does not exist");
    }

    if (flags.outputFile) {
      if (fs.existsSync(flags.outputFile) && !flags.force) {
        throw new Error(
          "output file exists. Run the command with '--force' to overwrite it"
        );
      }
      this.schemaFile = flags.outputFile;
    }

    if (flags.authority) {
      this.authority = await loadKeypair(flags.authority);
    }

    if (flags.queueKey) {
      this.queueAccount = new OracleQueueAccount({
        program: this.program,
        publicKey: new PublicKey(flags.queueKey),
      });
    } else {
      throw new Error("you must provide a --queueKey to create aggregator for");
    }
  }

  async run() {
    let aggregatorDefinition: fromAggregatorJSON = JSON.parse(
      fs.readFileSync(this.definitionFile, "utf-8"),
      pubKeyReviver
    );
    if (this.authority) {
      aggregatorDefinition = {
        ...aggregatorDefinition,
        authorityPublicKey: this.authority.publicKey,
      };
    }

    const aggregator = await AggregatorClass.build(
      this.context,
      this.program,
      aggregatorDefinition,
      this.queueAccount
    );

    if (this.queueKeypair) {
      const permission = await PermissionClass.grantPermission(
        this.context,
        aggregator.account,
        this.queueKeypair
      );
      this.logger.info(`aggregator granted ${permission.permission}`);
    }

    if (this.silent) {
      console.log(aggregator.publicKey.toString());
    } else {
      this.logger.info(
        `${chalk.green(
          `${CHECK_ICON}Aggregator created successfully from JSON file\r\n`
        )}`
      );
    }
    if (this.schemaFile)
      fs.writeFileSync(this.schemaFile, aggregator.toString());
  }

  async catch(error) {
    super.catch(error, "failed to create aggregator from json file");
  }
}
