import { flags } from "@oclif/command";
import { Input } from "@oclif/parser";
import { Keypair } from "@solana/web3.js";
import fs from "fs";
import path from "path";
import {
  OracleQueueClass,
  pubKeyConverter,
  pubKeyReviver,
  QueueDefinition,
} from "./accounts";
import BaseCommand from "./BaseCommand";
import { loadKeypair } from "./utils";

abstract class JsonBaseCommand extends BaseCommand {
  public queueAuthority?: Keypair;

  public queueSchemaPath?: string;

  public queueSchema?: QueueDefinition;

  static flags = {
    ...BaseCommand.flags,
    authority: flags.string({
      char: "a",
      description:
        "alternate keypair that is the authority for the oracle queue",
    }),
    schema: flags.string({
      char: "a",
      description: "filesystem path for an oracle queue schema",
    }),
  };

  async init() {
    await super.init();
    const { flags } = this.parse(<Input<any>>this.constructor);
    JsonBaseCommand.flags = flags;

    this.queueSchemaPath =
      flags.schema && flags.schema.startsWith("/")
        ? flags.schema
        : path.join(process.cwd(), flags.schema);

    if (fs.existsSync(this.queueSchemaPath)) {
      this.queueSchema = JSON.parse(
        fs.readFileSync(this.queueSchemaPath, "utf-8"),
        pubKeyReviver
      );
    }

    if (flags.authority) {
      this.queueAuthority = flags.authority
        ? await loadKeypair(flags.authority)
        : undefined;
    }
  }

  save(queue: OracleQueueClass) {
    const outputString = JSON.stringify(queue, pubKeyConverter, 2);
    if (!outputString || outputString.length === 0) {
      throw new Error(`failed to save oracle queue (len === 0)`);
    }
    fs.writeFileSync(this.queueSchemaPath, outputString);
  }
}

export default JsonBaseCommand;
