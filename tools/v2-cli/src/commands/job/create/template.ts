import { flags } from "@oclif/command";
import * as anchor from "@project-serum/anchor";
import * as chalk from "chalk";
import fs from "fs";
import { fromJobTemplate, pubKeyConverter } from "../../../accounts";
import { JobClass } from "../../../accounts/job/job";
import BaseCommand from "../../../BaseCommand";
import { OutputFileExistsNoForce } from "../../../types";
import { CHECK_ICON, loadKeypair } from "../../../utils";

export default class JobCreateTemplate extends BaseCommand {
  templateDefinition: fromJobTemplate;

  outputFile = "";

  static description =
    "create a new on-chain job account from an existing template";

  static flags = {
    ...BaseCommand.flags,
    force: flags.boolean({ description: "skip job confirmation" }),
    name: flags.string({
      char: "n",
      description: "name of the job account for easier identification",
      default: "",
    }),
    outKeypair: flags.string({
      char: "k",
      description:
        "existing keypair file to store new account. useful for using the same public key on different clusters",
    }),
    outputFile: flags.string({
      char: "f",
      description: "output file to save job definition to",
    }),
  };

  static args = [
    {
      name: "template",
      required: true,
      description:
        "the template type (ftxUs/coinbase/etc) or the filesystem path to the json file containing the task definitions",
    },
    {
      name: "id",
      required: true,
      description: "api endpoint id for a given source",
    },
  ];

  static examples = [
    "$ sbv2 job:create:template ftxUs BTC_USD --keypair ../payer-keypair.json",
    "$ sbv2 job:create:template ftxUs BTC_USD --keypair ../payer-keypair.json --name=ftxUs_Btc",
    "$ sbv2 job:create:template ftxUs BTC_USD -k ../payer-keypair.json -n ftxUs_Btc -f ftx_us_btc_job.json",
  ];

  async init() {
    await super.init();
    const { args, flags } = this.parse(JobCreateTemplate);

    this.templateDefinition = {
      template: args.template,
      id: args.id,
      name: flags.name,
      existingKeypair: flags.outKeypair
        ? await loadKeypair(flags.outKeypair)
        : anchor.web3.Keypair.generate(),
    };

    if (flags.outputFile) {
      if (fs.existsSync(flags.outputFile) && !flags.force) {
        throw new OutputFileExistsNoForce(flags.outputFile);
      }
      this.outputFile = flags.outputFile;
    }
  }

  async run() {
    const job = await JobClass.fromTemplate(
      this.context,
      this.program,
      this.templateDefinition
    );

    if (this.silent) {
      console.log(job.publicKey.toString());
    } else {
      this.logger.info(job.prettyPrint());

      this.logger.info(
        `\r\n${chalk.green(
          `${CHECK_ICON}Job account created from template successfully`
        )}`
      );
      if (this.templateDefinition.existingKeypair) {
        this.context.fs.saveKeypair(this.templateDefinition.existingKeypair);
      }
    }

    if (this.outputFile) {
      fs.writeFileSync(
        this.outputFile,
        JSON.stringify(job, pubKeyConverter, 2)
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to create job account from template");
  }
}
