import * as borsh from "@project-serum/borsh"
import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface ProgramConfigParamsFields {
  token: PublicKey
  bump: number
}

export interface ProgramConfigParamsJSON {
  token: string
  bump: number
}

export class ProgramConfigParams {
  readonly token: PublicKey
  readonly bump: number

  constructor(fields: ProgramConfigParamsFields) {
    this.token = fields.token
    this.bump = fields.bump
  }

  static layout(property?: string) {
    return borsh.struct([borsh.publicKey("token"), borsh.u8("bump")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new ProgramConfigParams({
      token: obj.token,
      bump: obj.bump,
    })
  }

  static toEncodable(fields: ProgramConfigParamsFields) {
    return {
      token: fields.token,
      bump: fields.bump,
    }
  }

  toJSON(): ProgramConfigParamsJSON {
    return {
      token: this.token.toString(),
      bump: this.bump,
    }
  }

  static fromJSON(obj: ProgramConfigParamsJSON): ProgramConfigParams {
    return new ProgramConfigParams({
      token: new PublicKey(obj.token),
      bump: obj.bump,
    })
  }

  toEncodable() {
    return ProgramConfigParams.toEncodable(this)
  }
}
