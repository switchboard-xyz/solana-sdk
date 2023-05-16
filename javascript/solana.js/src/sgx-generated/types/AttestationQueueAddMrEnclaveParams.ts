import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh';
import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AttestationQueueAddMrEnclaveParamsFields {
  mrEnclave: Array<number>;
}

export interface AttestationQueueAddMrEnclaveParamsJSON {
  mrEnclave: Array<number>;
}

export class AttestationQueueAddMrEnclaveParams {
  readonly mrEnclave: Array<number>;

  constructor(fields: AttestationQueueAddMrEnclaveParamsFields) {
    this.mrEnclave = fields.mrEnclave;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.array(borsh.u8(), 32, 'mrEnclave')], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new AttestationQueueAddMrEnclaveParams({
      mrEnclave: obj.mrEnclave,
    });
  }

  static toEncodable(fields: AttestationQueueAddMrEnclaveParamsFields) {
    return {
      mrEnclave: fields.mrEnclave,
    };
  }

  toJSON(): AttestationQueueAddMrEnclaveParamsJSON {
    return {
      mrEnclave: this.mrEnclave,
    };
  }

  static fromJSON(
    obj: AttestationQueueAddMrEnclaveParamsJSON
  ): AttestationQueueAddMrEnclaveParams {
    return new AttestationQueueAddMrEnclaveParams({
      mrEnclave: obj.mrEnclave,
    });
  }

  toEncodable() {
    return AttestationQueueAddMrEnclaveParams.toEncodable(this);
  }
}
