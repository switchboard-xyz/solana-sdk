import { PublicKey } from "@solana/web3.js";
import { prettyPrintCrank } from "@switchboard-xyz/sbv2-utils";
import { CrankAccount } from "@switchboard-xyz/switchboard-v2";
import BaseCommand from "../../BaseCommand";

export default class CrankPrint extends BaseCommand {
  outputFile?: string;

  static description = "print deserialized switchboard crank account";

  static aliases = ["crank:print"];

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "crankKey",
      description: "public key of the crank account to deserialize",
    },
  ];

  static examples = [
    "$ sbv2 crank:print 85L2cFUvXaeGQ4HrzP8RJEVCL7WvRrXM2msvEmQ82AVr",
  ];

  async run() {
    const { args, flags } = await this.parse(CrankPrint);

    const crankAccount = new CrankAccount({
      program: this.program,
      publicKey: new PublicKey(args.crankKey),
    });

    this.logger.log(await prettyPrintCrank(crankAccount, undefined, true));
  }

  async catch(error) {
    super.catch(error, "failed to print crank account");
  }
}
