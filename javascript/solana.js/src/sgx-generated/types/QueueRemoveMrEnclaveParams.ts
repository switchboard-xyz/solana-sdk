import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh';
import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QueueRemoveMrEnclaveParamsFields {
  mrEnclave: Array<number>;
}

export interface QueueRemoveMrEnclaveParamsJSON {
  mrEnclave: Array<number>;
}

export class QueueRemoveMrEnclaveParams {
  readonly mrEnclave: Array<number>;

  constructor(fields: QueueRemoveMrEnclaveParamsFields) {
    this.mrEnclave = fields.mrEnclave;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.array(borsh.u8(), 32, 'mrEnclave')], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new QueueRemoveMrEnclaveParams({
      mrEnclave: obj.mrEnclave,
    });
  }

  static toEncodable(fields: QueueRemoveMrEnclaveParamsFields) {
    return {
      mrEnclave: fields.mrEnclave,
    };
  }

  toJSON(): QueueRemoveMrEnclaveParamsJSON {
    return {
      mrEnclave: this.mrEnclave,
    };
  }

  static fromJSON(
    obj: QueueRemoveMrEnclaveParamsJSON
  ): QueueRemoveMrEnclaveParams {
    return new QueueRemoveMrEnclaveParams({
      mrEnclave: obj.mrEnclave,
    });
  }

  toEncodable() {
    return QueueRemoveMrEnclaveParams.toEncodable(this);
  }
}
