import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Connection, PublicKey } from '@solana/web3.js';
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface StateFields {
  bump: number;
  ebuf: Array<number>;
}

export interface StateJSON {
  bump: number;
  ebuf: Array<number>;
}

export class State {
  readonly bump: number;
  readonly ebuf: Array<number>;

  static readonly discriminator = Buffer.from([
    216, 146, 107, 94, 104, 75, 182, 177,
  ]);

  static readonly layout = borsh.struct([
    borsh.u8('bump'),
    borsh.array(borsh.u8(), 2048, 'ebuf'),
  ]);

  constructor(fields: StateFields) {
    this.bump = fields.bump;
    this.ebuf = fields.ebuf;
  }

  static async fetch(
    program: SwitchboardProgram,
    address: PublicKey
  ): Promise<State | null> {
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
  ): Promise<Array<State | null>> {
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

  static decode(data: Buffer): State {
    if (!data.slice(0, 8).equals(State.discriminator)) {
      throw new Error('invalid account discriminator');
    }

    const dec = State.layout.decode(data.slice(8));

    return new State({
      bump: dec.bump,
      ebuf: dec.ebuf,
    });
  }

  toJSON(): StateJSON {
    return {
      bump: this.bump,
      ebuf: this.ebuf,
    };
  }

  static fromJSON(obj: StateJSON): State {
    return new State({
      bump: obj.bump,
      ebuf: obj.ebuf,
    });
  }
}
