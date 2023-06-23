import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionUserCloseParamsFields {}

export interface FunctionUserCloseParamsJSON {}

export class FunctionUserCloseParams {
  constructor(fields: FunctionUserCloseParamsFields) {}

  static layout(property?: string) {
    return borsh.struct([], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionUserCloseParams({});
  }

  static toEncodable(fields: FunctionUserCloseParamsFields) {
    return {};
  }

  toJSON(): FunctionUserCloseParamsJSON {
    return {};
  }

  static fromJSON(obj: FunctionUserCloseParamsJSON): FunctionUserCloseParams {
    return new FunctionUserCloseParams({});
  }

  toEncodable() {
    return FunctionUserCloseParams.toEncodable(this);
  }
}
