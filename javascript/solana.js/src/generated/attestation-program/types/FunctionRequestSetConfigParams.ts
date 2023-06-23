import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionRequestSetConfigParamsFields {
  containerParams: Uint8Array;
  appendContainerParams: boolean;
}

export interface FunctionRequestSetConfigParamsJSON {
  containerParams: Array<number>;
  appendContainerParams: boolean;
}

export class FunctionRequestSetConfigParams {
  readonly containerParams: Uint8Array;
  readonly appendContainerParams: boolean;

  constructor(fields: FunctionRequestSetConfigParamsFields) {
    this.containerParams = fields.containerParams;
    this.appendContainerParams = fields.appendContainerParams;
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.vecU8("containerParams"), borsh.bool("appendContainerParams")],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionRequestSetConfigParams({
      containerParams: new Uint8Array(
        obj.containerParams.buffer,
        obj.containerParams.byteOffset,
        obj.containerParams.length
      ),
      appendContainerParams: obj.appendContainerParams,
    });
  }

  static toEncodable(fields: FunctionRequestSetConfigParamsFields) {
    return {
      containerParams: Buffer.from(
        fields.containerParams.buffer,
        fields.containerParams.byteOffset,
        fields.containerParams.length
      ),
      appendContainerParams: fields.appendContainerParams,
    };
  }

  toJSON(): FunctionRequestSetConfigParamsJSON {
    return {
      containerParams: Array.from(this.containerParams.values()),
      appendContainerParams: this.appendContainerParams,
    };
  }

  static fromJSON(
    obj: FunctionRequestSetConfigParamsJSON
  ): FunctionRequestSetConfigParams {
    return new FunctionRequestSetConfigParams({
      containerParams: Uint8Array.from(obj.containerParams),
      appendContainerParams: obj.appendContainerParams,
    });
  }

  toEncodable() {
    return FunctionRequestSetConfigParams.toEncodable(this);
  }
}
