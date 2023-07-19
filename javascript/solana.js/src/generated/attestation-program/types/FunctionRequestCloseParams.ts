import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionRequestCloseParamsFields {}

export interface FunctionRequestCloseParamsJSON {}

export class FunctionRequestCloseParams {
  constructor(fields: FunctionRequestCloseParamsFields) {}

  static layout(property?: string) {
    return borsh.struct([], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionRequestCloseParams({});
  }

  static toEncodable(fields: FunctionRequestCloseParamsFields) {
    return {};
  }

  toJSON(): FunctionRequestCloseParamsJSON {
    return {};
  }

  static fromJSON(
    obj: FunctionRequestCloseParamsJSON
  ): FunctionRequestCloseParams {
    return new FunctionRequestCloseParams({});
  }

  toEncodable() {
    return FunctionRequestCloseParams.toEncodable(this);
  }
}
