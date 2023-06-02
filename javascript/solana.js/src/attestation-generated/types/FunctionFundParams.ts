import { SwitchboardProgram } from "../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionFundParamsFields {
  amount: BN;
}

export interface FunctionFundParamsJSON {
  amount: string;
}

export class FunctionFundParams {
  readonly amount: BN;

  constructor(fields: FunctionFundParamsFields) {
    this.amount = fields.amount;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u64("amount")], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionFundParams({
      amount: obj.amount,
    });
  }

  static toEncodable(fields: FunctionFundParamsFields) {
    return {
      amount: fields.amount,
    };
  }

  toJSON(): FunctionFundParamsJSON {
    return {
      amount: this.amount.toString(),
    };
  }

  static fromJSON(obj: FunctionFundParamsJSON): FunctionFundParams {
    return new FunctionFundParams({
      amount: new BN(obj.amount),
    });
  }

  toEncodable() {
    return FunctionFundParams.toEncodable(this);
  }
}
