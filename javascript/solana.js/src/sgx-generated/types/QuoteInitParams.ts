import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh';
import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuoteInitParamsFields {
  cid: Array<number>;
}

export interface QuoteInitParamsJSON {
  cid: Array<number>;
}

export class QuoteInitParams {
  readonly cid: Array<number>;

  constructor(fields: QuoteInitParamsFields) {
    this.cid = fields.cid;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.array(borsh.u8(), 64, 'cid')], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new QuoteInitParams({
      cid: obj.cid,
    });
  }

  static toEncodable(fields: QuoteInitParamsFields) {
    return {
      cid: fields.cid,
    };
  }

  toJSON(): QuoteInitParamsJSON {
    return {
      cid: this.cid,
    };
  }

  static fromJSON(obj: QuoteInitParamsJSON): QuoteInitParams {
    return new QuoteInitParams({
      cid: obj.cid,
    });
  }

  toEncodable() {
    return QuoteInitParams.toEncodable(this);
  }
}
