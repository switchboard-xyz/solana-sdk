import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionRequestInitParamsFields {
  maxContainerParamsLen: number | null;
  containerParams: Uint8Array;
}

export interface FunctionRequestInitParamsJSON {
  maxContainerParamsLen: number | null;
  containerParams: Array<number>;
}

export class FunctionRequestInitParams {
  readonly maxContainerParamsLen: number | null;
  readonly containerParams: Uint8Array;

  constructor(fields: FunctionRequestInitParamsFields) {
    this.maxContainerParamsLen = fields.maxContainerParamsLen;
    this.containerParams = fields.containerParams;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.option(borsh.u32(), "maxContainerParamsLen"),
        borsh.vecU8("containerParams"),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionRequestInitParams({
      maxContainerParamsLen: obj.maxContainerParamsLen,
      containerParams: new Uint8Array(
        obj.containerParams.buffer,
        obj.containerParams.byteOffset,
        obj.containerParams.length
      ),
    });
  }

  static toEncodable(fields: FunctionRequestInitParamsFields) {
    return {
      maxContainerParamsLen: fields.maxContainerParamsLen,
      containerParams: Buffer.from(
        fields.containerParams.buffer,
        fields.containerParams.byteOffset,
        fields.containerParams.length
      ),
    };
  }

  toJSON(): FunctionRequestInitParamsJSON {
    return {
      maxContainerParamsLen: this.maxContainerParamsLen,
      containerParams: Array.from(this.containerParams.values()),
    };
  }

  static fromJSON(
    obj: FunctionRequestInitParamsJSON
  ): FunctionRequestInitParams {
    return new FunctionRequestInitParams({
      maxContainerParamsLen: obj.maxContainerParamsLen,
      containerParams: Uint8Array.from(obj.containerParams),
    });
  }

  toEncodable() {
    return FunctionRequestInitParams.toEncodable(this);
  }
}
