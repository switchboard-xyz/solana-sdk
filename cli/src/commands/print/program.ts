import { prettyPrintProgramState } from "@switchboard-xyz/sbv2-utils";
import { ProgramStateAccount } from "@switchboard-xyz/switchboard-v2";
import BaseCommand from "../../BaseCommand";

export default class ProgramPrint extends BaseCommand {
  static description =
    "print the deserialized switchboard program state account";

  static aliases = ["program:print"];

  static flags = {
    ...BaseCommand.flags,
  };

  static examples = ["$ sbv2 program:print"];

  async run() {
    const [programState] = ProgramStateAccount.fromSeed(this.program);

    this.logger.log(
      await prettyPrintProgramState(programState, undefined, true, true)
    );
  }

  async catch(error) {
    super.catch(error, "failed to print program state account");
  }
}
