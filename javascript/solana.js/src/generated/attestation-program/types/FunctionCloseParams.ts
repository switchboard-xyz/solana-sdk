import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionCloseParamsFields {}

export interface FunctionCloseParamsJSON {}

export class FunctionCloseParams {
  constructor(fields: FunctionCloseParamsFields) {}

  static layout(property?: string) {
    return borsh.struct([], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionCloseParams({});
  }

  static toEncodable(fields: FunctionCloseParamsFields) {
    return {};
  }

  toJSON(): FunctionCloseParamsJSON {
    return {};
  }

  static fromJSON(obj: FunctionCloseParamsJSON): FunctionCloseParams {
    return new FunctionCloseParams({});
  }

  toEncodable() {
    return FunctionCloseParams.toEncodable(this);
  }
}
