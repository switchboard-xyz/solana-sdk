import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh";

export interface VrfPoolInitParamsFields {
  maxRows: number;
  minInterval: number;
  stateBump: number;
}

export interface VrfPoolInitParamsJSON {
  maxRows: number;
  minInterval: number;
  stateBump: number;
}

export class VrfPoolInitParams {
  readonly maxRows: number;
  readonly minInterval: number;
  readonly stateBump: number;

  constructor(fields: VrfPoolInitParamsFields) {
    this.maxRows = fields.maxRows;
    this.minInterval = fields.minInterval;
    this.stateBump = fields.stateBump;
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.u32("maxRows"), borsh.u32("minInterval"), borsh.u8("stateBump")],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new VrfPoolInitParams({
      maxRows: obj.maxRows,
      minInterval: obj.minInterval,
      stateBump: obj.stateBump,
    });
  }

  static toEncodable(fields: VrfPoolInitParamsFields) {
    return {
      maxRows: fields.maxRows,
      minInterval: fields.minInterval,
      stateBump: fields.stateBump,
    };
  }

  toJSON(): VrfPoolInitParamsJSON {
    return {
      maxRows: this.maxRows,
      minInterval: this.minInterval,
      stateBump: this.stateBump,
    };
  }

  static fromJSON(obj: VrfPoolInitParamsJSON): VrfPoolInitParams {
    return new VrfPoolInitParams({
      maxRows: obj.maxRows,
      minInterval: obj.minInterval,
      stateBump: obj.stateBump,
    });
  }

  toEncodable() {
    return VrfPoolInitParams.toEncodable(this);
  }
}
