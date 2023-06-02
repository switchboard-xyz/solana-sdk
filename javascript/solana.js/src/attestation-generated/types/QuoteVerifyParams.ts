import { SwitchboardProgram } from "../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuoteVerifyParamsFields {
  timestamp: BN;
  mrEnclave: Array<number>;
  idx: number;
}

export interface QuoteVerifyParamsJSON {
  timestamp: string;
  mrEnclave: Array<number>;
  idx: number;
}

export class QuoteVerifyParams {
  readonly timestamp: BN;
  readonly mrEnclave: Array<number>;
  readonly idx: number;

  constructor(fields: QuoteVerifyParamsFields) {
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
    return new QuoteVerifyParams({
      timestamp: obj.timestamp,
      mrEnclave: obj.mrEnclave,
      idx: obj.idx,
    });
  }

  static toEncodable(fields: QuoteVerifyParamsFields) {
    return {
      timestamp: fields.timestamp,
      mrEnclave: fields.mrEnclave,
      idx: fields.idx,
    };
  }

  toJSON(): QuoteVerifyParamsJSON {
    return {
      timestamp: this.timestamp.toString(),
      mrEnclave: this.mrEnclave,
      idx: this.idx,
    };
  }

  static fromJSON(obj: QuoteVerifyParamsJSON): QuoteVerifyParams {
    return new QuoteVerifyParams({
      timestamp: new BN(obj.timestamp),
      mrEnclave: obj.mrEnclave,
      idx: obj.idx,
    });
  }

  toEncodable() {
    return QuoteVerifyParams.toEncodable(this);
  }
}
