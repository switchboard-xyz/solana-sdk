import { flags } from "@oclif/command";
import { Keypair } from "@solana/web3.js";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import {
  fromQueueJSON,
  OracleQueueClass,
  pubKeyReviver,
} from "../../../accounts";
import BaseCommand from "../../../BaseCommand";
import { InputFileNotFound, OutputFileExistsNoForce } from "../../../types";
import { CHECK_ICON, verifyProgramHasPayer } from "../../../utils";

export default class JsonCreateQueue extends BaseCommand {
  authority: Keypair;

  definitionFile: string;

  schemaFile: string;

  static description = "create an oracle queue from a json file";

  static aliases = ["queue:create:json"];

  static flags = {
    ...BaseCommand.flags,
    force: flags.boolean({
      description: "overwrite output file",
    }),
    authority: flags.string({
      description:
        "alternate keypair that will be the authority for any created accounts",
    }),
  };

  static args = [
    {
      name: "inputFile",
      required: true,
      description: "filesystem path of queue definition json file",
    },
    {
      name: "outputFile",
      required: true,
      description: "filesystem path of output file to quickly load the queue ",
    },
  ];

  static examples = [
    "$ sbv2 json:create:queue examples/queue.json queue-1.json -k ../authority-keypair.json",
  ];

  async init() {
    await super.init();
    this.mainnetCheck(); // json builder needs more testing
    verifyProgramHasPayer(this.program);

    const { args, flags } = this.parse(JsonCreateQueue);

    if (!fs.existsSync(args.inputFile)) {
      throw new InputFileNotFound(args.inputFile);
    }
    this.definitionFile = path.join(process.cwd(), args.inputFile);

    if (fs.existsSync(args.outputFile) && !flags.force) {
      throw new OutputFileExistsNoForce(args.outputFile);
    }
    this.schemaFile = args.outputFile;

    this.authority = await args.authorityKeypair;
  }

  async run() {
    const queueDefinition: fromQueueJSON = JSON.parse(
      fs.readFileSync(this.definitionFile, "utf-8"),
      pubKeyReviver
    );
    this.logger.debug(
      `creating oracle queue from json file ${this.definitionFile}`
    );
    const queue = await OracleQueueClass.build(
      this.context,
      this.program,
      queueDefinition
    );

    if (this.silent) {
      console.log(this.schemaFile);
    } else {
      this.logger.log(
        `${chalk.green(
          `${CHECK_ICON}Oracle Queue created successfully from JSON file`
        )}`
      );
    }

    fs.writeFileSync(this.schemaFile, queue.toString());
  }

  async catch(error) {
    super.catch(error, "failed to create queue from json file");
  }
}
