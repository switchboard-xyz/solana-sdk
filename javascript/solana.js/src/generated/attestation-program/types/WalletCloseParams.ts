import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface WalletCloseParamsFields {}

export interface WalletCloseParamsJSON {}

export class WalletCloseParams {
  constructor(fields: WalletCloseParamsFields) {}

  static layout(property?: string) {
    return borsh.struct([], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new WalletCloseParams({});
  }

  static toEncodable(fields: WalletCloseParamsFields) {
    return {};
  }

  toJSON(): WalletCloseParamsJSON {
    return {};
  }

  static fromJSON(obj: WalletCloseParamsJSON): WalletCloseParams {
    return new WalletCloseParams({});
  }

  toEncodable() {
    return WalletCloseParams.toEncodable(this);
  }
}
