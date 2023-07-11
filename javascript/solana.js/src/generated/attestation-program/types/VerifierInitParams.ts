import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VerifierInitParamsFields {}

export interface VerifierInitParamsJSON {}

export class VerifierInitParams {
  constructor(fields: VerifierInitParamsFields) {}

  static layout(property?: string) {
    return borsh.struct([], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new VerifierInitParams({});
  }

  static toEncodable(fields: VerifierInitParamsFields) {
    return {};
  }

  toJSON(): VerifierInitParamsJSON {
    return {};
  }

  static fromJSON(obj: VerifierInitParamsJSON): VerifierInitParams {
    return new VerifierInitParams({});
  }

  toEncodable() {
    return VerifierInitParams.toEncodable(this);
  }
}
