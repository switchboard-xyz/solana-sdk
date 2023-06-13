import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionTriggerParamsFields {}

export interface FunctionTriggerParamsJSON {}

export class FunctionTriggerParams {
  constructor(fields: FunctionTriggerParamsFields) {}

  static layout(property?: string) {
    return borsh.struct([], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionTriggerParams({});
  }

  static toEncodable(fields: FunctionTriggerParamsFields) {
    return {};
  }

  toJSON(): FunctionTriggerParamsJSON {
    return {};
  }

  static fromJSON(obj: FunctionTriggerParamsJSON): FunctionTriggerParams {
    return new FunctionTriggerParams({});
  }

  toEncodable() {
    return FunctionTriggerParams.toEncodable(this);
  }
}
