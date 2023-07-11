import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh";

export interface AttestationQueueInitParamsFields {
  allowAuthorityOverrideAfter: number;
  requireAuthorityHeartbeatPermission: boolean;
  requireUsagePermissions: boolean;
  maxQuoteVerificationAge: number;
  reward: number;
  nodeTimeout: number;
}

export interface AttestationQueueInitParamsJSON {
  allowAuthorityOverrideAfter: number;
  requireAuthorityHeartbeatPermission: boolean;
  requireUsagePermissions: boolean;
  maxQuoteVerificationAge: number;
  reward: number;
  nodeTimeout: number;
}

export class AttestationQueueInitParams {
  readonly allowAuthorityOverrideAfter: number;
  readonly requireAuthorityHeartbeatPermission: boolean;
  readonly requireUsagePermissions: boolean;
  readonly maxQuoteVerificationAge: number;
  readonly reward: number;
  readonly nodeTimeout: number;

  constructor(fields: AttestationQueueInitParamsFields) {
    this.allowAuthorityOverrideAfter = fields.allowAuthorityOverrideAfter;
    this.requireAuthorityHeartbeatPermission =
      fields.requireAuthorityHeartbeatPermission;
    this.requireUsagePermissions = fields.requireUsagePermissions;
    this.maxQuoteVerificationAge = fields.maxQuoteVerificationAge;
    this.reward = fields.reward;
    this.nodeTimeout = fields.nodeTimeout;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u32("allowAuthorityOverrideAfter"),
        borsh.bool("requireAuthorityHeartbeatPermission"),
        borsh.bool("requireUsagePermissions"),
        borsh.u32("maxQuoteVerificationAge"),
        borsh.u32("reward"),
        borsh.u32("nodeTimeout"),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new AttestationQueueInitParams({
      allowAuthorityOverrideAfter: obj.allowAuthorityOverrideAfter,
      requireAuthorityHeartbeatPermission:
        obj.requireAuthorityHeartbeatPermission,
      requireUsagePermissions: obj.requireUsagePermissions,
      maxQuoteVerificationAge: obj.maxQuoteVerificationAge,
      reward: obj.reward,
      nodeTimeout: obj.nodeTimeout,
    });
  }

  static toEncodable(fields: AttestationQueueInitParamsFields) {
    return {
      allowAuthorityOverrideAfter: fields.allowAuthorityOverrideAfter,
      requireAuthorityHeartbeatPermission:
        fields.requireAuthorityHeartbeatPermission,
      requireUsagePermissions: fields.requireUsagePermissions,
      maxQuoteVerificationAge: fields.maxQuoteVerificationAge,
      reward: fields.reward,
      nodeTimeout: fields.nodeTimeout,
    };
  }

  toJSON(): AttestationQueueInitParamsJSON {
    return {
      allowAuthorityOverrideAfter: this.allowAuthorityOverrideAfter,
      requireAuthorityHeartbeatPermission:
        this.requireAuthorityHeartbeatPermission,
      requireUsagePermissions: this.requireUsagePermissions,
      maxQuoteVerificationAge: this.maxQuoteVerificationAge,
      reward: this.reward,
      nodeTimeout: this.nodeTimeout,
    };
  }

  static fromJSON(
    obj: AttestationQueueInitParamsJSON
  ): AttestationQueueInitParams {
    return new AttestationQueueInitParams({
      allowAuthorityOverrideAfter: obj.allowAuthorityOverrideAfter,
      requireAuthorityHeartbeatPermission:
        obj.requireAuthorityHeartbeatPermission,
      requireUsagePermissions: obj.requireUsagePermissions,
      maxQuoteVerificationAge: obj.maxQuoteVerificationAge,
      reward: obj.reward,
      nodeTimeout: obj.nodeTimeout,
    });
  }

  toEncodable() {
    return AttestationQueueInitParams.toEncodable(this);
  }
}
