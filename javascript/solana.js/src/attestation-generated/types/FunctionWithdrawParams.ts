import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh';
import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionWithdrawParamsFields {
  amount: BN;
}

export interface FunctionWithdrawParamsJSON {
  amount: string;
}

export class FunctionWithdrawParams {
  readonly amount: BN;

  constructor(fields: FunctionWithdrawParamsFields) {
    this.amount = fields.amount;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u64('amount')], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionWithdrawParams({
      amount: obj.amount,
    });
  }

  static toEncodable(fields: FunctionWithdrawParamsFields) {
    return {
      amount: fields.amount,
    };
  }

  toJSON(): FunctionWithdrawParamsJSON {
    return {
      amount: this.amount.toString(),
    };
  }

  static fromJSON(obj: FunctionWithdrawParamsJSON): FunctionWithdrawParams {
    return new FunctionWithdrawParams({
      amount: new BN(obj.amount),
    });
  }

  toEncodable() {
    return FunctionWithdrawParams.toEncodable(this);
  }
}
