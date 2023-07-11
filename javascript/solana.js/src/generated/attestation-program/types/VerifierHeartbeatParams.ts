import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VerifierHeartbeatParamsFields {}

export interface VerifierHeartbeatParamsJSON {}

export class VerifierHeartbeatParams {
  constructor(fields: VerifierHeartbeatParamsFields) {}

  static layout(property?: string) {
    return borsh.struct([], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new VerifierHeartbeatParams({});
  }

  static toEncodable(fields: VerifierHeartbeatParamsFields) {
    return {};
  }

  toJSON(): VerifierHeartbeatParamsJSON {
    return {};
  }

  static fromJSON(obj: VerifierHeartbeatParamsJSON): VerifierHeartbeatParams {
    return new VerifierHeartbeatParams({});
  }

  toEncodable() {
    return VerifierHeartbeatParams.toEncodable(this);
  }
}
