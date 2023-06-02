import { SwitchboardProgram } from "../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VrfCloseParamsFields {
  stateBump: number;
  permissionBump: number;
}

export interface VrfCloseParamsJSON {
  stateBump: number;
  permissionBump: number;
}

export class VrfCloseParams {
  readonly stateBump: number;
  readonly permissionBump: number;

  constructor(fields: VrfCloseParamsFields) {
    this.stateBump = fields.stateBump;
    this.permissionBump = fields.permissionBump;
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.u8("stateBump"), borsh.u8("permissionBump")],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new VrfCloseParams({
      stateBump: obj.stateBump,
      permissionBump: obj.permissionBump,
    });
  }

  static toEncodable(fields: VrfCloseParamsFields) {
    return {
      stateBump: fields.stateBump,
      permissionBump: fields.permissionBump,
    };
  }

  toJSON(): VrfCloseParamsJSON {
    return {
      stateBump: this.stateBump,
      permissionBump: this.permissionBump,
    };
  }

  static fromJSON(obj: VrfCloseParamsJSON): VrfCloseParams {
    return new VrfCloseParams({
      stateBump: obj.stateBump,
      permissionBump: obj.permissionBump,
    });
  }

  toEncodable() {
    return VrfCloseParams.toEncodable(this);
  }
}
