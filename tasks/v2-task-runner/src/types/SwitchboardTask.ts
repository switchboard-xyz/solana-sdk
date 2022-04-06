/* eslint-disable @typescript-eslint/naming-convention */
import type * as anchor from "@project-serum/anchor";
import type { OracleJob } from "@switchboard-xyz/v2-task-library";
import type Big from "big.js";
import type { OracleContext } from ".";

export type ALL_TASK_TYPES =
  | OracleJob.IHttpTask
  | OracleJob.IJsonParseTask
  | OracleJob.IMedianTask
  | OracleJob.IMeanTask
  | OracleJob.IWebsocketTask
  | OracleJob.IDivideTask
  | OracleJob.IMultiplyTask
  | OracleJob.ILpTokenPriceTask
  | OracleJob.ILpExchangeRateTask
  | OracleJob.IConditionalTask
  | OracleJob.IValueTask
  | OracleJob.IMaxTask
  | OracleJob.IRegexExtractTask
  | OracleJob.IXStepPriceTask
  | OracleJob.IAddTask
  | OracleJob.ISubtractTask;

// Task need to be able to run other task to produce a result
export abstract class SwitchboardTask {
  abstract run(
    task: ALL_TASK_TYPES,
    input: Big | string | undefined,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<string | Big>;

  // common functions all task may need
  variableExpand(input: string, variables: any): string {
    let out = input;
    for (const key of Object.keys(variables)) {
      const regex = /^([\w-]+)$/;
      const is_valid_key = key.match(regex);
      if (!is_valid_key) {
        console.warn(`Warn: Invalid expansion key found: ${key}. Ignoring.`);
        continue;
      }

      const value = variables[key];
      out = out.replace("${" + key + "}", value);
    }

    return out;
  }
}
