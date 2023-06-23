import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionSetPermissionsParamsFields {
  permission: number;
  enable: boolean;
}

export interface FunctionSetPermissionsParamsJSON {
  permission: number;
  enable: boolean;
}

export class FunctionSetPermissionsParams {
  readonly permission: number;
  readonly enable: boolean;

  constructor(fields: FunctionSetPermissionsParamsFields) {
    this.permission = fields.permission;
    this.enable = fields.enable;
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.u32("permission"), borsh.bool("enable")],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionSetPermissionsParams({
      permission: obj.permission,
      enable: obj.enable,
    });
  }

  static toEncodable(fields: FunctionSetPermissionsParamsFields) {
    return {
      permission: fields.permission,
      enable: fields.enable,
    };
  }

  toJSON(): FunctionSetPermissionsParamsJSON {
    return {
      permission: this.permission,
      enable: this.enable,
    };
  }

  static fromJSON(
    obj: FunctionSetPermissionsParamsJSON
  ): FunctionSetPermissionsParams {
    return new FunctionSetPermissionsParams({
      permission: obj.permission,
      enable: obj.enable,
    });
  }

  toEncodable() {
    return FunctionSetPermissionsParams.toEncodable(this);
  }
}
