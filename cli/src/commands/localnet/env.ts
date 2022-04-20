/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable unicorn/new-for-builtins */
import { flags } from "@oclif/command";
import { PublicKey } from "@solana/web3.js";
import {
  getPayer,
  SwitchboardTestEnvironment,
} from "@switchboard-xyz/switchboard-v2";
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
  };

  async run() {
    verifyProgramHasPayer(this.program);
    const { flags } = this.parse(LocalnetEnvironment);
    const payerKeypair = getPayer(this.program);

    // TODO: Check paths and force flags
    if (!flags.force) {
      if (fs.existsSync(path.join(process.cwd(), "switchboard.env"))) {
        throw new Error(
          "switchboard.env already exists, use --force to overwrite"
        );
      }
      if (fs.existsSync(path.join(process.cwd(), "switchboard.json"))) {
        throw new Error(
          "switchboard.json already exists, use --force to overwrite"
        );
      }
      if (fs.existsSync(path.join(process.cwd(), "start-local-validator.sh"))) {
        throw new Error(
          "start-local-validator.sh already exists, use --force to overwrite"
        );
      }
      if (fs.existsSync(path.join(process.cwd(), "start-oracle.sh"))) {
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
      }
    );
    // TODO: Add silent flag
    testEnvironment.writeAll(flags.keypair, process.cwd());
  }

  async catch(error) {
    super.catch(error, "Failed to create localnet test environment");
  }
}
