import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Connection, PublicKey } from "@solana/web3.js";
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AttestationQueueAccountDataFields {
  /** The address of the authority which is permitted to add/remove allowed enclave measurements. */
  authority: PublicKey;
  /** Allowed enclave measurements. */
  mrEnclaves: Array<Array<number>>;
  /** The number of allowed enclave measurements. */
  mrEnclavesLen: number;
  /**
   * The addresses of the quote verifiers who have a valid
   * verification status and have heartbeated on-chain recently.
   */
  data: Array<PublicKey>;
  /** The length of valid quote verifiers for the given attestation queue. */
  dataLen: number;
  /** Allow authority to force add a node after X seconds with no heartbeat. */
  allowAuthorityOverrideAfter: BN;
  /**
   * Even if a heartbeating machine quote verifies with proper measurement,
   * require authority signoff.
   */
  requireAuthorityHeartbeatPermission: boolean;
  /** Require FunctionAccounts to have PermitQueueUsage before they are executed. */
  requireUsagePermissions: boolean;
  /** The maximum allowable time until a EnclaveAccount needs to be re-verified on-chain. */
  maxQuoteVerificationAge: BN;
  /** The reward paid to quote verifiers for attesting on-chain. */
  reward: number;
  /** The unix timestamp when the last quote verifier heartbeated on-chain. */
  lastHeartbeat: BN;
  nodeTimeout: BN;
  /** Incrementer used to track the current quote verifier permitted to run any available functions. */
  currIdx: number;
  /** Incrementer used to garbage collect and remove stale quote verifiers. */
  gcIdx: number;
  /** Reserved. */
  ebuf: Array<number>;
}

export interface AttestationQueueAccountDataJSON {
  /** The address of the authority which is permitted to add/remove allowed enclave measurements. */
  authority: string;
  /** Allowed enclave measurements. */
  mrEnclaves: Array<Array<number>>;
  /** The number of allowed enclave measurements. */
  mrEnclavesLen: number;
  /**
   * The addresses of the quote verifiers who have a valid
   * verification status and have heartbeated on-chain recently.
   */
  data: Array<string>;
  /** The length of valid quote verifiers for the given attestation queue. */
  dataLen: number;
  /** Allow authority to force add a node after X seconds with no heartbeat. */
  allowAuthorityOverrideAfter: string;
  /**
   * Even if a heartbeating machine quote verifies with proper measurement,
   * require authority signoff.
   */
  requireAuthorityHeartbeatPermission: boolean;
  /** Require FunctionAccounts to have PermitQueueUsage before they are executed. */
  requireUsagePermissions: boolean;
  /** The maximum allowable time until a EnclaveAccount needs to be re-verified on-chain. */
  maxQuoteVerificationAge: string;
  /** The reward paid to quote verifiers for attesting on-chain. */
  reward: number;
  /** The unix timestamp when the last quote verifier heartbeated on-chain. */
  lastHeartbeat: string;
  nodeTimeout: string;
  /** Incrementer used to track the current quote verifier permitted to run any available functions. */
  currIdx: number;
  /** Incrementer used to garbage collect and remove stale quote verifiers. */
  gcIdx: number;
  /** Reserved. */
  ebuf: Array<number>;
}

export class AttestationQueueAccountData {
  /** The address of the authority which is permitted to add/remove allowed enclave measurements. */
  readonly authority: PublicKey;
  /** Allowed enclave measurements. */
  readonly mrEnclaves: Array<Array<number>>;
  /** The number of allowed enclave measurements. */
  readonly mrEnclavesLen: number;
  /**
   * The addresses of the quote verifiers who have a valid
   * verification status and have heartbeated on-chain recently.
   */
  readonly data: Array<PublicKey>;
  /** The length of valid quote verifiers for the given attestation queue. */
  readonly dataLen: number;
  /** Allow authority to force add a node after X seconds with no heartbeat. */
  readonly allowAuthorityOverrideAfter: BN;
  /**
   * Even if a heartbeating machine quote verifies with proper measurement,
   * require authority signoff.
   */
  readonly requireAuthorityHeartbeatPermission: boolean;
  /** Require FunctionAccounts to have PermitQueueUsage before they are executed. */
  readonly requireUsagePermissions: boolean;
  /** The maximum allowable time until a EnclaveAccount needs to be re-verified on-chain. */
  readonly maxQuoteVerificationAge: BN;
  /** The reward paid to quote verifiers for attesting on-chain. */
  readonly reward: number;
  /** The unix timestamp when the last quote verifier heartbeated on-chain. */
  readonly lastHeartbeat: BN;
  readonly nodeTimeout: BN;
  /** Incrementer used to track the current quote verifier permitted to run any available functions. */
  readonly currIdx: number;
  /** Incrementer used to garbage collect and remove stale quote verifiers. */
  readonly gcIdx: number;
  /** Reserved. */
  readonly ebuf: Array<number>;

  static readonly discriminator = Buffer.from([
    192, 53, 130, 67, 234, 207, 39, 171,
  ]);

