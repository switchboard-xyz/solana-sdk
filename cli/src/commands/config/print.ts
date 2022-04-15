import chalk from "chalk";
import { chalkString } from "../../accounts/utils";
import BaseCommand from "../../BaseCommand";

export default class ConfigPrint extends BaseCommand {
  static description = "print cli config";

  static flags = {
    ...BaseCommand.flags,
  };

  static examples = ["$ sbv2 config:print"];

  async run() {
    const { devnet, mainnet } = this.cliConfig;
    this.log(chalk.underline(chalk.blue("## Mainnet-Beta".padEnd(16))), "info");
    this.log(chalkString("mainnet-rpc", mainnet.rpcUrl || "N/A"), "info");
    this.log(chalk.underline(chalk.blue("## Devnet".padEnd(16))), "info");
    this.log(chalkString("devnet-rpc", devnet.rpcUrl || "N/A"), "info");
  }
}
