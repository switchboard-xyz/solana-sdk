import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionUserSetConfigParamsFields {
  containerParams: Uint8Array;
  appendContainerParams: boolean;
}

export interface FunctionUserSetConfigParamsJSON {
  containerParams: Array<number>;
  appendContainerParams: boolean;
}

export class FunctionUserSetConfigParams {
  readonly containerParams: Uint8Array;
  readonly appendContainerParams: boolean;

  constructor(fields: FunctionUserSetConfigParamsFields) {
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
    return new FunctionUserSetConfigParams({
      containerParams: new Uint8Array(
        obj.containerParams.buffer,
        obj.containerParams.byteOffset,
        obj.containerParams.length
      ),
      appendContainerParams: obj.appendContainerParams,
    });
  }

  static toEncodable(fields: FunctionUserSetConfigParamsFields) {
    return {
      containerParams: Buffer.from(
        fields.containerParams.buffer,
        fields.containerParams.byteOffset,
        fields.containerParams.length
      ),
      appendContainerParams: fields.appendContainerParams,
    };
  }

  toJSON(): FunctionUserSetConfigParamsJSON {
    return {
      containerParams: Array.from(this.containerParams.values()),
      appendContainerParams: this.appendContainerParams,
    };
  }

  static fromJSON(
    obj: FunctionUserSetConfigParamsJSON
  ): FunctionUserSetConfigParams {
    return new FunctionUserSetConfigParams({
      containerParams: Uint8Array.from(obj.containerParams),
      appendContainerParams: obj.appendContainerParams,
    });
  }

  toEncodable() {
    return FunctionUserSetConfigParams.toEncodable(this);
  }
}
