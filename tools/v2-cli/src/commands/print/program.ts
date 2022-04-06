import { ProgramStateClass } from "../../accounts/state/state";
import BaseCommand from "../../BaseCommand";
import { loadAnchor } from "../../utils";

export default class ProgramPrint extends BaseCommand {
  static description =
    "print the deserialized switchboard program state account";

  static aliases = ["program:print"];

  static flags = {
    ...BaseCommand.flags,
  };

  static examples = ["$ sbv2 program:print"];

  async run() {
    const program = await loadAnchor(this.cluster, this.connection);
    const state = await ProgramStateClass.build(program);
    this.logger.log(state.prettyPrint());
  }

  async catch(error) {
    super.catch(error, "failed to print program state account");
  }
}
