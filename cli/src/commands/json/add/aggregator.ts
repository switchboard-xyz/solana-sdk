import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import chalk from "chalk";
import * as fs from "fs";
import {
  copyAccount,
  fromAggregatorJSON,
  OracleQueueClass,
  PermissionClass,
  pubKeyReviver,
} from "../../../accounts";
import JsonBaseCommand from "../../../JsonBaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../../utils";

export default class SchemaAddAggregator extends JsonBaseCommand {
  aggregatorDefinition?: fromAggregatorJSON | copyAccount;

  static description = "add an aggregator to a schema file";

  static flags = {
    ...JsonBaseCommand.flags,
    aggregatorFile: flags.string({
      description: "filesystem path of job json definition file",
      exclusive: ["sourceAggregator"],
    }),
    sourceAggregator: flags.string({
      description: "public key of an existing aggregator account to copy",
      exclusive: ["aggregatorFile"],
    }),
    authority: flags.string({
      char: "a",
      description:
        "alternate keypair that is the authority for the oracle queue",
    }),
  };

  async init() {
    await super.init();
    this.mainnetCheck();
    verifyProgramHasPayer(this.program);

    const { flags } = this.parse(SchemaAddAggregator);

    if (!fs.existsSync(this.queueSchemaPath)) {
      throw new Error(`schema file does not exist ${this.queueSchemaPath}`);
    }

    if (flags.sourceAggregator) {
      this.aggregatorDefinition = {
        sourcePublicKey: new PublicKey(flags.sourceAggregator),
      };
    } else if (flags.aggregatorFile) {
      if (!fs.existsSync(flags.aggregatorFile)) {
        throw new Error(`file does not exist ${flags.aggregatorFile}`);
      }
      this.aggregatorDefinition = JSON.parse(
        fs.readFileSync(flags.aggregatorFile, "utf-8"),
        pubKeyReviver
      );
    }

    if (!this.aggregatorDefinition) {
      throw new Error(
        "you must provide --sourceAggregator or --aggregatorFIle flag"
      );
    }
  }

  async run() {
    const queue = await OracleQueueClass.build(
      this.context,
      this.program,
      this.queueSchema
    );

    const newAggregatorIndex = await queue.addAggregator(
      this.context,
      this.aggregatorDefinition
    );

    queue.aggregators[newAggregatorIndex].permissionAccount =
      await PermissionClass.grantPermission(
        this.context,
        queue.aggregators[newAggregatorIndex].account,
        this.queueAuthority
      );

    if (this.silent) {
      console.log(queue.aggregators[newAggregatorIndex].publicKey.toString());
    } else {
      this.logger.log(queue.aggregators[newAggregatorIndex].prettyPrint());
      this.logger.log(
        `\r\n${chalk.green(
          `${CHECK_ICON}Aggregator added to queue successfully`
        )}`
      );
    }

    this.save(queue);
  }

  async catch(error) {
    super.catch(error, "failed to add aggregator to schema");
  }
}