  static readonly layout = borsh.struct([
    borsh.publicKey("authority"),
    borsh.array(borsh.array(borsh.u8(), 32), 32, "mrEnclaves"),
    borsh.u32("mrEnclavesLen"),
    borsh.array(borsh.publicKey(), 128, "data"),
    borsh.u32("dataLen"),
    borsh.i64("allowAuthorityOverrideAfter"),
    borsh.bool("requireAuthorityHeartbeatPermission"),
    borsh.bool("requireUsagePermissions"),
    borsh.i64("maxQuoteVerificationAge"),
    borsh.u32("reward"),
    borsh.i64("lastHeartbeat"),
    borsh.i64("nodeTimeout"),
    borsh.u32("currIdx"),
    borsh.u32("gcIdx"),
    borsh.array(borsh.u8(), 1024, "ebuf"),
  ]);

  constructor(fields: AttestationQueueAccountDataFields) {
    this.authority = fields.authority;
    this.mrEnclaves = fields.mrEnclaves;
    this.mrEnclavesLen = fields.mrEnclavesLen;
    this.data = fields.data;
    this.dataLen = fields.dataLen;
    this.allowAuthorityOverrideAfter = fields.allowAuthorityOverrideAfter;
    this.requireAuthorityHeartbeatPermission =
      fields.requireAuthorityHeartbeatPermission;
    this.requireUsagePermissions = fields.requireUsagePermissions;
    this.maxQuoteVerificationAge = fields.maxQuoteVerificationAge;
    this.reward = fields.reward;
    this.lastHeartbeat = fields.lastHeartbeat;
    this.nodeTimeout = fields.nodeTimeout;
    this.currIdx = fields.currIdx;
    this.gcIdx = fields.gcIdx;
    this.ebuf = fields.ebuf;
  }

  static async fetch(
    program: SwitchboardProgram,
    address: PublicKey
  ): Promise<AttestationQueueAccountData | null> {
    const info = await program.connection.getAccountInfo(address);

    if (info === null) {
      return null;
    }
    if (!info.owner.equals(program.attestationProgramId)) {
      throw new Error("account doesn't belong to this program");
    }

    return this.decode(info.data);
  }

  static async fetchMultiple(
    program: SwitchboardProgram,
    addresses: PublicKey[]
  ): Promise<Array<AttestationQueueAccountData | null>> {
    const infos = await program.connection.getMultipleAccountsInfo(addresses);

    return infos.map((info) => {
      if (info === null) {
        return null;
      }
      if (!info.owner.equals(program.attestationProgramId)) {
        throw new Error("account doesn't belong to this program");
      }

      return this.decode(info.data);
    });
  }

  static decode(data: Buffer): AttestationQueueAccountData {
    if (!data.slice(0, 8).equals(AttestationQueueAccountData.discriminator)) {
      throw new Error("invalid account discriminator");
    }

    const dec = AttestationQueueAccountData.layout.decode(data.slice(8));

    return new AttestationQueueAccountData({
      authority: dec.authority,
      mrEnclaves: dec.mrEnclaves,
      mrEnclavesLen: dec.mrEnclavesLen,
      data: dec.data,
      dataLen: dec.dataLen,
      allowAuthorityOverrideAfter: dec.allowAuthorityOverrideAfter,
      requireAuthorityHeartbeatPermission:
        dec.requireAuthorityHeartbeatPermission,
      requireUsagePermissions: dec.requireUsagePermissions,
      maxQuoteVerificationAge: dec.maxQuoteVerificationAge,
      reward: dec.reward,
      lastHeartbeat: dec.lastHeartbeat,
      nodeTimeout: dec.nodeTimeout,
      currIdx: dec.currIdx,
      gcIdx: dec.gcIdx,
      ebuf: dec.ebuf,
    });
  }

  toJSON(): AttestationQueueAccountDataJSON {
    return {
      authority: this.authority.toString(),
      mrEnclaves: this.mrEnclaves,
      mrEnclavesLen: this.mrEnclavesLen,
      data: this.data.map((item) => item.toString()),
      dataLen: this.dataLen,
      allowAuthorityOverrideAfter: this.allowAuthorityOverrideAfter.toString(),
      requireAuthorityHeartbeatPermission:
        this.requireAuthorityHeartbeatPermission,
      requireUsagePermissions: this.requireUsagePermissions,
      maxQuoteVerificationAge: this.maxQuoteVerificationAge.toString(),
      reward: this.reward,
      lastHeartbeat: this.lastHeartbeat.toString(),
      nodeTimeout: this.nodeTimeout.toString(),
      currIdx: this.currIdx,
      gcIdx: this.gcIdx,
      ebuf: this.ebuf,
    };
  }

  static fromJSON(
    obj: AttestationQueueAccountDataJSON
  ): AttestationQueueAccountData {
    return new AttestationQueueAccountData({
      authority: new PublicKey(obj.authority),
      mrEnclaves: obj.mrEnclaves,
      mrEnclavesLen: obj.mrEnclavesLen,
      data: obj.data.map((item) => new PublicKey(item)),
      dataLen: obj.dataLen,
      allowAuthorityOverrideAfter: new BN(obj.allowAuthorityOverrideAfter),
      requireAuthorityHeartbeatPermission:
        obj.requireAuthorityHeartbeatPermission,
      requireUsagePermissions: obj.requireUsagePermissions,
      maxQuoteVerificationAge: new BN(obj.maxQuoteVerificationAge),
      reward: obj.reward,
      lastHeartbeat: new BN(obj.lastHeartbeat),
      nodeTimeout: new BN(obj.nodeTimeout),
      currIdx: obj.currIdx,
      gcIdx: obj.gcIdx,
      ebuf: obj.ebuf,
    });
  }
}
