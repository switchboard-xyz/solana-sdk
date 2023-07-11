import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VerifierQuoteVerifyParamsFields {
  timestamp: BN;
  mrEnclave: Array<number>;
  idx: number;
}

export interface VerifierQuoteVerifyParamsJSON {
  timestamp: string;
  mrEnclave: Array<number>;
  idx: number;
}

export class VerifierQuoteVerifyParams {
  readonly timestamp: BN;
  readonly mrEnclave: Array<number>;
  readonly idx: number;

  constructor(fields: VerifierQuoteVerifyParamsFields) {
    this.timestamp = fields.timestamp;
    this.mrEnclave = fields.mrEnclave;
    this.idx = fields.idx;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.i64("timestamp"),
        borsh.array(borsh.u8(), 32, "mrEnclave"),
        borsh.u32("idx"),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new VerifierQuoteVerifyParams({
      timestamp: obj.timestamp,
      mrEnclave: obj.mrEnclave,
      idx: obj.idx,
    });
  }

  static toEncodable(fields: VerifierQuoteVerifyParamsFields) {
    return {
      timestamp: fields.timestamp,
      mrEnclave: fields.mrEnclave,
      idx: fields.idx,
    };
  }

  toJSON(): VerifierQuoteVerifyParamsJSON {
    return {
      timestamp: this.timestamp.toString(),
      mrEnclave: this.mrEnclave,
      idx: this.idx,
    };
  }

  static fromJSON(
    obj: VerifierQuoteVerifyParamsJSON
  ): VerifierQuoteVerifyParams {
    return new VerifierQuoteVerifyParams({
      timestamp: new BN(obj.timestamp),
      mrEnclave: obj.mrEnclave,
      idx: obj.idx,
    });
  }

  toEncodable() {
    return VerifierQuoteVerifyParams.toEncodable(this);
  }
}
