import { SwitchboardProgram } from '../../SwitchboardProgram';
import { PublicKey, Connection } from '@solana/web3.js';
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VrfPoolAccountDataFields {
  stateBump: number;
  minInterval: number;
  /** ACCOUNTS */
  authority: PublicKey;
  queue: PublicKey;
  escrow: PublicKey;
  maxRows: number;
  size: number;
  idx: number;
  pool: Array<types.VrfPoolRowFields>;
}

export interface VrfPoolAccountDataJSON {
  stateBump: number;
  minInterval: number;
  /** ACCOUNTS */
  authority: string;
  queue: string;
  escrow: string;
  maxRows: number;
  size: number;
  idx: number;
  pool: Array<types.VrfPoolRowJSON>;
}

export class VrfPoolAccountData {
  readonly stateBump: number;
  readonly minInterval: number;
  /** ACCOUNTS */
  readonly authority: PublicKey;
  readonly queue: PublicKey;
  readonly escrow: PublicKey;
  readonly maxRows: number;
  readonly size: number;
  readonly idx: number;
  readonly pool: Array<types.VrfPoolRow>;

  static readonly discriminator = Buffer.from([
    86, 67, 58, 9, 46, 21, 101, 248,
  ]);

  static readonly layout = borsh.struct([
    borsh.u8('stateBump'),
    borsh.u32('minInterval'),
    borsh.publicKey('authority'),
    borsh.publicKey('queue'),
    borsh.publicKey('escrow'),
    borsh.u32('maxRows'),
    borsh.u32('size'),
    borsh.u32('idx'),
    borsh.vec(types.VrfPoolRow.layout(), 'pool'),
  ]);

  constructor(fields: VrfPoolAccountDataFields) {
    this.stateBump = fields.stateBump;
    this.minInterval = fields.minInterval;
    this.authority = fields.authority;
    this.queue = fields.queue;
    this.escrow = fields.escrow;
    this.maxRows = fields.maxRows;
    this.size = fields.size;
    this.idx = fields.idx;
    this.pool = fields.pool.map(item => new types.VrfPoolRow({ ...item }));
  }

  static async fetch(
    program: SwitchboardProgram,
    address: PublicKey
  ): Promise<VrfPoolAccountData | null> {
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
  ): Promise<Array<VrfPoolAccountData | null>> {
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

  static decode(data: Buffer): VrfPoolAccountData {
    if (!data.slice(0, 8).equals(VrfPoolAccountData.discriminator)) {
      throw new Error('invalid account discriminator');
    }

    const dec = VrfPoolAccountData.layout.decode(data.slice(8));

    return new VrfPoolAccountData({
      stateBump: dec.stateBump,
      minInterval: dec.minInterval,
      authority: dec.authority,
      queue: dec.queue,
      escrow: dec.escrow,
      maxRows: dec.maxRows,
      size: dec.size,
      idx: dec.idx,
      pool: dec.pool.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.VrfPoolRow.fromDecoded(item)
      ),
    });
  }

  toJSON(): VrfPoolAccountDataJSON {
    return {
      stateBump: this.stateBump,
      minInterval: this.minInterval,
      authority: this.authority.toString(),
      queue: this.queue.toString(),
      escrow: this.escrow.toString(),
      maxRows: this.maxRows,
      size: this.size,
      idx: this.idx,
      pool: this.pool.map(item => item.toJSON()),
    };
  }

  static fromJSON(obj: VrfPoolAccountDataJSON): VrfPoolAccountData {
    return new VrfPoolAccountData({
      stateBump: obj.stateBump,
      minInterval: obj.minInterval,
      authority: new PublicKey(obj.authority),
      queue: new PublicKey(obj.queue),
      escrow: new PublicKey(obj.escrow),
      maxRows: obj.maxRows,
      size: obj.size,
      idx: obj.idx,
      pool: obj.pool.map(item => types.VrfPoolRow.fromJSON(item)),
    });
  }
}
