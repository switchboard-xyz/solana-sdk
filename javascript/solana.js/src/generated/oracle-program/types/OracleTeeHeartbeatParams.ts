import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh";

export interface OracleTeeHeartbeatParamsFields {
  permissionBump: number;
}

export interface OracleTeeHeartbeatParamsJSON {
  permissionBump: number;
}

export class OracleTeeHeartbeatParams {
  readonly permissionBump: number;

  constructor(fields: OracleTeeHeartbeatParamsFields) {
    this.permissionBump = fields.permissionBump;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u8("permissionBump")], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new OracleTeeHeartbeatParams({
      permissionBump: obj.permissionBump,
    });
  }

  static toEncodable(fields: OracleTeeHeartbeatParamsFields) {
    return {
      permissionBump: fields.permissionBump,
    };
  }

  toJSON(): OracleTeeHeartbeatParamsJSON {
    return {
      permissionBump: this.permissionBump,
    };
  }

  static fromJSON(obj: OracleTeeHeartbeatParamsJSON): OracleTeeHeartbeatParams {
    return new OracleTeeHeartbeatParams({
      permissionBump: obj.permissionBump,
    });
  }

  toEncodable() {
    return OracleTeeHeartbeatParams.toEncodable(this);
  }
}
