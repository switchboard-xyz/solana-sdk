import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh";

export interface VrfLiteCloseParamsFields {}

export interface VrfLiteCloseParamsJSON {}

export class VrfLiteCloseParams {
  constructor(fields: VrfLiteCloseParamsFields) {}

  static layout(property?: string) {
    return borsh.struct([], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new VrfLiteCloseParams({});
  }

  static toEncodable(fields: VrfLiteCloseParamsFields) {
    return {};
  }

  toJSON(): VrfLiteCloseParamsJSON {
    return {};
  }

  static fromJSON(obj: VrfLiteCloseParamsJSON): VrfLiteCloseParams {
    return new VrfLiteCloseParams({});
  }

  toEncodable() {
    return VrfLiteCloseParams.toEncodable(this);
  }
}
