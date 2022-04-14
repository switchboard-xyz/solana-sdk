import { ProgramStateClass } from "../../accounts/state/state";
import BaseCommand from "../../BaseCommand";
import { loadAnchor } from "../../utils";

export default class MintPrint extends BaseCommand {
  static description = "print switchboard token mint address";

  static aliases = ["mint:print"];

  static flags = {
    ...BaseCommand.flags,
  };

  static examples = ["$ sbv2 print:mint"];

  async run() {
    const program = await loadAnchor(this.cluster, this.connection);
    const state = await ProgramStateClass.build(program);
    this.logger.log(state.prettyPrint());
    this.logger.log(`\r\n${state.prettyPrintTokenMint()}`);
  }
}
