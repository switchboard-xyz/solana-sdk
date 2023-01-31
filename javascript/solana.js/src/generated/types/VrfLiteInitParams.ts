import { SwitchboardProgram } from '../../SwitchboardProgram';
import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh';

export interface VrfLiteInitParamsFields {
  callback: types.CallbackFields | null;
  stateBump: number;
  expiration: BN | null;
}

export interface VrfLiteInitParamsJSON {
  callback: types.CallbackJSON | null;
  stateBump: number;
  expiration: string | null;
}

export class VrfLiteInitParams {
  readonly callback: types.Callback | null;
  readonly stateBump: number;
  readonly expiration: BN | null;

  constructor(fields: VrfLiteInitParamsFields) {
    this.callback =
      (fields.callback && new types.Callback({ ...fields.callback })) || null;
    this.stateBump = fields.stateBump;
    this.expiration = fields.expiration;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.option(types.Callback.layout(), 'callback'),
        borsh.u8('stateBump'),
        borsh.option(borsh.i64(), 'expiration'),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new VrfLiteInitParams({
      callback:
        (obj.callback && types.Callback.fromDecoded(obj.callback)) || null,
      stateBump: obj.stateBump,
      expiration: obj.expiration,
    });
  }

  static toEncodable(fields: VrfLiteInitParamsFields) {
    return {
      callback:
        (fields.callback && types.Callback.toEncodable(fields.callback)) ||
        null,
      stateBump: fields.stateBump,
      expiration: fields.expiration,
    };
  }

  toJSON(): VrfLiteInitParamsJSON {
    return {
      callback: (this.callback && this.callback.toJSON()) || null,
      stateBump: this.stateBump,
      expiration: (this.expiration && this.expiration.toString()) || null,
    };
  }

  static fromJSON(obj: VrfLiteInitParamsJSON): VrfLiteInitParams {
    return new VrfLiteInitParams({
      callback: (obj.callback && types.Callback.fromJSON(obj.callback)) || null,
      stateBump: obj.stateBump,
      expiration: (obj.expiration && new BN(obj.expiration)) || null,
    });
  }

  toEncodable() {
    return VrfLiteInitParams.toEncodable(this);
  }
}
