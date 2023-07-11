import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh";

export interface WalletWithdrawParamsFields {
  amount: BN;
}

export interface WalletWithdrawParamsJSON {
  amount: string;
}

export class WalletWithdrawParams {
  readonly amount: BN;

  constructor(fields: WalletWithdrawParamsFields) {
    this.amount = fields.amount;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u64("amount")], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new WalletWithdrawParams({
      amount: obj.amount,
    });
  }

  static toEncodable(fields: WalletWithdrawParamsFields) {
    return {
      amount: fields.amount,
    };
  }

  toJSON(): WalletWithdrawParamsJSON {
    return {
      amount: this.amount.toString(),
    };
  }

  static fromJSON(obj: WalletWithdrawParamsJSON): WalletWithdrawParams {
    return new WalletWithdrawParams({
      amount: new BN(obj.amount),
    });
  }

  toEncodable() {
    return WalletWithdrawParams.toEncodable(this);
  }
}
