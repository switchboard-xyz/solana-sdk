import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh';

export interface ScalarFields {
  bytes: Array<number>;
}

export interface ScalarJSON {
  bytes: Array<number>;
}

export class Scalar {
  readonly bytes: Array<number>;

  constructor(fields: ScalarFields) {
    this.bytes = fields.bytes;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.array(borsh.u8(), 32, 'bytes')], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new Scalar({
      bytes: obj.bytes,
    });
  }

  static toEncodable(fields: ScalarFields) {
    return {
      bytes: fields.bytes,
    };
  }

  toJSON(): ScalarJSON {
    return {
      bytes: this.bytes,
    };
  }

  static fromJSON(obj: ScalarJSON): Scalar {
    return new Scalar({
      bytes: obj.bytes,
    });
  }

  toEncodable() {
    return Scalar.toEncodable(this);
  }
}
