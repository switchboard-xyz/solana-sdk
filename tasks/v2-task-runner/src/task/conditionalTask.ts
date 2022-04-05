import type * as anchor from "@project-serum/anchor";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import Big from "big.js";
import TaskRunner from "../";
import { OracleContext, SwitchboardTask, SwitchboardTaskError } from "../types";

export class NoAttemptTaskError extends SwitchboardTaskError {
  constructor() {
    super(`no 'attempt' tasks provided`, "Conditional");
  }
}

export class NoOnFailureTaskError extends SwitchboardTaskError {
  constructor() {
    super(`no 'onFailure' tasks provided`, "Conditional");
  }
}

export class ConditionalTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    iTask: OracleJob.IConditionalTask,
    input: Big | string,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<Big> {
    const conditionalTask = OracleJob.ConditionalTask.create(iTask);

    if (conditionalTask.attempt === undefined) throw new NoAttemptTaskError();
    if (conditionalTask.onFailure === undefined)
      throw new NoOnFailureTaskError();

    // Runs a list of tasks in an effort to produce a numeric output.
    const runTasks = async (tasks: OracleJob.Task[]): Promise<Big> => {
      let result: Big | string = input;
      for await (const task of tasks) {
        result = await TaskRunner.doTask(
          OracleJob.Task.create(task),
          result,
          program,
          context
        );
      }

      return new Big(result);
    };

    let response: Big;
    try {
      // Try to produce an acceptable response using the `attempt` subtasks.
      response = await runTasks(
        conditionalTask.attempt.map((element) => OracleJob.Task.create(element))
      );
    } catch {
      // If `attempt` subtasks don't produce an acceptable response, try the `onFailure` subtasks.
      response = await runTasks(
        conditionalTask.onFailure.map((element) =>
          OracleJob.Task.create(element)
        )
      );
    }

    return response;
  }
}
