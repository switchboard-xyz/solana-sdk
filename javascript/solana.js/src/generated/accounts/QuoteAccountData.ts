import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Connection, PublicKey } from '@solana/web3.js';
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuoteAccountDataFields {
  node: PublicKey;
  nodeAuthority: PublicKey;
  queue: PublicKey;
  quoteBuffer: Array<number>;
  quoteLen: number;
  isReady: boolean;
  verificationStatus: number;
  verificationTimestamp: BN;
  validUntil: BN;
  ebuf: Array<number>;
}

export interface QuoteAccountDataJSON {
  node: string;
  nodeAuthority: string;
  queue: string;
  quoteBuffer: Array<number>;
  quoteLen: number;
  isReady: boolean;
  verificationStatus: number;
  verificationTimestamp: string;
  validUntil: string;
  ebuf: Array<number>;
}

export class QuoteAccountData {
  readonly node: PublicKey;
  readonly nodeAuthority: PublicKey;
  readonly queue: PublicKey;
  readonly quoteBuffer: Array<number>;
  readonly quoteLen: number;
  readonly isReady: boolean;
  readonly verificationStatus: number;
  readonly verificationTimestamp: BN;
  readonly validUntil: BN;
  readonly ebuf: Array<number>;

  static readonly discriminator = Buffer.from([
    205, 205, 167, 232, 0, 74, 44, 160,
  ]);

  static readonly layout = borsh.struct([
    borsh.publicKey('node'),
    borsh.publicKey('nodeAuthority'),
    borsh.publicKey('queue'),
    borsh.array(borsh.u8(), 8192, 'quoteBuffer'),
    borsh.u32('quoteLen'),
    borsh.bool('isReady'),
    borsh.u8('verificationStatus'),
    borsh.i64('verificationTimestamp'),
    borsh.i64('validUntil'),
    borsh.array(borsh.u8(), 1024, 'ebuf'),
  ]);

  constructor(fields: QuoteAccountDataFields) {
    this.node = fields.node;
    this.nodeAuthority = fields.nodeAuthority;
    this.queue = fields.queue;
    this.quoteBuffer = fields.quoteBuffer;
    this.quoteLen = fields.quoteLen;
    this.isReady = fields.isReady;
    this.verificationStatus = fields.verificationStatus;
    this.verificationTimestamp = fields.verificationTimestamp;
    this.validUntil = fields.validUntil;
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
    if (!info.owner.equals(program.programId)) {
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
      if (!info.owner.equals(program.programId)) {
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
      node: dec.node,
      nodeAuthority: dec.nodeAuthority,
      queue: dec.queue,
      quoteBuffer: dec.quoteBuffer,
      quoteLen: dec.quoteLen,
      isReady: dec.isReady,
      verificationStatus: dec.verificationStatus,
      verificationTimestamp: dec.verificationTimestamp,
      validUntil: dec.validUntil,
      ebuf: dec.ebuf,
    });
  }

  toJSON(): QuoteAccountDataJSON {
    return {
      node: this.node.toString(),
      nodeAuthority: this.nodeAuthority.toString(),
      queue: this.queue.toString(),
      quoteBuffer: this.quoteBuffer,
      quoteLen: this.quoteLen,
      isReady: this.isReady,
      verificationStatus: this.verificationStatus,
      verificationTimestamp: this.verificationTimestamp.toString(),
      validUntil: this.validUntil.toString(),
      ebuf: this.ebuf,
    };
  }

  static fromJSON(obj: QuoteAccountDataJSON): QuoteAccountData {
    return new QuoteAccountData({
      node: new PublicKey(obj.node),
      nodeAuthority: new PublicKey(obj.nodeAuthority),
      queue: new PublicKey(obj.queue),
      quoteBuffer: obj.quoteBuffer,
      quoteLen: obj.quoteLen,
      isReady: obj.isReady,
      verificationStatus: obj.verificationStatus,
      verificationTimestamp: new BN(obj.verificationTimestamp),
      validUntil: new BN(obj.validUntil),
      ebuf: obj.ebuf,
    });
  }
}
