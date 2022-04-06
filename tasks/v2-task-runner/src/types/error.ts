/* eslint-disable @typescript-eslint/naming-convention */
export type TASK_TYPE =
  | "LpExchangeRate"
  | "LpTokenPrice"
  | "JsonParse"
  | "Http"
  | "Websocket"
  | "Median"
  | "Mean"
  | "Divide"
  | "Multiply"
  | "Conditional"
  | "Value"
  | "Max"
  | "RegexExtract"
  | "XStep"
  | "Add"
  | "Subtract"
  | "Aleph"
  | "Twap"
  | "SerumSwap"
  | "Power"
  | "LendingRate"
  | "MangoPerp"
  | "JupiterSwap"
  | "Oracle"
  | "PerpMarket"
  | "DefiKingdoms";

export abstract class SwitchboardTaskError extends Error {
  task: TASK_TYPE;

  constructor(m: string, task?: TASK_TYPE) {
    super(m);
    this.task = task;
    this.name = this.task ? `${this.task}TaskError` : "SwitchboardTaskError";
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SwitchboardTaskError.prototype);
  }

  override toString(): string {
    if (this.name) return `${this.name}: ${this.message}`;
    return `${this.message}`;
  }
}

export class TaskNotFoundError extends SwitchboardTaskError {
  constructor(task: string) {
    super(`failed to parse task ${task}`);
  }
}
