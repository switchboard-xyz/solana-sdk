import { SwitchboardProgram } from "../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VrfLiteRequestRandomnessParamsFields {
  callback: types.CallbackFields | null;
}

export interface VrfLiteRequestRandomnessParamsJSON {
  callback: types.CallbackJSON | null;
}

export class VrfLiteRequestRandomnessParams {
  readonly callback: types.Callback | null;

  constructor(fields: VrfLiteRequestRandomnessParamsFields) {
    this.callback =
      (fields.callback && new types.Callback({ ...fields.callback })) || null;
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.option(types.Callback.layout(), "callback")],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new VrfLiteRequestRandomnessParams({
      callback:
        (obj.callback && types.Callback.fromDecoded(obj.callback)) || null,
    });
  }

  static toEncodable(fields: VrfLiteRequestRandomnessParamsFields) {
    return {
      callback:
        (fields.callback && types.Callback.toEncodable(fields.callback)) ||
        null,
    };
  }

  toJSON(): VrfLiteRequestRandomnessParamsJSON {
    return {
      callback: (this.callback && this.callback.toJSON()) || null,
    };
  }

  static fromJSON(
    obj: VrfLiteRequestRandomnessParamsJSON
  ): VrfLiteRequestRandomnessParams {
    return new VrfLiteRequestRandomnessParams({
      callback: (obj.callback && types.Callback.fromJSON(obj.callback)) || null,
    });
  }

  toEncodable() {
    return VrfLiteRequestRandomnessParams.toEncodable(this);
  }
}
