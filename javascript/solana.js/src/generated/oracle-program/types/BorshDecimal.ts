import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface BorshDecimalFields {
  mantissa: BN;
  scale: number;
}

export interface BorshDecimalJSON {
  mantissa: string;
  scale: number;
}

export class BorshDecimal {
  readonly mantissa: BN;
  readonly scale: number;

  constructor(fields: BorshDecimalFields) {
    this.mantissa = fields.mantissa;
    this.scale = fields.scale;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.i128("mantissa"), borsh.u32("scale")], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new BorshDecimal({
      mantissa: obj.mantissa,
      scale: obj.scale,
    });
  }

  static toEncodable(fields: BorshDecimalFields) {
    return {
      mantissa: fields.mantissa,
      scale: fields.scale,
    };
  }

  toJSON(): BorshDecimalJSON {
    return {
      mantissa: this.mantissa.toString(),
      scale: this.scale,
    };
  }

  static fromJSON(obj: BorshDecimalJSON): BorshDecimal {
    return new BorshDecimal({
      mantissa: new BN(obj.mantissa),
      scale: obj.scale,
    });
  }

  toEncodable() {
    return BorshDecimal.toEncodable(this);
  }
}
