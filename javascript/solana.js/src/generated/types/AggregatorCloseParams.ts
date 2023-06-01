import { SwitchboardProgram } from "../../SwitchboardProgram.js";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh";

export interface AggregatorCloseParamsFields {
  stateBump: number;
  permissionBump: number;
  leaseBump: number;
}

export interface AggregatorCloseParamsJSON {
  stateBump: number;
  permissionBump: number;
  leaseBump: number;
}

export class AggregatorCloseParams {
  readonly stateBump: number;
  readonly permissionBump: number;
  readonly leaseBump: number;

  constructor(fields: AggregatorCloseParamsFields) {
    this.stateBump = fields.stateBump;
    this.permissionBump = fields.permissionBump;
    this.leaseBump = fields.leaseBump;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u8("stateBump"),
        borsh.u8("permissionBump"),
        borsh.u8("leaseBump"),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new AggregatorCloseParams({
      stateBump: obj.stateBump,
      permissionBump: obj.permissionBump,
      leaseBump: obj.leaseBump,
    });
  }

  static toEncodable(fields: AggregatorCloseParamsFields) {
    return {
      stateBump: fields.stateBump,
      permissionBump: fields.permissionBump,
      leaseBump: fields.leaseBump,
    };
  }

  toJSON(): AggregatorCloseParamsJSON {
    return {
      stateBump: this.stateBump,
      permissionBump: this.permissionBump,
      leaseBump: this.leaseBump,
    };
  }

  static fromJSON(obj: AggregatorCloseParamsJSON): AggregatorCloseParams {
    return new AggregatorCloseParams({
      stateBump: obj.stateBump,
      permissionBump: obj.permissionBump,
      leaseBump: obj.leaseBump,
    });
  }

  toEncodable() {
    return AggregatorCloseParams.toEncodable(this);
  }
}
