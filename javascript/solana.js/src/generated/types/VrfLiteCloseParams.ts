import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh';

export interface VrfLiteCloseParamsFields {
  stateBump: number;
}

export interface VrfLiteCloseParamsJSON {
  stateBump: number;
}

export class VrfLiteCloseParams {
  readonly stateBump: number;

  constructor(fields: VrfLiteCloseParamsFields) {
    this.stateBump = fields.stateBump;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u8('stateBump')], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new VrfLiteCloseParams({
      stateBump: obj.stateBump,
    });
  }

  static toEncodable(fields: VrfLiteCloseParamsFields) {
    return {
      stateBump: fields.stateBump,
    };
  }

  toJSON(): VrfLiteCloseParamsJSON {
    return {
      stateBump: this.stateBump,
    };
  }

  static fromJSON(obj: VrfLiteCloseParamsJSON): VrfLiteCloseParams {
    return new VrfLiteCloseParams({
      stateBump: obj.stateBump,
    });
  }

  toEncodable() {
    return VrfLiteCloseParams.toEncodable(this);
  }
}
