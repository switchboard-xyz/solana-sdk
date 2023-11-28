import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionVerifyParamsFields {
  observedTime: BN;
  nextAllowedTimestamp: BN;
  errorCode: number;
  mrEnclave: Array<number>;
}

export interface FunctionVerifyParamsJSON {
  observedTime: string;
  nextAllowedTimestamp: string;
  errorCode: number;
  mrEnclave: Array<number>;
}

export class FunctionVerifyParams {
  readonly observedTime: BN;
  readonly nextAllowedTimestamp: BN;
  readonly errorCode: number;
  readonly mrEnclave: Array<number>;

  constructor(fields: FunctionVerifyParamsFields) {
    this.observedTime = fields.observedTime;
    this.nextAllowedTimestamp = fields.nextAllowedTimestamp;
    this.errorCode = fields.errorCode;
    this.mrEnclave = fields.mrEnclave;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.i64("observedTime"),
        borsh.i64("nextAllowedTimestamp"),
        borsh.u8("errorCode"),
        borsh.array(borsh.u8(), 32, "mrEnclave"),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionVerifyParams({
      observedTime: obj.observedTime,
      nextAllowedTimestamp: obj.nextAllowedTimestamp,
      errorCode: obj.errorCode,
      mrEnclave: obj.mrEnclave,
    });
  }

  static toEncodable(fields: FunctionVerifyParamsFields) {
    return {
      observedTime: fields.observedTime,
      nextAllowedTimestamp: fields.nextAllowedTimestamp,
      errorCode: fields.errorCode,
      mrEnclave: fields.mrEnclave,
    };
  }

  toJSON(): FunctionVerifyParamsJSON {
    return {
      observedTime: this.observedTime.toString(),
      nextAllowedTimestamp: this.nextAllowedTimestamp.toString(),
      errorCode: this.errorCode,
      mrEnclave: this.mrEnclave,
    };
  }

  static fromJSON(obj: FunctionVerifyParamsJSON): FunctionVerifyParams {
    return new FunctionVerifyParams({
      observedTime: new BN(obj.observedTime),
      nextAllowedTimestamp: new BN(obj.nextAllowedTimestamp),
      errorCode: obj.errorCode,
      mrEnclave: obj.mrEnclave,
    });
  }

  toEncodable() {
    return FunctionVerifyParams.toEncodable(this);
  }
}
