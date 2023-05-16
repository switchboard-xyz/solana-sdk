import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh';
import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface PermissionSetParamsFields {
  permission: number;
  enable: boolean;
}

export interface PermissionSetParamsJSON {
  permission: number;
  enable: boolean;
}

export class PermissionSetParams {
  readonly permission: number;
  readonly enable: boolean;

  constructor(fields: PermissionSetParamsFields) {
    this.permission = fields.permission;
    this.enable = fields.enable;
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.u32('permission'), borsh.bool('enable')],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new PermissionSetParams({
      permission: obj.permission,
      enable: obj.enable,
    });
  }

  static toEncodable(fields: PermissionSetParamsFields) {
    return {
      permission: fields.permission,
      enable: fields.enable,
    };
  }

  toJSON(): PermissionSetParamsJSON {
    return {
      permission: this.permission,
      enable: this.enable,
    };
  }

  static fromJSON(obj: PermissionSetParamsJSON): PermissionSetParams {
    return new PermissionSetParams({
      permission: obj.permission,
      enable: obj.enable,
    });
  }

  toEncodable() {
    return PermissionSetParams.toEncodable(this);
  }
}
