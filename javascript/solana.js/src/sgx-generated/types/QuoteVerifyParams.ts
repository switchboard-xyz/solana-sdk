import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh';
import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuoteVerifyParamsFields {
  timestamp: BN;
  mrEnclave: Array<number>;
}

export interface QuoteVerifyParamsJSON {
  timestamp: string;
  mrEnclave: Array<number>;
}

export class QuoteVerifyParams {
  readonly timestamp: BN;
  readonly mrEnclave: Array<number>;

  constructor(fields: QuoteVerifyParamsFields) {
    this.timestamp = fields.timestamp;
    this.mrEnclave = fields.mrEnclave;
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.i64('timestamp'), borsh.array(borsh.u8(), 32, 'mrEnclave')],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new QuoteVerifyParams({
      timestamp: obj.timestamp,
      mrEnclave: obj.mrEnclave,
    });
  }

  static toEncodable(fields: QuoteVerifyParamsFields) {
    return {
      timestamp: fields.timestamp,
      mrEnclave: fields.mrEnclave,
    };
  }

  toJSON(): QuoteVerifyParamsJSON {
    return {
      timestamp: this.timestamp.toString(),
      mrEnclave: this.mrEnclave,
    };
  }

  static fromJSON(obj: QuoteVerifyParamsJSON): QuoteVerifyParams {
    return new QuoteVerifyParams({
      timestamp: new BN(obj.timestamp),
      mrEnclave: obj.mrEnclave,
    });
  }

  toEncodable() {
    return QuoteVerifyParams.toEncodable(this);
  }
}
