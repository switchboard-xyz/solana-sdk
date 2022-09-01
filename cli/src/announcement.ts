import chalk from "chalk";
// import { WARNING_ICON } from "./utils";

export const CURRENT_ANNOUNCEMENT = `${chalk.bgYellowBright(
  chalk.bold(`WARNING`)
)}\n${chalk.blue(
  `This package has been deprecated in favor of @switchboard-xyz/cli. Run the following commands to update:`
)}\n${`\tnpm uninstall -g @switchboard-xyz/switchboardv2-cli\n\tnpm install   -g @switchboard-xyz/cli`}\nor\n\tyarn global remove @switchboard-xyz/switchboardv2-cli\n\tyarn global    add @switchboard-xyz/cli\n`;
