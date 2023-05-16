import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Connection, PublicKey } from '@solana/web3.js';
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuoteAccountDataFields {
  delegatedSecuredSigner: PublicKey;
  bump: number;
  quoteRegistry: Array<number>;
  bufferKey: Array<number>;
  verifierQueue: PublicKey;
  mrEnclave: Array<number>;
  verificationStatus: number;
  verificationTimestamp: BN;
  validUntil: BN;
  isOnQueue: boolean;
  lastHeartbeat: BN;
  ebuf: Array<number>;
}

export interface QuoteAccountDataJSON {
  delegatedSecuredSigner: string;
  bump: number;
  quoteRegistry: Array<number>;
  bufferKey: Array<number>;
  verifierQueue: string;
  mrEnclave: Array<number>;
  verificationStatus: number;
  verificationTimestamp: string;
  validUntil: string;
  isOnQueue: boolean;
  lastHeartbeat: string;
  ebuf: Array<number>;
}

export class QuoteAccountData {
  readonly delegatedSecuredSigner: PublicKey;
  readonly bump: number;
  readonly quoteRegistry: Array<number>;
  readonly bufferKey: Array<number>;
  readonly verifierQueue: PublicKey;
  readonly mrEnclave: Array<number>;
  readonly verificationStatus: number;
  readonly verificationTimestamp: BN;
  readonly validUntil: BN;
  readonly isOnQueue: boolean;
  readonly lastHeartbeat: BN;
  readonly ebuf: Array<number>;

  static readonly discriminator = Buffer.from([
    205, 205, 167, 232, 0, 74, 44, 160,
  ]);

  static readonly layout = borsh.struct([
    borsh.publicKey('delegatedSecuredSigner'),
    borsh.u8('bump'),
    borsh.array(borsh.u8(), 32, 'quoteRegistry'),
    borsh.array(borsh.u8(), 64, 'bufferKey'),
    borsh.publicKey('verifierQueue'),
    borsh.array(borsh.u8(), 32, 'mrEnclave'),
    borsh.u8('verificationStatus'),
    borsh.i64('verificationTimestamp'),
    borsh.i64('validUntil'),
    borsh.bool('isOnQueue'),
    borsh.i64('lastHeartbeat'),
    borsh.array(borsh.u8(), 1024, 'ebuf'),
  ]);

  constructor(fields: QuoteAccountDataFields) {
    this.delegatedSecuredSigner = fields.delegatedSecuredSigner;
    this.bump = fields.bump;
    this.quoteRegistry = fields.quoteRegistry;
    this.bufferKey = fields.bufferKey;
    this.verifierQueue = fields.verifierQueue;
    this.mrEnclave = fields.mrEnclave;
    this.verificationStatus = fields.verificationStatus;
    this.verificationTimestamp = fields.verificationTimestamp;
    this.validUntil = fields.validUntil;
    this.isOnQueue = fields.isOnQueue;
    this.lastHeartbeat = fields.lastHeartbeat;
    this.ebuf = fields.ebuf;
  }

  static async fetch(
    program: SwitchboardProgram,
    address: PublicKey
  ): Promise<QuoteAccountData | null> {
    const info = await program.connection.getAccountInfo(address);

    if (info === null) {
      return null;
    }
    if (!info.owner.equals(program.sgxProgramId)) {
      throw new Error("account doesn't belong to this program");
    }

    return this.decode(info.data);
  }

  static async fetchMultiple(
    program: SwitchboardProgram,
    addresses: PublicKey[]
  ): Promise<Array<QuoteAccountData | null>> {
    const infos = await program.connection.getMultipleAccountsInfo(addresses);

    return infos.map(info => {
      if (info === null) {
        return null;
      }
      if (!info.owner.equals(program.sgxProgramId)) {
        throw new Error("account doesn't belong to this program");
      }

      return this.decode(info.data);
    });
  }

  static decode(data: Buffer): QuoteAccountData {
    if (!data.slice(0, 8).equals(QuoteAccountData.discriminator)) {
      throw new Error('invalid account discriminator');
    }

    const dec = QuoteAccountData.layout.decode(data.slice(8));

    return new QuoteAccountData({
      delegatedSecuredSigner: dec.delegatedSecuredSigner,
      bump: dec.bump,
      quoteRegistry: dec.quoteRegistry,
      bufferKey: dec.bufferKey,
      verifierQueue: dec.verifierQueue,
      mrEnclave: dec.mrEnclave,
      verificationStatus: dec.verificationStatus,
      verificationTimestamp: dec.verificationTimestamp,
      validUntil: dec.validUntil,
      isOnQueue: dec.isOnQueue,
      lastHeartbeat: dec.lastHeartbeat,
      ebuf: dec.ebuf,
    });
  }

  toJSON(): QuoteAccountDataJSON {
    return {
      delegatedSecuredSigner: this.delegatedSecuredSigner.toString(),
      bump: this.bump,
      quoteRegistry: this.quoteRegistry,
      bufferKey: this.bufferKey,
      verifierQueue: this.verifierQueue.toString(),
      mrEnclave: this.mrEnclave,
      verificationStatus: this.verificationStatus,
      verificationTimestamp: this.verificationTimestamp.toString(),
      validUntil: this.validUntil.toString(),
      isOnQueue: this.isOnQueue,
      lastHeartbeat: this.lastHeartbeat.toString(),
      ebuf: this.ebuf,
    };
  }

  static fromJSON(obj: QuoteAccountDataJSON): QuoteAccountData {
    return new QuoteAccountData({
      delegatedSecuredSigner: new PublicKey(obj.delegatedSecuredSigner),
      bump: obj.bump,
      quoteRegistry: obj.quoteRegistry,
      bufferKey: obj.bufferKey,
      verifierQueue: new PublicKey(obj.verifierQueue),
      mrEnclave: obj.mrEnclave,
      verificationStatus: obj.verificationStatus,
      verificationTimestamp: new BN(obj.verificationTimestamp),
      validUntil: new BN(obj.validUntil),
      isOnQueue: obj.isOnQueue,
      lastHeartbeat: new BN(obj.lastHeartbeat),
      ebuf: obj.ebuf,
    });
  }
}
