import { SwitchboardProgram } from '../../program';
import { PublicKey, Connection } from '@solana/web3.js';
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface CrankAccountDataFields {
  name: Array<number>;
  metadata: Array<number>;
  queuePubkey: PublicKey;
  pqSize: number;
  maxRows: number;
  jitterModifier: number;
  ebuf: Array<number>;
  dataBuffer: PublicKey;
}

export interface CrankAccountDataJSON {
  name: Array<number>;
  metadata: Array<number>;
  queuePubkey: string;
  pqSize: number;
  maxRows: number;
  jitterModifier: number;
  ebuf: Array<number>;
  dataBuffer: string;
}

export class CrankAccountData {
  readonly name: Array<number>;
  readonly metadata: Array<number>;
  readonly queuePubkey: PublicKey;
  readonly pqSize: number;
  readonly maxRows: number;
  readonly jitterModifier: number;
  readonly ebuf: Array<number>;
  readonly dataBuffer: PublicKey;

  static readonly discriminator = Buffer.from([
    111, 81, 146, 73, 172, 180, 134, 209,
  ]);

  static readonly layout = borsh.struct([
    borsh.array(borsh.u8(), 32, 'name'),
    borsh.array(borsh.u8(), 64, 'metadata'),
    borsh.publicKey('queuePubkey'),
    borsh.u32('pqSize'),
    borsh.u32('maxRows'),
    borsh.u8('jitterModifier'),
    borsh.array(borsh.u8(), 255, 'ebuf'),
    borsh.publicKey('dataBuffer'),
  ]);

  constructor(fields: CrankAccountDataFields) {
    this.name = fields.name;
    this.metadata = fields.metadata;
    this.queuePubkey = fields.queuePubkey;
    this.pqSize = fields.pqSize;
    this.maxRows = fields.maxRows;
    this.jitterModifier = fields.jitterModifier;
    this.ebuf = fields.ebuf;
    this.dataBuffer = fields.dataBuffer;
  }

  static async fetch(
    program: SwitchboardProgram,
    address: PublicKey
  ): Promise<CrankAccountData | null> {
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
  ): Promise<Array<CrankAccountData | null>> {
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

  static decode(data: Buffer): CrankAccountData {
    if (!data.slice(0, 8).equals(CrankAccountData.discriminator)) {
      throw new Error('invalid account discriminator');
    }

    const dec = CrankAccountData.layout.decode(data.slice(8));

    return new CrankAccountData({
      name: dec.name,
      metadata: dec.metadata,
      queuePubkey: dec.queuePubkey,
      pqSize: dec.pqSize,
      maxRows: dec.maxRows,
      jitterModifier: dec.jitterModifier,
      ebuf: dec.ebuf,
      dataBuffer: dec.dataBuffer,
    });
  }

  toJSON(): CrankAccountDataJSON {
    return {
      name: this.name,
      metadata: this.metadata,
      queuePubkey: this.queuePubkey.toString(),
      pqSize: this.pqSize,
      maxRows: this.maxRows,
      jitterModifier: this.jitterModifier,
      ebuf: this.ebuf,
      dataBuffer: this.dataBuffer.toString(),
    };
  }

  static fromJSON(obj: CrankAccountDataJSON): CrankAccountData {
    return new CrankAccountData({
      name: obj.name,
      metadata: obj.metadata,
      queuePubkey: new PublicKey(obj.queuePubkey),
      pqSize: obj.pqSize,
      maxRows: obj.maxRows,
      jitterModifier: obj.jitterModifier,
      ebuf: obj.ebuf,
      dataBuffer: new PublicKey(obj.dataBuffer),
    });
  }
}
