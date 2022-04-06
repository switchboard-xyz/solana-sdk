import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import fs from "fs";
import { CrankClass } from "../../accounts/crank/crank";
import BaseCommand from "../../BaseCommand";
import { OutputFileExistsNoForce } from "../../types";

export default class CrankPrint extends BaseCommand {
  outputFile?: string;

  static description = "print deserialized switchboard crank account";

  static aliases = ["crank:print"];

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
      name: "crankKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the crank account to deserialize",
    },
  ];

  static examples = [
    "$ sbv2 crank:print 85L2cFUvXaeGQ4HrzP8RJEVCL7WvRrXM2msvEmQ82AVr",
  ];

  async run() {
    const { args, flags } = this.parse(CrankPrint);

    if (flags.outputFile) {
      if (fs.existsSync(flags.outputFile) && !flags.force) {
        throw new OutputFileExistsNoForce(flags.outputFile);
      }
      this.outputFile = flags.outputFile;
    }

    const crank = await CrankClass.fromPublicKey(
      this.context,
      this.program,
      args.crankKey
    );

    this.logger.log(crank.prettyPrint(true));

    if (this.outputFile) {
      this.context.fs.saveAccount(this.outputFile, crank);
    }
  }

  async catch(error) {
    super.catch(error, "failed to print crank account");
  }
}
