import type * as anchor from "@project-serum/anchor";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import Big from "big.js";
import TaskRunner from "../";
import { OracleContext, SwitchboardTask, SwitchboardTaskError } from "../types";

export class MaxTaskFailedError extends SwitchboardTaskError {
  constructor(maxTask: OracleJob.IMaxTask) {
    super(`failed to find max of task ${JSON.stringify(maxTask)}`, "Max");
  }
}

export class MaxTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    maxTask: OracleJob.IMaxTask,
    input: string,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<Big> {
    const items = await Promise.all([
      ...(maxTask.tasks ?? []).map<Promise<Big>>(async (task) => {
        const out: Big = new Big(
          await TaskRunner.doTask(
            OracleJob.Task.create(task),
            input,
            program,
            context
          )
        );
        return out;
      }),
      ...(maxTask.jobs ?? []).map<Promise<Big>>(async (job) => {
        const { tasks } = OracleJob.create(job);
        const result = await TaskRunner.performTasks(tasks, program, context);
        if (result.isErr()) throw result.error;
        const out: Big = result.value;
        return out;
      }),
    ]);
    if (items.length === 0) {
      throw new MaxTaskFailedError(maxTask);
    }

    // eslint-disable-next-line unicorn/no-array-reduce
    return items.reduce(
      (value, current) => (value.gt(current) ? value : current),
      items[0]
    );
  }
}
