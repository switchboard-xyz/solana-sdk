import { SwitchboardProgram } from '../../program';
import { PublicKey, Connection } from '@solana/web3.js';
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface BufferRelayerAccountDataFields {
  name: Array<number>;
  queuePubkey: PublicKey;
  escrow: PublicKey;
  authority: PublicKey;
  jobPubkey: PublicKey;
  jobHash: Array<number>;
  minUpdateDelaySeconds: number;
  isLocked: boolean;
  currentRound: types.BufferRelayerRoundFields;
  latestConfirmedRound: types.BufferRelayerRoundFields;
  result: Uint8Array;
}

export interface BufferRelayerAccountDataJSON {
  name: Array<number>;
  queuePubkey: string;
  escrow: string;
  authority: string;
  jobPubkey: string;
  jobHash: Array<number>;
  minUpdateDelaySeconds: number;
  isLocked: boolean;
  currentRound: types.BufferRelayerRoundJSON;
  latestConfirmedRound: types.BufferRelayerRoundJSON;
  result: Array<number>;
}

export class BufferRelayerAccountData {
  readonly name: Array<number>;
  readonly queuePubkey: PublicKey;
  readonly escrow: PublicKey;
  readonly authority: PublicKey;
  readonly jobPubkey: PublicKey;
  readonly jobHash: Array<number>;
  readonly minUpdateDelaySeconds: number;
  readonly isLocked: boolean;
  readonly currentRound: types.BufferRelayerRound;
  readonly latestConfirmedRound: types.BufferRelayerRound;
  readonly result: Uint8Array;

  static readonly discriminator = Buffer.from([
    50, 35, 51, 115, 169, 219, 158, 52,
  ]);

  static readonly layout = borsh.struct([
    borsh.array(borsh.u8(), 32, 'name'),
    borsh.publicKey('queuePubkey'),
    borsh.publicKey('escrow'),
    borsh.publicKey('authority'),
    borsh.publicKey('jobPubkey'),
    borsh.array(borsh.u8(), 32, 'jobHash'),
    borsh.u32('minUpdateDelaySeconds'),
    borsh.bool('isLocked'),
    types.BufferRelayerRound.layout('currentRound'),
    types.BufferRelayerRound.layout('latestConfirmedRound'),
    borsh.vecU8('result'),
  ]);

  constructor(fields: BufferRelayerAccountDataFields) {
    this.name = fields.name;
    this.queuePubkey = fields.queuePubkey;
    this.escrow = fields.escrow;
    this.authority = fields.authority;
    this.jobPubkey = fields.jobPubkey;
    this.jobHash = fields.jobHash;
    this.minUpdateDelaySeconds = fields.minUpdateDelaySeconds;
    this.isLocked = fields.isLocked;
    this.currentRound = new types.BufferRelayerRound({
      ...fields.currentRound,
    });
    this.latestConfirmedRound = new types.BufferRelayerRound({
      ...fields.latestConfirmedRound,
    });
    this.result = fields.result;
  }

  static async fetch(
    program: SwitchboardProgram,
    address: PublicKey
  ): Promise<BufferRelayerAccountData | null> {
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
  ): Promise<Array<BufferRelayerAccountData | null>> {
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

  static decode(data: Buffer): BufferRelayerAccountData {
    if (!data.slice(0, 8).equals(BufferRelayerAccountData.discriminator)) {
      throw new Error('invalid account discriminator');
    }

    const dec = BufferRelayerAccountData.layout.decode(data.slice(8));

    return new BufferRelayerAccountData({
      name: dec.name,
      queuePubkey: dec.queuePubkey,
      escrow: dec.escrow,
      authority: dec.authority,
      jobPubkey: dec.jobPubkey,
      jobHash: dec.jobHash,
      minUpdateDelaySeconds: dec.minUpdateDelaySeconds,
      isLocked: dec.isLocked,
      currentRound: types.BufferRelayerRound.fromDecoded(dec.currentRound),
      latestConfirmedRound: types.BufferRelayerRound.fromDecoded(
        dec.latestConfirmedRound
      ),
      result: new Uint8Array(
        dec.result.buffer,
        dec.result.byteOffset,
        dec.result.length
      ),
    });
  }

  toJSON(): BufferRelayerAccountDataJSON {
    return {
      name: this.name,
      queuePubkey: this.queuePubkey.toString(),
      escrow: this.escrow.toString(),
      authority: this.authority.toString(),
      jobPubkey: this.jobPubkey.toString(),
      jobHash: this.jobHash,
      minUpdateDelaySeconds: this.minUpdateDelaySeconds,
      isLocked: this.isLocked,
      currentRound: this.currentRound.toJSON(),
      latestConfirmedRound: this.latestConfirmedRound.toJSON(),
      result: Array.from(this.result.values()),
    };
  }

  static fromJSON(obj: BufferRelayerAccountDataJSON): BufferRelayerAccountData {
    return new BufferRelayerAccountData({
      name: obj.name,
      queuePubkey: new PublicKey(obj.queuePubkey),
      escrow: new PublicKey(obj.escrow),
      authority: new PublicKey(obj.authority),
      jobPubkey: new PublicKey(obj.jobPubkey),
      jobHash: obj.jobHash,
      minUpdateDelaySeconds: obj.minUpdateDelaySeconds,
      isLocked: obj.isLocked,
      currentRound: types.BufferRelayerRound.fromJSON(obj.currentRound),
      latestConfirmedRound: types.BufferRelayerRound.fromJSON(
        obj.latestConfirmedRound
      ),
      result: Uint8Array.from(obj.result),
    });
  }
}
