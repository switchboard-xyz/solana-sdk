import { flags } from "@oclif/command";
import * as anchor from "@project-serum/anchor";
import { Keypair } from "@solana/web3.js";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import {
  fromOracleJSON,
  IOracleQueueClass,
  OracleQueueClass,
  pubKeyReviver,
} from "../../../accounts";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, loadAnchor } from "../../../utils";

export default class SchemaAddOracle extends BaseCommand {
  program: anchor.Program;

  queueAuthority: Keypair;

  oracleDefinition: fromOracleJSON;

  schemaPath: string;

  static description = "add an oracle to a schema file";

  static flags = {
    ...BaseCommand.flags,
    name: flags.string({
      char: "n",
      description: "name of the crank for easier identification",
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

    const { args, flags } = this.parse(SchemaAddOracle);

    if (!fs.existsSync(args.schemaFile)) {
      throw new Error(`schema file does not exist ${args.schemaFile}`);
    }
    this.schemaPath = path.join(process.cwd(), args.schemaFile);

    this.queueAuthority = await args.queueAuthority;

    this.program = await loadAnchor(
      this.cluster,
      this.connection,
      this.queueAuthority
    );

    this.oracleDefinition = {
      name: flags.name ?? "",
    };
  }

  async run() {
    const schemaFile: IOracleQueueClass = JSON.parse(
      fs.readFileSync(this.schemaPath, "utf-8"),
      pubKeyReviver
    );

    const queue = await OracleQueueClass.build(
      this.context,
      this.program,
      schemaFile
    );

    const newOracleIndex = await queue.addOracle(
      this.context,
      this.oracleDefinition
    );

    if (this.silent) {
      console.log(queue.oracles[newOracleIndex].publicKey.toString());
    } else {
      this.logger.log(queue.oracles[newOracleIndex].prettyPrint());
      this.logger.log(
        `${chalk.green(`${CHECK_ICON}Oracle added to queue successfully`)}`
      );
    }

    fs.writeFileSync(this.schemaPath, queue.toString());
  }

  async catch(error) {
    super.catch(error, "failed to add oracle to schema");
  }
}
