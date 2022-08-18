/* eslint-disable unicorn/prevent-abbreviations */

import { Flags } from "@oclif/core";
import { SwitchboardTestEnvironment } from "@switchboard-xyz/sbv2-utils";
import { programWallet } from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";
import BaseCommand from "../../BaseCommand";
import { verifyProgramHasPayer } from "../../utils";

export default class LocalnetEnvironment extends BaseCommand {
  static description = "create a localnet switchboard environment";

  static flags = {
    ...BaseCommand.flags,
    force: Flags.boolean({
      description: "overwrite output file if existing",
      default: false,
    }),
    outputDir: Flags.string({
      char: "o",
      description: "output directory for scripts",
    }),
  };

  async run() {
    verifyProgramHasPayer(this.program);
    const { flags } = await this.parse(LocalnetEnvironment);
    const payerKeypair = programWallet(this.program);

    const outputDir = flags.outputDir
      ? path.join(process.cwd(), flags.outputDir)
      : process.cwd();

    // TODO: Check paths and force flags
    if (!flags.force) {
      const files = [
        "switchboard.env",
        "switchboard.json",
        "start-local-validator.sh",
        "start-oracle.sh",
        "Anchor.switchboard.toml",
        "docker-compose.switchboard.yml",
      ];
      for (const file of files) {
        if (fs.existsSync(path.join(outputDir, file))) {
          throw new Error(`${file} already exists, use --force to overwrite`);
        }
      }
    }

    // TODO: Add silent flag
    // TODO: Pass keypair path and add as env variable
    const testEnvironment = await SwitchboardTestEnvironment.create(
      flags.keypair,
      undefined,
      flags.programId ? this.program.programId : undefined
    );
    testEnvironment.writeAll(outputDir);

    console.log(
      chalk.blue(
        `\nYou may also copy the accounts from Anchor.switchboard.toml into your projects Anchor.toml and run the following command to create an oracle and run 'anchor test' with a local validator running:`
      )
    );
    console.log(
      chalk.yellow(
        `\tsbv2 anchor test \\
  --keypair ${testEnvironment.payerKeypairPath} \\
  --oracleKey ${testEnvironment.oracle} \\
  --switchboardDir ${outputDir}`
      )
    );
  }

  async catch(error) {
    super.catch(error, "Failed to start localnet environment");
  }
}
