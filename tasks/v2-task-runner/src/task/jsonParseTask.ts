/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable new-cap */
import type * as anchor from "@project-serum/anchor";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import assert from "assert";
import Big from "big.js";
import { JSONPath } from "jsonpath-plus";
import { OracleContext, SwitchboardTask, SwitchboardTaskError } from "../types";

export class MissingAggregationMethodError extends SwitchboardTaskError {
  constructor(result: string) {
    const message = `When parsing more than 1 result from the JSON, an AggregationMethod should be provided to consolidate a final result:\r\n${result}`;
    super(message, "JsonParse");
  }
}

export class PathNotDefinedError extends SwitchboardTaskError {
  constructor() {
    super("Path is not defined", "JsonParse");
  }
}

export class PreviousResultNotDefinedError extends SwitchboardTaskError {
  constructor() {
    super("Previous result is needed to parse", "JsonParse");
  }
}

export class JsonParseTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    task: OracleJob.IJsonParseTask,
    input: string,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<Big> {
    const { path, aggregationMethod } = task;
    if (!path) {
      throw new PathNotDefinedError();
    } else if (!input) {
      throw new PreviousResultNotDefinedError();
    }

    // Return the resulting JSON from walking the path specified by this task.
    const result: Big[] = JSONPath({
      json: JSON.parse(input),
      path: path,
    }).map((value) => new Big(value));

    // console.log(`RESULT: ${JSON.stringify(result.map((r) => r.toString()))}`);

    switch (aggregationMethod) {
      case OracleJob.JsonParseTask.AggregationMethod.MIN:
        return result.reduce(
          (value, current) => (value.lt(current) ? value : current),
          result[0]
        );
      case OracleJob.JsonParseTask.AggregationMethod.MAX:
        return result.reduce(
          (value, current) => (value.gt(current) ? value : current),
          result[0]
        );
      case OracleJob.JsonParseTask.AggregationMethod.SUM:
        return result.reduce((sum, current) => sum.plus(current), new Big(0));
      default:
        if (result.length !== 1) {
          throw new MissingAggregationMethodError(JSON.stringify(result));
        }

        assert.ok(result[0]);
        return new Big(result[0]);
    }
  }
}
