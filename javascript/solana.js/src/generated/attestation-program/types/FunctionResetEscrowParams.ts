import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionResetEscrowParamsFields {}

export interface FunctionResetEscrowParamsJSON {}

export class FunctionResetEscrowParams {
  constructor(fields: FunctionResetEscrowParamsFields) {}

  static layout(property?: string) {
    return borsh.struct([], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionResetEscrowParams({});
  }

  static toEncodable(fields: FunctionResetEscrowParamsFields) {
    return {};
  }

  toJSON(): FunctionResetEscrowParamsJSON {
    return {};
  }

  static fromJSON(
    obj: FunctionResetEscrowParamsJSON
  ): FunctionResetEscrowParams {
    return new FunctionResetEscrowParams({});
  }

  toEncodable() {
    return FunctionResetEscrowParams.toEncodable(this);
  }
}
