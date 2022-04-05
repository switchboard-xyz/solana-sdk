import type * as anchor from "@project-serum/anchor";
import type { OracleJob } from "@switchboard-xyz/v2-task-library";
import { OracleContext, SwitchboardTask, SwitchboardTaskError } from "../types";

export class GroupNumberError extends SwitchboardTaskError {
  constructor(groupNumber: number) {
    super(`group number "${groupNumber}" not found.`, "RegexExtract");
  }
}

export class RegexExtractTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    regexExtractTask: OracleJob.IRegexExtractTask,
    input: string,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<string> {
    const pattern = new RegExp(regexExtractTask.pattern ?? "");
    const matches = input.match(pattern) ?? [];
    // console.log(`MATCHES ${matches[1]}`);
    const groupNumber = regexExtractTask.groupNumber ?? 0;
    if (matches && groupNumber < matches.length) return matches[groupNumber];
    throw new GroupNumberError(groupNumber);
  }
}
