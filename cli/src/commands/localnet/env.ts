/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable unicorn/new-for-builtins */
import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import { SwitchboardTestEnvironment } from "@switchboard-xyz/sbv2-utils";
import { programWallet } from "@switchboard-xyz/switchboard-v2";
import * as fs from "fs";
import * as path from "path";
import BaseCommand from "../../BaseCommand";
import { verifyProgramHasPayer } from "../../utils";

export default class LocalnetEnvironment extends BaseCommand {
  static description = "create a localnet switchboard environment";

  static flags = {
    ...BaseCommand.flags,
    force: flags.boolean({
      description: "overwrite output file if existing",
      default: false,
    }),
    outputDir: flags.string({
      char: "o",
      description: "output directory for scripts",
    }),
  };

  async run() {
    verifyProgramHasPayer(this.program);
    const { flags } = this.parse(LocalnetEnvironment);
    const payerKeypair = programWallet(this.program);

    const outputDir = flags.outputDir
      ? path.join(process.cwd(), flags.outputDir)
      : process.cwd();

    // TODO: Check paths and force flags
    if (!flags.force) {
      if (fs.existsSync(path.join(outputDir, "switchboard.env"))) {
        throw new Error(
          "switchboard.env already exists, use --force to overwrite"
        );
      }
      if (fs.existsSync(path.join(outputDir, "switchboard.json"))) {
        throw new Error(
          "switchboard.json already exists, use --force to overwrite"
        );
      }
      if (fs.existsSync(path.join(outputDir, "start-local-validator.sh"))) {
        throw new Error(
          "start-local-validator.sh already exists, use --force to overwrite"
        );
      }
      if (fs.existsSync(path.join(outputDir, "start-oracle.sh"))) {
        throw new Error(
          "start-oracle.sh already exists, use --force to overwrite"
        );
      }
      if (
        fs.existsSync(
          path.join(process.cwd(), "docker-compose.switchboard.yml")
        )
      ) {
        throw new Error(
          "start-oracle.sh already exists, use --force to overwrite"
        );
      }
    }

    // TODO: Add silent flag
    // TODO: Pass keypair path and add as env variable
    const testEnvironment = await SwitchboardTestEnvironment.create(
      payerKeypair,
      {
        USDC_MINT: new PublicKey(
          "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
        ),
      },
      flags.programId ? this.program.programId : undefined
    );
    // TODO: Add silent flag
    fs.mkdirSync(outputDir, { recursive: true });
    testEnvironment.writeAll(flags.keypair, outputDir);
  }

  async catch(error) {
    super.catch(error, "Failed to create localnet test environment");
  }
}
