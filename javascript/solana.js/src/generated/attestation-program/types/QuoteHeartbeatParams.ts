import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuoteHeartbeatParamsFields {}

export interface QuoteHeartbeatParamsJSON {}

export class QuoteHeartbeatParams {
  constructor(fields: QuoteHeartbeatParamsFields) {}

  static layout(property?: string) {
    return borsh.struct([], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new QuoteHeartbeatParams({});
  }

  static toEncodable(fields: QuoteHeartbeatParamsFields) {
    return {};
  }

  toJSON(): QuoteHeartbeatParamsJSON {
    return {};
  }

  static fromJSON(obj: QuoteHeartbeatParamsJSON): QuoteHeartbeatParams {
    return new QuoteHeartbeatParams({});
  }

  toEncodable() {
    return QuoteHeartbeatParams.toEncodable(this);
  }
}
