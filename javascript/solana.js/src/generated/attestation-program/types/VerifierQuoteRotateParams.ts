import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VerifierQuoteRotateParamsFields {
  registryKey: Array<number>;
}

export interface VerifierQuoteRotateParamsJSON {
  registryKey: Array<number>;
}

export class VerifierQuoteRotateParams {
  readonly registryKey: Array<number>;

  constructor(fields: VerifierQuoteRotateParamsFields) {
    this.registryKey = fields.registryKey;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.array(borsh.u8(), 64, "registryKey")], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new VerifierQuoteRotateParams({
      registryKey: obj.registryKey,
    });
  }

  static toEncodable(fields: VerifierQuoteRotateParamsFields) {
    return {
      registryKey: fields.registryKey,
    };
  }

  toJSON(): VerifierQuoteRotateParamsJSON {
    return {
      registryKey: this.registryKey,
    };
  }

  static fromJSON(
    obj: VerifierQuoteRotateParamsJSON
  ): VerifierQuoteRotateParams {
    return new VerifierQuoteRotateParams({
      registryKey: obj.registryKey,
    });
  }

  toEncodable() {
    return VerifierQuoteRotateParams.toEncodable(this);
  }
}
