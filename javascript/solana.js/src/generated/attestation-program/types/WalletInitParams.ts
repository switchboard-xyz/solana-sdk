import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh";

export interface WalletInitParamsFields {
  name: Uint8Array;
  maxLen: number | null;
}

export interface WalletInitParamsJSON {
  name: Array<number>;
  maxLen: number | null;
}

export class WalletInitParams {
  readonly name: Uint8Array;
  readonly maxLen: number | null;

  constructor(fields: WalletInitParamsFields) {
    this.name = fields.name;
    this.maxLen = fields.maxLen;
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.vecU8("name"), borsh.option(borsh.u32(), "maxLen")],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new WalletInitParams({
      name: new Uint8Array(
        obj.name.buffer,
        obj.name.byteOffset,
        obj.name.length
      ),
      maxLen: obj.maxLen,
    });
  }

  static toEncodable(fields: WalletInitParamsFields) {
    return {
      name: Buffer.from(
        fields.name.buffer,
        fields.name.byteOffset,
        fields.name.length
      ),
      maxLen: fields.maxLen,
    };
  }

  toJSON(): WalletInitParamsJSON {
    return {
      name: Array.from(this.name.values()),
      maxLen: this.maxLen,
    };
  }

  static fromJSON(obj: WalletInitParamsJSON): WalletInitParams {
    return new WalletInitParams({
      name: Uint8Array.from(obj.name),
      maxLen: obj.maxLen,
    });
  }

  toEncodable() {
    return WalletInitParams.toEncodable(this);
  }
}
