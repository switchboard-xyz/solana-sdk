import { flags } from "@oclif/command";
import { Keypair } from "@solana/web3.js";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import {
  fromCrankJSON,
  OracleQueueClass,
  pubKeyReviver,
  QueueDefinition,
} from "../../../accounts";
import BaseCommand from "../../../BaseCommand";
import {
  CHECK_ICON,
  getProgramPayer,
  loadKeypair,
  verifyProgramHasPayer,
} from "../../../utils";

export default class SchemaAddCrank extends BaseCommand {
  queueAuthority: Keypair;

  schemaPath: string;

  crankDefinition: fromCrankJSON;

  static description = "add a crank to a schema file";

  static flags = {
    ...BaseCommand.flags,
    name: flags.string({
      char: "n",
      description: "name of the crank for easier identification",
    }),
    maxRows: flags.integer({
      char: "r",
      description: "maximum number of rows a crank can support",
    }),
    authority: flags.string({
      char: "a",
      description:
        "alternate keypair that is the authority for the oracle queue",
    }),
  };

  static args = [
    {
      name: "schemaFile",
      required: true,
      description: "filesystem path for an oracle queue schema",
    },
  ];

  async init() {
    await super.init();
    this.mainnetCheck();
    verifyProgramHasPayer(this.program);

    const { args, flags } = this.parse(SchemaAddCrank);

    if (!fs.existsSync(args.schemaFile)) {
      throw new Error(`schema file does not exist ${args.schemaFile}`);
    }
    this.schemaPath = path.join(process.cwd(), args.schemaFile);

    this.queueAuthority = flags.authority
      ? await loadKeypair(flags.authority)
      : getProgramPayer(this.program);

    this.crankDefinition = {
      name: flags.name ?? "",
      maxRows: flags.maxRows ?? undefined,
    };
  }

  async run() {
    const schemaFile: QueueDefinition = JSON.parse(
      fs.readFileSync(this.schemaPath, "utf-8"),
      pubKeyReviver
    );
    const queue = await OracleQueueClass.build(
      this.context,
      this.program,
      schemaFile
    );

    const newCrankIndex = await queue.addCrank(
      this.context,
      this.crankDefinition
    );

    if (this.silent) {
      console.log(queue.cranks[newCrankIndex].publicKey.toString());
    } else {
      this.logger.log(queue.cranks[newCrankIndex].prettyPrint());
      this.logger.log(
        `${chalk.green(`${CHECK_ICON}Crank added to queue successfully`)}`
      );
    }

    fs.writeFileSync(this.schemaPath, queue.toString());
  }

  async catch(error) {
    super.catch(error, "failed to add crank to schema");
  }
}
