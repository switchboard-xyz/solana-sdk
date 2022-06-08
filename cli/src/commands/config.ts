import { Flags } from "@oclif/core";
import BaseCommand from "../BaseCommand";
import OracleDeposit from "./oracle/deposit";
import OracleWithdraw from "./oracle/withdraw";

export default class Config extends BaseCommand {
  static hidden = true; // not ready yet

  baseCommand: string;

  flags: any;

  passThroughArguments: string[];

  static description = "run a cli command using your saved configuration";

  static flags = {
    ...BaseCommand.flags,
    pubkey: Flags.string({
      description:
        "command specific. override default account with provided public key",
    }),
  };

  static args = [
    {
      name: "baseCommand",
      required: true,
      description: "base command to run",
    },
    {
      name: "passThroughArguments",
      required: false,
      description: "pass through arguements for baseCommand",
    }, // documentation purposes
  ];

  static strict = false;

  async init() {
    await super.init();
    const { args, flags, argv } = await this.parse(Config);
    this.passThroughArguments = argv.slice(1);
    this.baseCommand = args.baseCommand;
    this.flags = flags;
  }

  async run() {
    switch (this.baseCommand) {
      case "oracle:withdraw": {
        await OracleWithdraw.run(this.passThroughArguments);
        break;
      }

      case "oracle:deposit": {
        await OracleDeposit.run(this.passThroughArguments);
        break;
      }
    }
  }
}
