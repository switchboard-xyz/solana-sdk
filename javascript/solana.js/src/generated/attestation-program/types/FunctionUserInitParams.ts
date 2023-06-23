import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionUserInitParamsFields {
  maxContainerParamsLen: number | null;
  containerParams: Uint8Array;
}

export interface FunctionUserInitParamsJSON {
  maxContainerParamsLen: number | null;
  containerParams: Array<number>;
}

export class FunctionUserInitParams {
  readonly maxContainerParamsLen: number | null;
  readonly containerParams: Uint8Array;

  constructor(fields: FunctionUserInitParamsFields) {
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
    return new FunctionUserInitParams({
      maxContainerParamsLen: obj.maxContainerParamsLen,
      containerParams: new Uint8Array(
        obj.containerParams.buffer,
        obj.containerParams.byteOffset,
        obj.containerParams.length
      ),
    });
  }

  static toEncodable(fields: FunctionUserInitParamsFields) {
    return {
      maxContainerParamsLen: fields.maxContainerParamsLen,
      containerParams: Buffer.from(
        fields.containerParams.buffer,
        fields.containerParams.byteOffset,
        fields.containerParams.length
      ),
    };
  }

  toJSON(): FunctionUserInitParamsJSON {
    return {
      maxContainerParamsLen: this.maxContainerParamsLen,
      containerParams: Array.from(this.containerParams.values()),
    };
  }

  static fromJSON(obj: FunctionUserInitParamsJSON): FunctionUserInitParams {
    return new FunctionUserInitParams({
      maxContainerParamsLen: obj.maxContainerParamsLen,
      containerParams: Uint8Array.from(obj.containerParams),
    });
  }

  toEncodable() {
    return FunctionUserInitParams.toEncodable(this);
  }
}
