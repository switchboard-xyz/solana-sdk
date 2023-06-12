import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuoteInitParamsFields {}

export interface QuoteInitParamsJSON {}

export class QuoteInitParams {
  constructor(fields: QuoteInitParamsFields) {}

  static layout(property?: string) {
    return borsh.struct([], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new QuoteInitParams({});
  }

  static toEncodable(fields: QuoteInitParamsFields) {
    return {};
  }

  toJSON(): QuoteInitParamsJSON {
    return {};
  }

  static fromJSON(obj: QuoteInitParamsJSON): QuoteInitParams {
    return new QuoteInitParams({});
  }

  toEncodable() {
    return QuoteInitParams.toEncodable(this);
  }
}
