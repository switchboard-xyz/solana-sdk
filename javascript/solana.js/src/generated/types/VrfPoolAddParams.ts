import { SwitchboardProgram } from "../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VrfPoolAddParamsFields {}

export interface VrfPoolAddParamsJSON {}

export class VrfPoolAddParams {
  constructor(fields: VrfPoolAddParamsFields) {}

  static layout(property?: string) {
    return borsh.struct([], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new VrfPoolAddParams({});
  }

  static toEncodable(fields: VrfPoolAddParamsFields) {
    return {};
  }

  toJSON(): VrfPoolAddParamsJSON {
    return {};
  }

  static fromJSON(obj: VrfPoolAddParamsJSON): VrfPoolAddParams {
    return new VrfPoolAddParams({});
  }

  toEncodable() {
    return VrfPoolAddParams.toEncodable(this);
  }
}
