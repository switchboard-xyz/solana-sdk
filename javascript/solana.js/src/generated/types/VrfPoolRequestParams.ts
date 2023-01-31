import { SwitchboardProgram } from '../../SwitchboardProgram';
import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh';

export interface VrfPoolRequestParamsFields {
  permissionBumps: Uint8Array;
  callback: types.CallbackFields | null;
}

export interface VrfPoolRequestParamsJSON {
  permissionBumps: Array<number>;
  callback: types.CallbackJSON | null;
}

export class VrfPoolRequestParams {
  readonly permissionBumps: Uint8Array;
  readonly callback: types.Callback | null;

  constructor(fields: VrfPoolRequestParamsFields) {
    this.permissionBumps = fields.permissionBumps;
    this.callback =
      (fields.callback && new types.Callback({ ...fields.callback })) || null;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.vecU8('permissionBumps'),
        borsh.option(types.Callback.layout(), 'callback'),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new VrfPoolRequestParams({
      permissionBumps: new Uint8Array(
        obj.permissionBumps.buffer,
        obj.permissionBumps.byteOffset,
        obj.permissionBumps.length
      ),
      callback:
        (obj.callback && types.Callback.fromDecoded(obj.callback)) || null,
    });
  }

  static toEncodable(fields: VrfPoolRequestParamsFields) {
    return {
      permissionBumps: Buffer.from(
        fields.permissionBumps.buffer,
        fields.permissionBumps.byteOffset,
        fields.permissionBumps.length
      ),
      callback:
        (fields.callback && types.Callback.toEncodable(fields.callback)) ||
        null,
    };
  }

  toJSON(): VrfPoolRequestParamsJSON {
    return {
      permissionBumps: Array.from(this.permissionBumps.values()),
      callback: (this.callback && this.callback.toJSON()) || null,
    };
  }

  static fromJSON(obj: VrfPoolRequestParamsJSON): VrfPoolRequestParams {
    return new VrfPoolRequestParams({
      permissionBumps: Uint8Array.from(obj.permissionBumps),
      callback: (obj.callback && types.Callback.fromJSON(obj.callback)) || null,
    });
  }

  toEncodable() {
    return VrfPoolRequestParams.toEncodable(this);
  }
}
