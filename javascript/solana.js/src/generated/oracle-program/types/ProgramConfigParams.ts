import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh";

export interface ProgramConfigParamsFields {
  token: PublicKey;
  bump: number;
  daoMint: PublicKey;
  addEnclaves: Array<Array<number>>;
  rmEnclaves: Array<Array<number>>;
}

export interface ProgramConfigParamsJSON {
  token: string;
  bump: number;
  daoMint: string;
  addEnclaves: Array<Array<number>>;
  rmEnclaves: Array<Array<number>>;
}

export class ProgramConfigParams {
  readonly token: PublicKey;
  readonly bump: number;
  readonly daoMint: PublicKey;
  readonly addEnclaves: Array<Array<number>>;
  readonly rmEnclaves: Array<Array<number>>;

  constructor(fields: ProgramConfigParamsFields) {
    this.token = fields.token;
    this.bump = fields.bump;
    this.daoMint = fields.daoMint;
    this.addEnclaves = fields.addEnclaves;
    this.rmEnclaves = fields.rmEnclaves;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.publicKey("token"),
        borsh.u8("bump"),
        borsh.publicKey("daoMint"),
        borsh.vec(borsh.array(borsh.u8(), 32), "addEnclaves"),
        borsh.vec(borsh.array(borsh.u8(), 32), "rmEnclaves"),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new ProgramConfigParams({
      token: obj.token,
      bump: obj.bump,
      daoMint: obj.daoMint,
      addEnclaves: obj.addEnclaves,
      rmEnclaves: obj.rmEnclaves,
    });
  }

  static toEncodable(fields: ProgramConfigParamsFields) {
    return {
      token: fields.token,
      bump: fields.bump,
      daoMint: fields.daoMint,
      addEnclaves: fields.addEnclaves,
      rmEnclaves: fields.rmEnclaves,
    };
  }

  toJSON(): ProgramConfigParamsJSON {
    return {
      token: this.token.toString(),
      bump: this.bump,
      daoMint: this.daoMint.toString(),
      addEnclaves: this.addEnclaves,
      rmEnclaves: this.rmEnclaves,
    };
  }

  static fromJSON(obj: ProgramConfigParamsJSON): ProgramConfigParams {
    return new ProgramConfigParams({
      token: new PublicKey(obj.token),
      bump: obj.bump,
      daoMint: new PublicKey(obj.daoMint),
      addEnclaves: obj.addEnclaves,
      rmEnclaves: obj.rmEnclaves,
    });
  }

  toEncodable() {
    return ProgramConfigParams.toEncodable(this);
  }
}
