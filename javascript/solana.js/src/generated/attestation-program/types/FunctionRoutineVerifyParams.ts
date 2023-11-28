import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionRoutineVerifyParamsFields {
  observedTime: BN;
  nextAllowedTimestamp: BN;
  errorCode: number;
  mrEnclave: Array<number>;
  containerParamsHash: Array<number>;
}

export interface FunctionRoutineVerifyParamsJSON {
  observedTime: string;
  nextAllowedTimestamp: string;
  errorCode: number;
  mrEnclave: Array<number>;
  containerParamsHash: Array<number>;
}

export class FunctionRoutineVerifyParams {
  readonly observedTime: BN;
  readonly nextAllowedTimestamp: BN;
  readonly errorCode: number;
  readonly mrEnclave: Array<number>;
  readonly containerParamsHash: Array<number>;

  constructor(fields: FunctionRoutineVerifyParamsFields) {
    this.observedTime = fields.observedTime;
    this.nextAllowedTimestamp = fields.nextAllowedTimestamp;
    this.errorCode = fields.errorCode;
    this.mrEnclave = fields.mrEnclave;
    this.containerParamsHash = fields.containerParamsHash;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.i64("observedTime"),
        borsh.i64("nextAllowedTimestamp"),
        borsh.u8("errorCode"),
        borsh.array(borsh.u8(), 32, "mrEnclave"),
        borsh.array(borsh.u8(), 32, "containerParamsHash"),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionRoutineVerifyParams({
      observedTime: obj.observedTime,
      nextAllowedTimestamp: obj.nextAllowedTimestamp,
      errorCode: obj.errorCode,
      mrEnclave: obj.mrEnclave,
      containerParamsHash: obj.containerParamsHash,
    });
  }

  static toEncodable(fields: FunctionRoutineVerifyParamsFields) {
    return {
      observedTime: fields.observedTime,
      nextAllowedTimestamp: fields.nextAllowedTimestamp,
      errorCode: fields.errorCode,
      mrEnclave: fields.mrEnclave,
      containerParamsHash: fields.containerParamsHash,
    };
  }

  toJSON(): FunctionRoutineVerifyParamsJSON {
    return {
      observedTime: this.observedTime.toString(),
      nextAllowedTimestamp: this.nextAllowedTimestamp.toString(),
      errorCode: this.errorCode,
      mrEnclave: this.mrEnclave,
      containerParamsHash: this.containerParamsHash,
    };
  }

  static fromJSON(
    obj: FunctionRoutineVerifyParamsJSON
  ): FunctionRoutineVerifyParams {
    return new FunctionRoutineVerifyParams({
      observedTime: new BN(obj.observedTime),
      nextAllowedTimestamp: new BN(obj.nextAllowedTimestamp),
      errorCode: obj.errorCode,
      mrEnclave: obj.mrEnclave,
      containerParamsHash: obj.containerParamsHash,
    });
  }

  toEncodable() {
    return FunctionRoutineVerifyParams.toEncodable(this);
  }
}
