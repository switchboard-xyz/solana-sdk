import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh";

export interface AttestationPermissionSetParamsFields {
  permission: number;
  enable: boolean;
}

export interface AttestationPermissionSetParamsJSON {
  permission: number;
  enable: boolean;
}

export class AttestationPermissionSetParams {
  readonly permission: number;
  readonly enable: boolean;

  constructor(fields: AttestationPermissionSetParamsFields) {
    this.permission = fields.permission;
    this.enable = fields.enable;
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.u32("permission"), borsh.bool("enable")],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new AttestationPermissionSetParams({
      permission: obj.permission,
      enable: obj.enable,
    });
  }

  static toEncodable(fields: AttestationPermissionSetParamsFields) {
    return {
      permission: fields.permission,
      enable: fields.enable,
    };
  }

  toJSON(): AttestationPermissionSetParamsJSON {
    return {
      permission: this.permission,
      enable: this.enable,
    };
  }

  static fromJSON(
    obj: AttestationPermissionSetParamsJSON
  ): AttestationPermissionSetParams {
    return new AttestationPermissionSetParams({
      permission: obj.permission,
      enable: obj.enable,
    });
  }

  toEncodable() {
    return AttestationPermissionSetParams.toEncodable(this);
  }
}
