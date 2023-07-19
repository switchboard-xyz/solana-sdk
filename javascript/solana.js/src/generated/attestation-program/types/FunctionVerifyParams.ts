import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionVerifyParamsFields {
  observedTime: BN;
  nextAllowedTimestamp: BN;
  isFailure: boolean;
  mrEnclave: Array<number>;
}

export interface FunctionVerifyParamsJSON {
  observedTime: string;
  nextAllowedTimestamp: string;
  isFailure: boolean;
  mrEnclave: Array<number>;
}

export class FunctionVerifyParams {
  readonly observedTime: BN;
  readonly nextAllowedTimestamp: BN;
  readonly isFailure: boolean;
  readonly mrEnclave: Array<number>;

  constructor(fields: FunctionVerifyParamsFields) {
    this.observedTime = fields.observedTime;
    this.nextAllowedTimestamp = fields.nextAllowedTimestamp;
    this.isFailure = fields.isFailure;
    this.mrEnclave = fields.mrEnclave;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.i64("observedTime"),
        borsh.i64("nextAllowedTimestamp"),
        borsh.bool("isFailure"),
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
      isFailure: obj.isFailure,
      mrEnclave: obj.mrEnclave,
    });
  }

  static toEncodable(fields: FunctionVerifyParamsFields) {
    return {
      observedTime: fields.observedTime,
      nextAllowedTimestamp: fields.nextAllowedTimestamp,
      isFailure: fields.isFailure,
      mrEnclave: fields.mrEnclave,
    };
  }

  toJSON(): FunctionVerifyParamsJSON {
    return {
      observedTime: this.observedTime.toString(),
      nextAllowedTimestamp: this.nextAllowedTimestamp.toString(),
      isFailure: this.isFailure,
      mrEnclave: this.mrEnclave,
    };
  }

  static fromJSON(obj: FunctionVerifyParamsJSON): FunctionVerifyParams {
    return new FunctionVerifyParams({
      observedTime: new BN(obj.observedTime),
      nextAllowedTimestamp: new BN(obj.nextAllowedTimestamp),
      isFailure: obj.isFailure,
      mrEnclave: obj.mrEnclave,
    });
  }

  toEncodable() {
    return FunctionVerifyParams.toEncodable(this);
  }
}
