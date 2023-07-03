import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface WalletFundParamsFields {
  transferAmount: BN | null;
  wrapAmount: BN | null;
}

export interface WalletFundParamsJSON {
  transferAmount: string | null;
  wrapAmount: string | null;
}

export class WalletFundParams {
  readonly transferAmount: BN | null;
  readonly wrapAmount: BN | null;

  constructor(fields: WalletFundParamsFields) {
    this.transferAmount = fields.transferAmount;
    this.wrapAmount = fields.wrapAmount;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.option(borsh.u64(), "transferAmount"),
        borsh.option(borsh.u64(), "wrapAmount"),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new WalletFundParams({
      transferAmount: obj.transferAmount,
      wrapAmount: obj.wrapAmount,
    });
  }

  static toEncodable(fields: WalletFundParamsFields) {
    return {
      transferAmount: fields.transferAmount,
      wrapAmount: fields.wrapAmount,
    };
  }

  toJSON(): WalletFundParamsJSON {
    return {
      transferAmount:
        (this.transferAmount && this.transferAmount.toString()) || null,
      wrapAmount: (this.wrapAmount && this.wrapAmount.toString()) || null,
    };
  }

  static fromJSON(obj: WalletFundParamsJSON): WalletFundParams {
    return new WalletFundParams({
      transferAmount:
        (obj.transferAmount && new BN(obj.transferAmount)) || null,
      wrapAmount: (obj.wrapAmount && new BN(obj.wrapAmount)) || null,
    });
  }

  toEncodable() {
    return WalletFundParams.toEncodable(this);
  }
}
