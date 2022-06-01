import * as borsh from "@project-serum/borsh"
import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface CallbackFields {
  programId: PublicKey
  accounts: Array<types.AccountMetaBorshFields>
  ixData: Array<number>
}

export interface CallbackJSON {
  programId: string
  accounts: Array<types.AccountMetaBorshJSON>
  ixData: Array<number>
}

export class Callback {
  readonly programId: PublicKey
  readonly accounts: Array<types.AccountMetaBorsh>
  readonly ixData: Array<number>

  constructor(fields: CallbackFields) {
    this.programId = fields.programId
    this.accounts = fields.accounts.map(
      (item) => new types.AccountMetaBorsh({ ...item })
    )
    this.ixData = fields.ixData
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.publicKey("programId"),
        borsh.vec(types.AccountMetaBorsh.layout(), "accounts"),
        borsh.vecU8("ixData"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new Callback({
      programId: obj.programId,
      accounts: obj.accounts.map((item) =>
        types.AccountMetaBorsh.fromDecoded(item)
      ),
      ixData: Array.from(obj.ixData),
    })
  }

  static toEncodable(fields: CallbackFields) {
    return {
      programId: fields.programId,
      accounts: fields.accounts.map((item) =>
        types.AccountMetaBorsh.toEncodable(item)
      ),
      ixData: Buffer.from(fields.ixData),
    }
  }

  toJSON(): CallbackJSON {
    return {
      programId: this.programId.toString(),
      accounts: this.accounts.map((item) => item.toJSON()),
      ixData: this.ixData,
    }
  }

  static fromJSON(obj: CallbackJSON): Callback {
    return new Callback({
      programId: new PublicKey(obj.programId),
      accounts: obj.accounts.map((item) =>
        types.AccountMetaBorsh.fromJSON(item)
      ),
      ixData: obj.ixData,
    })
  }

  toEncodable() {
    return Callback.toEncodable(this)
  }
}
