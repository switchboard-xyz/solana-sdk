import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh';
import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QueueAddMrEnclaveParamsFields {
  mrEnclave: Array<number>;
}

export interface QueueAddMrEnclaveParamsJSON {
  mrEnclave: Array<number>;
}

export class QueueAddMrEnclaveParams {
  readonly mrEnclave: Array<number>;

  constructor(fields: QueueAddMrEnclaveParamsFields) {
    this.mrEnclave = fields.mrEnclave;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.array(borsh.u8(), 32, 'mrEnclave')], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new QueueAddMrEnclaveParams({
      mrEnclave: obj.mrEnclave,
    });
  }

  static toEncodable(fields: QueueAddMrEnclaveParamsFields) {
    return {
      mrEnclave: fields.mrEnclave,
    };
  }

  toJSON(): QueueAddMrEnclaveParamsJSON {
    return {
      mrEnclave: this.mrEnclave,
    };
  }

  static fromJSON(obj: QueueAddMrEnclaveParamsJSON): QueueAddMrEnclaveParams {
    return new QueueAddMrEnclaveParams({
      mrEnclave: obj.mrEnclave,
    });
  }

  toEncodable() {
    return QueueAddMrEnclaveParams.toEncodable(this);
  }
}
