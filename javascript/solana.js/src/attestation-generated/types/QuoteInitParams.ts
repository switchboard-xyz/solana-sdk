import { SwitchboardProgram } from "../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuoteInitParamsFields {
  registryKey: Array<number>;
}

export interface QuoteInitParamsJSON {
  registryKey: Array<number>;
}

export class QuoteInitParams {
  readonly registryKey: Array<number>;

  constructor(fields: QuoteInitParamsFields) {
    this.registryKey = fields.registryKey;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.array(borsh.u8(), 64, "registryKey")], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new QuoteInitParams({
      registryKey: obj.registryKey,
    });
  }

  static toEncodable(fields: QuoteInitParamsFields) {
    return {
      registryKey: fields.registryKey,
    };
  }

  toJSON(): QuoteInitParamsJSON {
    return {
      registryKey: this.registryKey,
    };
  }

  static fromJSON(obj: QuoteInitParamsJSON): QuoteInitParams {
    return new QuoteInitParams({
      registryKey: obj.registryKey,
    });
  }

  toEncodable() {
    return QuoteInitParams.toEncodable(this);
  }
}
