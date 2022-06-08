import { Flags } from "@oclif/core";
import { PublicKey } from "@solana/web3.js";
import { CrankAccount, CrankRow } from "@switchboard-xyz/switchboard-v2";
import * as fs from "fs";
import * as path from "path";
import BaseCommand from "../../BaseCommand";

export default class CrankList extends BaseCommand {
  static description = "list the pubkeys currently on the crank";

  static flags = {
    ...BaseCommand.flags,
    force: Flags.boolean({ description: "overwrite output file if exists" }),
    outputFile: Flags.string({
      char: "f",
      description: "output file to save aggregator pubkeys to",
    }),
  };

  static args = [
    {
      name: "crankKey",
      description: "public key of the crank",
    },
  ];

  async run() {
    const { args, flags } = await this.parse(CrankList);

    const outputFile = flags.outputFile
      ? path.join(process.cwd(), flags.outputFile)
      : undefined;
    if (outputFile && fs.existsSync(outputFile) && !flags.force) {
      throw new Error(
        `${outputFile} already exists, use the --force flag to overwrite`
      );
    }

    const crankAccount = new CrankAccount({
      program: this.program,
      publicKey: new PublicKey(args.crankKey),
    });

    const crank = await crankAccount.loadData();
    const pqData: CrankRow[] = crank.pqData;

    const pqKeys = pqData.map((row) => row.pubkey.toString());

    if (outputFile) {
      if (outputFile.endsWith(".txt")) {
        fs.writeFileSync(outputFile, pqKeys.join("\n"));
      } else {
        fs.writeFileSync(
          outputFile,
          JSON.stringify(
            {
              crank: crankAccount.publicKey.toString(),
              pubkeys: pqKeys,
            },
            undefined,
            2
          )
        );
      }
    }

    if (!flags.silent) {
      this.logger.log(pqKeys.join("\n"));
    }
  }

  async catch(error) {
    super.catch(error, "failed to print the cranks pubkeys");
  }
}
