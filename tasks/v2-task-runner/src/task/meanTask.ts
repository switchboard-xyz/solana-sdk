import type * as anchor from "@project-serum/anchor";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import assert from "assert";
import Big from "big.js";
import TaskRunner from "../";
import { OracleContext, SwitchboardTask, SwitchboardTaskError } from "../types";
import * as BigUtil from "../utils/big";

export class MeanResultFailedError extends SwitchboardTaskError {
  constructor(result: string) {
    super(`failed to find mean of task ${result}`, "Mean");
  }
}

export class MeanTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    meanTask: OracleJob.IMeanTask,
    input: string,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<Big> {
    const items = await Promise.all([
      ...(meanTask.tasks ?? []).map<Promise<Big>>(async (task) => {
        const out = await TaskRunner.doTask(
          OracleJob.Task.create(task),
          input,
          program,
          context
        );
        assert.ok(out !== null);
        return new Big(out);
      }),
      ...(meanTask.jobs ?? []).map<Promise<Big>>(async (job) => {
        const { tasks } = OracleJob.create(job);
        const result = await TaskRunner.performTasks(tasks, program, context);
        if (result.isErr()) throw result.error;
        const out: Big = result.value;
        assert.ok(out !== null);
        return out;
      }),
    ]);

    if (items.length === 0) {
      throw new MeanResultFailedError(JSON.stringify(meanTask));
    }

    return BigUtil.safeDiv(
      // eslint-disable-next-line unicorn/no-array-reduce
      items.reduce((previous, current) => previous.add(current), new Big(0)),
      new Big(items.length)
    );
  }
}
