import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import fs from "fs";
import { OracleClass } from "../../accounts/oracle/oracle";
import BaseCommand from "../../BaseCommand";
import { OutputFileExistsNoForce } from "../../types";

export default class OraclePrint extends BaseCommand {
  outputFile?: string;

  static description = "Print the deserialized Switchboard oracle account";

  static aliases = ["oracle:print"];

  static flags = {
    ...BaseCommand.flags,
    force: flags.boolean({
      description: "overwrite outputFile if existing",
    }),
    outputFile: flags.string({
      char: "f",
      description: "output aggregator schema to json file",
    }),
  };

  static args = [
    {
      name: "oracleKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the oracle account to deserialize",
    },
  ];

  static examples = [
    "$ sbv2 oracle:print 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4",
  ];

  async run() {
    const { args, flags } = this.parse(OraclePrint);

    if (flags.outputFile) {
      if (fs.existsSync(flags.outputFile) && !flags.force) {
        throw new OutputFileExistsNoForce(flags.outputFile);
      }
      this.outputFile = flags.outputFile;
    }

    const oracle = await OracleClass.fromPublicKey(
      this.context,
      this.program,
      args.oracleKey
    );

    this.logger.log(oracle.prettyPrint(true));

    if (this.outputFile) {
      this.context.fs.saveAccount(this.outputFile, oracle);
    }
  }

  async catch(error) {
    super.catch(error, "failed to print oracle account");
  }
}
