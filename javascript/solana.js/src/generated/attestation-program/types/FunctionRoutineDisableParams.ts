import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionRoutineDisableParamsFields {
  enable: boolean | null;
}

export interface FunctionRoutineDisableParamsJSON {
  enable: boolean | null;
}

export class FunctionRoutineDisableParams {
  readonly enable: boolean | null;

  constructor(fields: FunctionRoutineDisableParamsFields) {
    this.enable = fields.enable;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.option(borsh.bool(), "enable")], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionRoutineDisableParams({
      enable: obj.enable,
    });
  }

  static toEncodable(fields: FunctionRoutineDisableParamsFields) {
    return {
      enable: fields.enable,
    };
  }

  toJSON(): FunctionRoutineDisableParamsJSON {
    return {
      enable: this.enable,
    };
  }

  static fromJSON(
    obj: FunctionRoutineDisableParamsJSON
  ): FunctionRoutineDisableParams {
    return new FunctionRoutineDisableParams({
      enable: obj.enable,
    });
  }

  toEncodable() {
    return FunctionRoutineDisableParams.toEncodable(this);
  }
}
