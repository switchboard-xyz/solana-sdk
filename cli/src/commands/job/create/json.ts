import { flags } from "@oclif/command";
import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { AggregatorAccount } from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import { fromJobJSON, JobClass, pubKeyReviver } from "../../../accounts";
import BaseCommand from "../../../BaseCommand";
import {
  CHECK_ICON,
  FAILED_ICON,
  loadAnchor,
  loadKeypair,
  programHasPayer,
} from "../../../utils";

export default class JsonCreateJob extends BaseCommand {
  program: anchor.Program;

  payerKeypair: Keypair;

  definitionFile: string;

  schemaFile?: string;

  aggregatorAuthority: Keypair;

  aggregatorAccount: AggregatorAccount;

  static description = "create a job from a json file";

  static aliases = ["json:create:job"];

  static flags = {
    ...BaseCommand.flags,
    force: flags.boolean({
      description: "overwrite output file",
    }),
    outputFile: flags.string({
      description: "output job schema to a json file",
    }),
    aggregatorAuthority: flags.string({
      description:
        "filesystem path of aggregator authority keypair to add job account to ",
    }),
    aggregatorKey: flags.string({
      description: "public key of aggregator to add job to",
      dependsOn: ["aggregatorAuthority"],
    }),
  };

  static args = [
    {
      name: "definitionFile",
      required: true,
      description: "filesystem path of job definition json file",
    },
  ];

  static examples = [
    "$ sbv2 job:create:json examples/job.json --keypair ../payer-keypair.json --aggregatorAuthority=../aggregator-keypair.json --outputFile=job.schema.json",
  ];

  async init() {
    await super.init();
    const { args, flags } = this.parse(JsonCreateJob);

    if (!fs.existsSync(args.definitionFile)) {
      throw new Error("input file does not exist");
    }
    this.definitionFile = path.join(process.cwd(), args.definitionFile);

    if (flags.outputFile) {
      if (fs.existsSync(flags.outputFile) && !flags.force) {
        throw new Error(
          "output file exists. Run the command with '--force' to overwrite it"
        );
      }
      this.schemaFile = flags.outputFile;
    }

    this.payerKeypair = await args.payerKeypair;

    this.program = await loadAnchor(
      this.cluster,
      this.connection,
      this.payerKeypair
    );

    if (flags.aggregatorKey) {
      if (flags.aggregatorAuthority) {
        this.aggregatorAuthority = await loadKeypair(flags.aggregatorAuthority);
        const aggregatorProgram = await loadAnchor(
          this.cluster,
          this.connection,
          await loadKeypair(flags.aggregatorAuthority)
        );
        this.aggregatorAccount = new AggregatorAccount({
          program: aggregatorProgram,
          publicKey: new PublicKey(flags.aggregatorKey),
        });
      } else {
        this.logger.warn("failed to provide aggregator authority keypair");
      }
    }

    if (!programHasPayer(this.program)) {
      throw new Error(
        `need to provide --keypair flag to pay for any onchain accounts`
      );
    }
  }

  async run() {
    const jobDefinition: fromJobJSON = JSON.parse(
      fs.readFileSync(this.definitionFile, "utf-8"),
      pubKeyReviver
    );

    const job = await JobClass.build(this.context, this.program, jobDefinition);

    if (this.aggregatorAccount) {
      await this.aggregatorAccount.addJob(
        job.account,
        this.aggregatorAuthority
      );
      this.logger.info(
        `job added to aggregator ${this.aggregatorAccount.publicKey}`
      );
    }

    if (this.silent) {
      console.log(job.publicKey.toString());
    } else {
      this.logger.info(
        `${chalk.green(
          `${CHECK_ICON}Job created successfully from JSON file\r\n`
        )}`
      );
    }

    if (this.schemaFile) fs.writeFileSync(this.schemaFile, job.toString());
  }

  async catch(error) {
    if (!this.silent) {
      this.logger.error(
        chalk.red(`${FAILED_ICON}Failed to create aggregator from json file`)
      );
      this.logger.error(error.message);
      this.logger.error(error.stack);
      this.exit(1);
    }
  }
}
