import { SwitchboardProgram } from "../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface StateInitParamsFields {}

export interface StateInitParamsJSON {}

export class StateInitParams {
  constructor(fields: StateInitParamsFields) {}

  static layout(property?: string) {
    return borsh.struct([], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new StateInitParams({});
  }

  static toEncodable(fields: StateInitParamsFields) {
    return {};
  }

  toJSON(): StateInitParamsJSON {
    return {};
  }

  static fromJSON(obj: StateInitParamsJSON): StateInitParams {
    return new StateInitParams({});
  }

  toEncodable() {
    return StateInitParams.toEncodable(this);
  }
}
