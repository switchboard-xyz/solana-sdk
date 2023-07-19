import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionSetAuthorityParamsFields {}

export interface FunctionSetAuthorityParamsJSON {}

export class FunctionSetAuthorityParams {
  constructor(fields: FunctionSetAuthorityParamsFields) {}

  static layout(property?: string) {
    return borsh.struct([], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionSetAuthorityParams({});
  }

  static toEncodable(fields: FunctionSetAuthorityParamsFields) {
    return {};
  }

  toJSON(): FunctionSetAuthorityParamsJSON {
    return {};
  }

  static fromJSON(
    obj: FunctionSetAuthorityParamsJSON
  ): FunctionSetAuthorityParams {
    return new FunctionSetAuthorityParams({});
  }

  toEncodable() {
    return FunctionSetAuthorityParams.toEncodable(this);
  }
}
