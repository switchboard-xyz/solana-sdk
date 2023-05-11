import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Connection, PublicKey } from '@solana/web3.js';
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface ServiceQueueAccountDataFields {
  authority: PublicKey;
  mrEnclaves: Array<Array<number>>;
  mrEnclavesLen: number;
  data: Array<PublicKey>;
  dataLen: number;
  allowAuthorityOverrideAfter: BN;
  requireAuthorityHeartbeatPermission: boolean;
  requireUsagePermissions: boolean;
  maxQuoteVerificationAge: BN;
  reward: number;
  lastHeartbeat: BN;
  nodeTimeout: BN;
  currIdx: number;
  gcIdx: number;
  ebuf: Array<number>;
}

export interface ServiceQueueAccountDataJSON {
  authority: string;
  mrEnclaves: Array<Array<number>>;
  mrEnclavesLen: number;
  data: Array<string>;
  dataLen: number;
  allowAuthorityOverrideAfter: string;
  requireAuthorityHeartbeatPermission: boolean;
  requireUsagePermissions: boolean;
  maxQuoteVerificationAge: string;
  reward: number;
  lastHeartbeat: string;
  nodeTimeout: string;
  currIdx: number;
  gcIdx: number;
  ebuf: Array<number>;
}

export class ServiceQueueAccountData {
  readonly authority: PublicKey;
  readonly mrEnclaves: Array<Array<number>>;
  readonly mrEnclavesLen: number;
  readonly data: Array<PublicKey>;
  readonly dataLen: number;
  readonly allowAuthorityOverrideAfter: BN;
  readonly requireAuthorityHeartbeatPermission: boolean;
  readonly requireUsagePermissions: boolean;
  readonly maxQuoteVerificationAge: BN;
  readonly reward: number;
  readonly lastHeartbeat: BN;
  readonly nodeTimeout: BN;
  readonly currIdx: number;
  readonly gcIdx: number;
  readonly ebuf: Array<number>;

  static readonly discriminator = Buffer.from([
    91, 214, 219, 103, 28, 187, 80, 194,
  ]);

  static readonly layout = borsh.struct([
    borsh.publicKey('authority'),
    borsh.array(borsh.array(borsh.u8(), 32), 32, 'mrEnclaves'),
    borsh.u32('mrEnclavesLen'),
    borsh.array(borsh.publicKey(), 32, 'data'),
    borsh.u32('dataLen'),
    borsh.i64('allowAuthorityOverrideAfter'),
    borsh.bool('requireAuthorityHeartbeatPermission'),
    borsh.bool('requireUsagePermissions'),
    borsh.i64('maxQuoteVerificationAge'),
    borsh.u32('reward'),
    borsh.i64('lastHeartbeat'),
    borsh.i64('nodeTimeout'),
    borsh.u32('currIdx'),
    borsh.u32('gcIdx'),
    borsh.array(borsh.u8(), 1024, 'ebuf'),
  ]);

  constructor(fields: ServiceQueueAccountDataFields) {
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
  ): Promise<ServiceQueueAccountData | null> {
    const info = await program.connection.getAccountInfo(address);

    if (info === null) {
      return null;
    }
    if (!info.owner.equals(program.programId)) {
      throw new Error("account doesn't belong to this program");
    }

    return this.decode(info.data);
  }

  static async fetchMultiple(
    program: SwitchboardProgram,
    addresses: PublicKey[]
  ): Promise<Array<ServiceQueueAccountData | null>> {
    const infos = await program.connection.getMultipleAccountsInfo(addresses);

    return infos.map(info => {
      if (info === null) {
        return null;
      }
      if (!info.owner.equals(program.programId)) {
        throw new Error("account doesn't belong to this program");
      }

      return this.decode(info.data);
    });
  }

  static decode(data: Buffer): ServiceQueueAccountData {
    if (!data.slice(0, 8).equals(ServiceQueueAccountData.discriminator)) {
      throw new Error('invalid account discriminator');
    }

    const dec = ServiceQueueAccountData.layout.decode(data.slice(8));

    return new ServiceQueueAccountData({
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

  toJSON(): ServiceQueueAccountDataJSON {
    return {
      authority: this.authority.toString(),
      mrEnclaves: this.mrEnclaves,
      mrEnclavesLen: this.mrEnclavesLen,
      data: this.data.map(item => item.toString()),
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

  static fromJSON(obj: ServiceQueueAccountDataJSON): ServiceQueueAccountData {
    return new ServiceQueueAccountData({
      authority: new PublicKey(obj.authority),
      mrEnclaves: obj.mrEnclaves,
      mrEnclavesLen: obj.mrEnclavesLen,
      data: obj.data.map(item => new PublicKey(item)),
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
