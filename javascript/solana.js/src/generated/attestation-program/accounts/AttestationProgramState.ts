import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import type { PublicKey } from "@solana/web3.js";
import { Connection } from "@solana/web3.js";
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AttestationProgramStateFields {
  bump: number;
  ebuf: Array<number>;
}

export interface AttestationProgramStateJSON {
  bump: number;
  ebuf: Array<number>;
}

export class AttestationProgramState {
  readonly bump: number;
  readonly ebuf: Array<number>;

  static readonly discriminator = Buffer.from([
    42, 145, 190, 11, 203, 77, 146, 231,
  ]);

  static readonly layout = borsh.struct([
    borsh.u8("bump"),
    borsh.array(borsh.u8(), 2048, "ebuf"),
  ]);

  constructor(fields: AttestationProgramStateFields) {
    this.bump = fields.bump;
    this.ebuf = fields.ebuf;
  }

  static async fetch(
    program: SwitchboardProgram,
    address: PublicKey,
    programId: PublicKey = program.attestationProgramId
  ): Promise<AttestationProgramState | null> {
    const info = await program.connection.getAccountInfo(address);

    if (info === null) {
      return null;
    }
    if (!info.owner.equals(programId)) {
      throw new Error("account doesn't belong to this program");
    }

    return this.decode(info.data);
  }

  static async fetchMultiple(
    program: SwitchboardProgram,
    addresses: PublicKey[],
    programId: PublicKey = program.attestationProgramId
  ): Promise<Array<AttestationProgramState | null>> {
    const infos = await program.connection.getMultipleAccountsInfo(addresses);

    return infos.map((info) => {
      if (info === null) {
        return null;
      }
      if (!info.owner.equals(programId)) {
        throw new Error("account doesn't belong to this program");
      }

      return this.decode(info.data);
    });
  }

  static decode(data: Buffer): AttestationProgramState {
    if (!data.slice(0, 8).equals(AttestationProgramState.discriminator)) {
      throw new Error("invalid account discriminator");
    }

    const dec = AttestationProgramState.layout.decode(data.slice(8));

    return new AttestationProgramState({
      bump: dec.bump,
      ebuf: dec.ebuf,
    });
  }

  toJSON(): AttestationProgramStateJSON {
    return {
      bump: this.bump,
      ebuf: this.ebuf,
    };
  }

  static fromJSON(obj: AttestationProgramStateJSON): AttestationProgramState {
    return new AttestationProgramState({
      bump: obj.bump,
      ebuf: obj.ebuf,
    });
  }
}
