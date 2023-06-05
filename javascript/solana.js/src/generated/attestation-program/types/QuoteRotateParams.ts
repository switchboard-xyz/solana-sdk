import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuoteRotateParamsFields {
  registryKey: Array<number>;
}

export interface QuoteRotateParamsJSON {
  registryKey: Array<number>;
}

export class QuoteRotateParams {
  readonly registryKey: Array<number>;

  constructor(fields: QuoteRotateParamsFields) {
    this.registryKey = fields.registryKey;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.array(borsh.u8(), 64, "registryKey")], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new QuoteRotateParams({
      registryKey: obj.registryKey,
    });
  }

  static toEncodable(fields: QuoteRotateParamsFields) {
    return {
      registryKey: fields.registryKey,
    };
  }

  toJSON(): QuoteRotateParamsJSON {
    return {
      registryKey: this.registryKey,
    };
  }

  static fromJSON(obj: QuoteRotateParamsJSON): QuoteRotateParams {
    return new QuoteRotateParams({
      registryKey: obj.registryKey,
    });
  }

  toEncodable() {
    return QuoteRotateParams.toEncodable(this);
  }
}
