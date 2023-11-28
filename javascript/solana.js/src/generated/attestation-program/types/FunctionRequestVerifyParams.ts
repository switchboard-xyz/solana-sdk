import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionRequestVerifyParamsFields {
  observedTime: BN;
  errorCode: number;
  mrEnclave: Array<number>;
  requestSlot: BN;
  containerParamsHash: Array<number>;
}

export interface FunctionRequestVerifyParamsJSON {
  observedTime: string;
  errorCode: number;
  mrEnclave: Array<number>;
  requestSlot: string;
  containerParamsHash: Array<number>;
}

export class FunctionRequestVerifyParams {
  readonly observedTime: BN;
  readonly errorCode: number;
  readonly mrEnclave: Array<number>;
  readonly requestSlot: BN;
  readonly containerParamsHash: Array<number>;

  constructor(fields: FunctionRequestVerifyParamsFields) {
    this.observedTime = fields.observedTime;
    this.errorCode = fields.errorCode;
    this.mrEnclave = fields.mrEnclave;
    this.requestSlot = fields.requestSlot;
    this.containerParamsHash = fields.containerParamsHash;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.i64("observedTime"),
        borsh.u8("errorCode"),
        borsh.array(borsh.u8(), 32, "mrEnclave"),
        borsh.u64("requestSlot"),
        borsh.array(borsh.u8(), 32, "containerParamsHash"),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionRequestVerifyParams({
      observedTime: obj.observedTime,
      errorCode: obj.errorCode,
      mrEnclave: obj.mrEnclave,
      requestSlot: obj.requestSlot,
      containerParamsHash: obj.containerParamsHash,
    });
  }

  static toEncodable(fields: FunctionRequestVerifyParamsFields) {
    return {
      observedTime: fields.observedTime,
      errorCode: fields.errorCode,
      mrEnclave: fields.mrEnclave,
      requestSlot: fields.requestSlot,
      containerParamsHash: fields.containerParamsHash,
    };
  }

  toJSON(): FunctionRequestVerifyParamsJSON {
    return {
      observedTime: this.observedTime.toString(),
      errorCode: this.errorCode,
      mrEnclave: this.mrEnclave,
      requestSlot: this.requestSlot.toString(),
      containerParamsHash: this.containerParamsHash,
    };
  }

  static fromJSON(
    obj: FunctionRequestVerifyParamsJSON
  ): FunctionRequestVerifyParams {
    return new FunctionRequestVerifyParams({
      observedTime: new BN(obj.observedTime),
      errorCode: obj.errorCode,
      mrEnclave: obj.mrEnclave,
      requestSlot: new BN(obj.requestSlot),
      containerParamsHash: obj.containerParamsHash,
    });
  }

  toEncodable() {
    return FunctionRequestVerifyParams.toEncodable(this);
  }
}
