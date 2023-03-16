import { SwitchboardProgram } from '../../SwitchboardProgram';
import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh';

export interface SetBumpsParamsFields {
  stateBump: number;
}

export interface SetBumpsParamsJSON {
  stateBump: number;
}

export class SetBumpsParams {
  readonly stateBump: number;

  constructor(fields: SetBumpsParamsFields) {
    this.stateBump = fields.stateBump;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u8('stateBump')], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new SetBumpsParams({
      stateBump: obj.stateBump,
    });
  }

  static toEncodable(fields: SetBumpsParamsFields) {
    return {
      stateBump: fields.stateBump,
    };
  }

  toJSON(): SetBumpsParamsJSON {
    return {
      stateBump: this.stateBump,
    };
  }

  static fromJSON(obj: SetBumpsParamsJSON): SetBumpsParams {
    return new SetBumpsParams({
      stateBump: obj.stateBump,
    });
  }

  toEncodable() {
    return SetBumpsParams.toEncodable(this);
  }
}
