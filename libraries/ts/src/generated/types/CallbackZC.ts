import * as borsh from "@project-serum/borsh"
import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface CallbackZCFields {
  programId: PublicKey
  accounts: Array<types.AccountMetaZCFields>
  accountsLen: number
  ixData: Array<number>
  ixDataLen: number
}

export interface CallbackZCJSON {
  programId: string
  accounts: Array<types.AccountMetaZCJSON>
  accountsLen: number
  ixData: Array<number>
  ixDataLen: number
}

export class CallbackZC {
  readonly programId: PublicKey
  readonly accounts: Array<types.AccountMetaZC>
  readonly accountsLen: number
  readonly ixData: Array<number>
  readonly ixDataLen: number

  constructor(fields: CallbackZCFields) {
    this.programId = fields.programId
    this.accounts = fields.accounts.map(
      (item) => new types.AccountMetaZC({ ...item })
    )
    this.accountsLen = fields.accountsLen
    this.ixData = fields.ixData
    this.ixDataLen = fields.ixDataLen
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.publicKey("programId"),
        borsh.array(types.AccountMetaZC.layout(), 32, "accounts"),
        borsh.u32("accountsLen"),
        borsh.array(borsh.u8(), 1024, "ixData"),
        borsh.u32("ixDataLen"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new CallbackZC({
      programId: obj.programId,
      accounts: obj.accounts.map((item) =>
        types.AccountMetaZC.fromDecoded(item)
      ),
      accountsLen: obj.accountsLen,
      ixData: obj.ixData,
      ixDataLen: obj.ixDataLen,
    })
  }

  static toEncodable(fields: CallbackZCFields) {
    return {
      programId: fields.programId,
      accounts: fields.accounts.map((item) =>
        types.AccountMetaZC.toEncodable(item)
      ),
      accountsLen: fields.accountsLen,
      ixData: fields.ixData,
      ixDataLen: fields.ixDataLen,
    }
  }

  toJSON(): CallbackZCJSON {
    return {
      programId: this.programId.toString(),
      accounts: this.accounts.map((item) => item.toJSON()),
      accountsLen: this.accountsLen,
      ixData: this.ixData,
      ixDataLen: this.ixDataLen,
    }
  }

  static fromJSON(obj: CallbackZCJSON): CallbackZC {
    return new CallbackZC({
      programId: new PublicKey(obj.programId),
      accounts: obj.accounts.map((item) => types.AccountMetaZC.fromJSON(item)),
      accountsLen: obj.accountsLen,
      ixData: obj.ixData,
      ixDataLen: obj.ixDataLen,
    })
  }

  toEncodable() {
    return CallbackZC.toEncodable(this)
  }
}
