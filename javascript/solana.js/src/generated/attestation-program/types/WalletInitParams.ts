import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface WalletInitParamsFields {
  name: Uint8Array;
}

export interface WalletInitParamsJSON {
  name: Array<number>;
}

export class WalletInitParams {
  readonly name: Uint8Array;

  constructor(fields: WalletInitParamsFields) {
    this.name = fields.name;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.vecU8("name")], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new WalletInitParams({
      name: new Uint8Array(
        obj.name.buffer,
        obj.name.byteOffset,
        obj.name.length
      ),
    });
  }

  static toEncodable(fields: WalletInitParamsFields) {
    return {
      name: Buffer.from(
        fields.name.buffer,
        fields.name.byteOffset,
        fields.name.length
      ),
    };
  }

  toJSON(): WalletInitParamsJSON {
    return {
      name: Array.from(this.name.values()),
    };
  }

  static fromJSON(obj: WalletInitParamsJSON): WalletInitParams {
    return new WalletInitParams({
      name: Uint8Array.from(obj.name),
    });
  }

  toEncodable() {
    return WalletInitParams.toEncodable(this);
  }
}
