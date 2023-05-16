import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh';
import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AttestationPermissionInitParamsFields {}

export interface AttestationPermissionInitParamsJSON {}

export class AttestationPermissionInitParams {
  constructor(fields: AttestationPermissionInitParamsFields) {}

  static layout(property?: string) {
    return borsh.struct([], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new AttestationPermissionInitParams({});
  }

  static toEncodable(fields: AttestationPermissionInitParamsFields) {
    return {};
  }

  toJSON(): AttestationPermissionInitParamsJSON {
    return {};
  }

  static fromJSON(
    obj: AttestationPermissionInitParamsJSON
  ): AttestationPermissionInitParams {
    return new AttestationPermissionInitParams({});
  }

  toEncodable() {
    return AttestationPermissionInitParams.toEncodable(this);
  }
}
