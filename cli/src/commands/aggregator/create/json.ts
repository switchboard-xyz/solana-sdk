import { flags } from "@oclif/command";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { prettyPrintAggregator } from "@switchboard-xyz/sbv2-utils";
import {
  AggregatorAccount,
  JobAccount,
  OracleJob,
  OracleQueueAccount,
  programWallet,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import {
  fromAggregatorJSON,
  fromJobJSON,
  pubKeyConverter,
  pubKeyReviver,
} from "../../../accounts";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, loadKeypair, verifyProgramHasPayer } from "../../../utils";

export default class JsonCreateAggregator extends BaseCommand {
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

  async run() {
    const { args, flags } = this.parse(JsonCreateAggregator);
    verifyProgramHasPayer(this.program);

    const payerKeypair = programWallet(this.program);

    const definitionFile = args.definitionFile.startsWith("/")
      ? args.definitionFile
      : path.join(process.cwd(), args.definitionFile);
    if (!fs.existsSync(definitionFile)) {
      throw new Error("input file does not exist");
    }

    const aggregatorDefinition: fromAggregatorJSON = JSON.parse(
      fs.readFileSync(definitionFile, "utf-8"),
      pubKeyReviver
    );

    if (flags.outputFile && fs.existsSync(flags.outputFile) && !flags.force) {
      throw new Error(
        "output file exists. Run the command with '--force' to overwrite it"
      );
    }

    let authority = programWallet(this.program);
    if (flags.authority) {
      authority = await loadKeypair(flags.authority);
    }

    if (!aggregatorDefinition.queuePublicKey && !flags.queueKey) {
      throw new Error("you must provide a --queueKey to create aggregator for");
    }

    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: aggregatorDefinition.queuePublicKey
        ? new PublicKey(aggregatorDefinition.queuePublicKey)
        : new PublicKey(flags.queueKey),
    });

    const authorWallet =
      aggregatorDefinition.authorWalletPublicKey ?? payerKeypair.publicKey;
    const authorityPubkey = authority.publicKey ?? payerKeypair.publicKey;
    const batchSize = aggregatorDefinition.oracleRequestBatchSize ?? 3;
    const expiration = aggregatorDefinition.expiration
      ? new anchor.BN(aggregatorDefinition.expiration)
      : new anchor.BN(0);
    const forceReportPeriod = aggregatorDefinition.forceReportPeriod
      ? new anchor.BN(aggregatorDefinition.forceReportPeriod)
      : new anchor.BN(0);
    const metadata = aggregatorDefinition.metadata
      ? Buffer.from(aggregatorDefinition.metadata)
      : Buffer.from("");
    const minRequiredJobResults =
      aggregatorDefinition.minRequiredJobResults ?? 1;
    const minRequiredOracleResults =
      aggregatorDefinition.minRequiredOracleResults ?? 2;
    const minUpdateDelaySeconds =
      aggregatorDefinition.minUpdateDelaySeconds ?? 30;
    const name = aggregatorDefinition.name
      ? Buffer.from(aggregatorDefinition.name)
      : Buffer.from("");
    const startAfter = aggregatorDefinition.startAfter ?? 0;
    const varianceThreshold = aggregatorDefinition.varianceThreshold ?? 0;

    const aggregatorAccount = await AggregatorAccount.create(this.program, {
      authorWallet,
      authority: authorityPubkey,
      batchSize,
      expiration,
      forceReportPeriod,
      metadata,
      minRequiredJobResults,
      minRequiredOracleResults:
        minRequiredOracleResults > batchSize
          ? batchSize
          : minRequiredOracleResults,
      minUpdateDelaySeconds,
      name,
      queueAccount,
      startAfter,
      varianceThreshold,
    });
    const aggregator = await aggregatorAccount.loadData();

    const jobs: JobAccount[] = [];
    if (aggregatorDefinition.jobs) {
      for await (const job of aggregatorDefinition.jobs) {
        const jobDefinition: fromJobJSON = JSON.parse(
          JSON.stringify(job),
          pubKeyConverter
        );
        const data = Buffer.from(
          OracleJob.encodeDelimited(
            OracleJob.create({
              tasks: jobDefinition.tasks,
            })
          ).finish()
        );

        const account = await JobAccount.create(this.program, {
          data,
          name: jobDefinition.name
            ? Buffer.from(jobDefinition.name)
            : Buffer.from(""),
          expiration: jobDefinition.expiration
            ? new anchor.BN(jobDefinition.expiration)
            : new anchor.BN(0),
          authority:
            jobDefinition.authorityWalletPublicKey ?? payerKeypair.publicKey,
        });

        jobs.push(account);
      }
    }

    for await (const job of jobs) {
      await aggregatorAccount.addJob(job, authority);
    }

    if (!this.silent) {
      this.logger.log(
        await prettyPrintAggregator(
          aggregatorAccount,
          aggregator,
          false,
          false,
          true
        )
      );
    }

    if (flags.outputFile) {
      fs.writeFileSync(
        flags.outputFile,
        JSON.stringify(aggregator, pubKeyConverter, 2)
      );
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
  }

  async catch(error) {
    super.catch(error, "failed to create aggregator from json file");
  }
}
