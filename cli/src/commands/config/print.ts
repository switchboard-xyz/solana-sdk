import { chalkString } from "@switchboard-xyz/sbv2-utils";
import chalk from "chalk";
import BaseCommand from "../../BaseCommand";

export default class ConfigPrint extends BaseCommand {
  static description = "print cli config";

  static alias = ["config get"];

  static flags = {
    ...BaseCommand.flags,
  };

  static examples = ["$ sbv2 config:print"];

  async run() {
    const { devnet, mainnet } = this.cliConfig;
    this.log(chalk.underline(chalk.blue("## Mainnet-Beta".padEnd(16))));
    this.log(chalkString("mainnet-rpc", mainnet.rpcUrl || "N/A"));
    this.log(chalk.underline(chalk.blue("## Devnet".padEnd(16))));
    this.log(chalkString("devnet-rpc", devnet.rpcUrl || "N/A"));
  }
}
