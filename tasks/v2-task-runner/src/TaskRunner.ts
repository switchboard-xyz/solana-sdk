/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable complexity */
import type * as anchor from "@project-serum/anchor";
import type { OracleJob } from "@switchboard-xyz/v2-task-library";
import Big from "big.js";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import {
  AddTask,
  AnchorFetchTask,
  ConditionalTask,
  DefiKingdomsTask,
  DivideTask,
  HttpTask,
  JsonParseTask,
  JupiterSwapTask,
  LendingRateTask,
  LpExchangeRateTask,
  LpTokenPriceTask,
  MangoPerpTask,
  MaxTask,
  MeanTask,
  MedianTask,
  MultiplyTask,
  OracleTask,
  PerpMarketTask,
  PowTask,
  RegexExtractTask,
  SerumSwapTask,
  SubtractTask,
  TwapTask,
  ValueTask,
  WebsocketTask,
} from "./task";
import { OracleContext, TaskNotFoundError } from "./types";

export default class TaskRunner {
  constructor() {} // to suppress no static only class error

  static async performTasks(
    tasks: OracleJob.ITask[],
    program: anchor.Program,
    context?: OracleContext
  ): Promise<ResultAsync<Big, Error>> {
    try {
      let result: Big | string = "";
      for await (const task of tasks) {
        result = await TaskRunner.doTask(task, result, program, context).catch(
          (error) => {
            throw new Error(error);
          }
        );
      }

      return await okAsync(new Big(result));
    } catch (error) {
      return errAsync(error);
    }
  }

  /** Perform a task recursively and return its result */
  static async doTask(
    task: OracleJob.ITask,
    input: Big | string | undefined,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<Big | string> {
    if (task.httpTask) {
      return new HttpTask().run(task.httpTask, undefined, program, context);
    }

    if (task.websocketTask) {
      return new WebsocketTask().run(
        task.websocketTask,
        undefined,
        program,
        context
      );
    }

    if (task.jsonParseTask) {
      return new JsonParseTask().run(
        task.jsonParseTask,
        input.toString(),
        program,
        context
      );
    }

    if (task.medianTask) {
      return new MedianTask().run(
        task.medianTask,
        input.toString(),
        program,
        context
      );
    }

    if (task.meanTask) {
      return new MeanTask().run(
        task.meanTask,
        input.toString(),
        program,
        context
      );
    }

    if (task.divideTask) {
      return new DivideTask().run(
        task.divideTask,
        new Big(input),
        program,
        context
      );
    }

    if (task.multiplyTask) {
      return new MultiplyTask().run(
        task.multiplyTask,
        new Big(input),
        program,
        context
      );
    }

    if (task.conditionalTask) {
      return new ConditionalTask().run(
        task.conditionalTask,
        input.toString(),
        program,
        context
      );
    }

    if (task.valueTask) {
      return new ValueTask().run(task.valueTask, undefined, program, context);
    }

    if (task.maxTask) {
      return new MaxTask().run(
        task.maxTask,
        input.toString(),
        program,
        context
      );
    }

    if (task.lpTokenPriceTask) {
      return new LpTokenPriceTask().run(
        task.lpTokenPriceTask,
        undefined,
        program,
        context
      );
    }

    if (task.lpExchangeRateTask) {
      return new LpExchangeRateTask().run(
        task.lpExchangeRateTask,
        undefined,
        program,
        context
      );
    }

    if (task.regexExtractTask) {
      return new RegexExtractTask().run(
        task.regexExtractTask,
        input.toString(),
        program,
        context
      );
    }

    if (task.addTask) {
      return new AddTask().run(task.addTask, new Big(input), program, context);
    }

    if (task.subtractTask) {
      return new SubtractTask().run(
        task.subtractTask,
        new Big(input),
        program,
        context
      );
    }

    if (task.twapTask) {
      return new TwapTask().run(task.twapTask, undefined, program, context);
    }

    if (task.serumSwapTask) {
      return new SerumSwapTask().run(
        task.serumSwapTask,
        undefined,
        program,
        context
      );
    }

    if (task.powTask) {
      return new PowTask().run(task.powTask, new Big(input), program, context);
    }

    if (task.lendingRateTask) {
      return new LendingRateTask().run(
        task.lendingRateTask,
        undefined,
        program,
        context
      );
    }

    if (task.mangoPerpMarketTask) {
      return new MangoPerpTask().run(
        task.mangoPerpMarketTask,
        undefined,
        program,
        context
      );
    }

    if (task.jupiterSwapTask) {
      return new JupiterSwapTask().run(
        task.jupiterSwapTask,
        undefined,
        program,
        context
      );
    }

    if (task.oracleTask) {
      return new OracleTask().run(task.oracleTask, undefined, program, context);
    }

    if (task.perpMarketTask) {
      return new PerpMarketTask().run(
        task.perpMarketTask,
        undefined,
        program,
        context
      );
    }

    if (task.anchorFetchTask) {
      return new AnchorFetchTask().run(
        task.anchorFetchTask,
        undefined,
        program,
        context
      );
    }

    if (task.defiKingdomsTask) {
      return new DefiKingdomsTask().run(
        task.defiKingdomsTask,
        undefined,
        program,
        context
      );
    }

    throw new TaskNotFoundError(JSON.stringify(task));
  }
}
