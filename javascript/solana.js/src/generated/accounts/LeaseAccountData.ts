import { SwitchboardProgram } from '../../program';
import { PublicKey, Connection } from '@solana/web3.js';
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface LeaseAccountDataFields {
  escrow: PublicKey;
  queue: PublicKey;
  aggregator: PublicKey;
  tokenProgram: PublicKey;
  isActive: boolean;
  crankRowCount: number;
  createdAt: BN;
  updateCount: BN;
  withdrawAuthority: PublicKey;
  ebuf: Array<number>;
}

export interface LeaseAccountDataJSON {
  escrow: string;
  queue: string;
  aggregator: string;
  tokenProgram: string;
  isActive: boolean;
  crankRowCount: number;
  createdAt: string;
  updateCount: string;
  withdrawAuthority: string;
  ebuf: Array<number>;
}

export class LeaseAccountData {
  readonly escrow: PublicKey;
  readonly queue: PublicKey;
  readonly aggregator: PublicKey;
  readonly tokenProgram: PublicKey;
  readonly isActive: boolean;
  readonly crankRowCount: number;
  readonly createdAt: BN;
  readonly updateCount: BN;
  readonly withdrawAuthority: PublicKey;
  readonly ebuf: Array<number>;

  static readonly discriminator = Buffer.from([
    55, 254, 208, 251, 164, 44, 150, 50,
  ]);

  static readonly layout = borsh.struct([
    borsh.publicKey('escrow'),
    borsh.publicKey('queue'),
    borsh.publicKey('aggregator'),
    borsh.publicKey('tokenProgram'),
    borsh.bool('isActive'),
    borsh.u32('crankRowCount'),
    borsh.i64('createdAt'),
    borsh.u128('updateCount'),
    borsh.publicKey('withdrawAuthority'),
    borsh.array(borsh.u8(), 256, 'ebuf'),
  ]);

  constructor(fields: LeaseAccountDataFields) {
    this.escrow = fields.escrow;
    this.queue = fields.queue;
    this.aggregator = fields.aggregator;
    this.tokenProgram = fields.tokenProgram;
    this.isActive = fields.isActive;
    this.crankRowCount = fields.crankRowCount;
    this.createdAt = fields.createdAt;
    this.updateCount = fields.updateCount;
    this.withdrawAuthority = fields.withdrawAuthority;
    this.ebuf = fields.ebuf;
  }

  static async fetch(
    program: SwitchboardProgram,
    address: PublicKey
  ): Promise<LeaseAccountData | null> {
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
  ): Promise<Array<LeaseAccountData | null>> {
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

  static decode(data: Buffer): LeaseAccountData {
    if (!data.slice(0, 8).equals(LeaseAccountData.discriminator)) {
      throw new Error('invalid account discriminator');
    }

    const dec = LeaseAccountData.layout.decode(data.slice(8));

    return new LeaseAccountData({
      escrow: dec.escrow,
      queue: dec.queue,
      aggregator: dec.aggregator,
      tokenProgram: dec.tokenProgram,
      isActive: dec.isActive,
      crankRowCount: dec.crankRowCount,
      createdAt: dec.createdAt,
      updateCount: dec.updateCount,
      withdrawAuthority: dec.withdrawAuthority,
      ebuf: dec.ebuf,
    });
  }

  toJSON(): LeaseAccountDataJSON {
    return {
      escrow: this.escrow.toString(),
      queue: this.queue.toString(),
      aggregator: this.aggregator.toString(),
      tokenProgram: this.tokenProgram.toString(),
      isActive: this.isActive,
      crankRowCount: this.crankRowCount,
      createdAt: this.createdAt.toString(),
      updateCount: this.updateCount.toString(),
      withdrawAuthority: this.withdrawAuthority.toString(),
      ebuf: this.ebuf,
    };
  }

  static fromJSON(obj: LeaseAccountDataJSON): LeaseAccountData {
    return new LeaseAccountData({
      escrow: new PublicKey(obj.escrow),
      queue: new PublicKey(obj.queue),
      aggregator: new PublicKey(obj.aggregator),
      tokenProgram: new PublicKey(obj.tokenProgram),
      isActive: obj.isActive,
      crankRowCount: obj.crankRowCount,
      createdAt: new BN(obj.createdAt),
      updateCount: new BN(obj.updateCount),
      withdrawAuthority: new PublicKey(obj.withdrawAuthority),
      ebuf: obj.ebuf,
    });
  }
}
