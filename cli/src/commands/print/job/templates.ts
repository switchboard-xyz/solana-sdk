import { Command } from "@oclif/command";
import chalk from "chalk";
import { TEMPLATE_SOURCES } from "../../../accounts/job";

export default class PrintJobTemplates extends Command {
  static description = "list available templates to build a job from";

  static aliases = ["job:print:templates"];

  async run() {
    for (const t of TEMPLATE_SOURCES) this.log("  - " + chalk.yellow(t));
  }
}
