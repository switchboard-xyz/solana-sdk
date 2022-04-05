import type * as anchor from "@project-serum/anchor";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import Big from "big.js";
import TaskRunner from "../";
import { OracleContext, SwitchboardTask, SwitchboardTaskError } from "../types";
import * as BigUtil from "../utils/big";

export class MedianResultFailedError extends SwitchboardTaskError {
  constructor(result: string) {
    super(`failed to find median of task ${result}`, "Median");
  }
}

export class MedianEmptyArrayError extends SwitchboardTaskError {
  constructor() {
    super("cannot take median of empty array", "Median");
  }
}

export class MedianTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    medianTaskI: OracleJob.IMedianTask,
    input: string,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<Big> {
    const medianTask = OracleJob.MedianTask.create(medianTaskI);
    const items = await Promise.all([
      ...(medianTask.tasks ?? []).map(async (task, index) => {
        try {
          return new Big(
            await TaskRunner.doTask(task, input, program, context)
          );
        } catch {}
      }),
      ...(medianTask.jobs ?? []).map(async (job, index) => {
        try {
          const result = await TaskRunner.performTasks(
            job.tasks,
            program,
            context
          );
          if (result.isErr()) throw result.error;
          return result.value;
        } catch {}
      }),
    ]).then((results) =>
      results
        .filter((result) => result !== null)
        .map((result) => new Big(result ?? 0))
    );
    if (items.length < medianTask.minSuccessfulRequired) {
      throw new Error(
        `MedianTask: Need at least ${medianTask.minSuccessfulRequired} successful results, actual ${items.length}`
      );
    }

    const arraySort = [...items].sort();
    const mid = Math.ceil(items.length / 2);
    const med =
      items.length % 2 === 0
        ? BigUtil.safeDiv(arraySort[mid].add(arraySort[mid - 1]), new Big(2))
        : arraySort[mid - 1];

    if (!med) {
      throw new MedianResultFailedError(JSON.stringify(medianTask));
    }

    return med;
  }
}
