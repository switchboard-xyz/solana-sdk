import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { Connection, PublicKey } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VrfAccountDataFields {
  status: types.VrfStatusKind
  counter: BN
  authority: PublicKey
  oracleQueue: PublicKey
  escrow: PublicKey
  callback: types.CallbackZCFields
  batchSize: number
  builders: Array<types.VrfBuilderFields>
  buildersLen: number
  testMode: boolean
  currentRound: types.VrfRoundFields
  ebuf: Array<number>
}

export interface VrfAccountDataJSON {
  status: types.VrfStatusJSON
  counter: string
  authority: string
  oracleQueue: string
  escrow: string
  callback: types.CallbackZCJSON
  batchSize: number
  builders: Array<types.VrfBuilderJSON>
  buildersLen: number
  testMode: boolean
  currentRound: types.VrfRoundJSON
  ebuf: Array<number>
}

export class VrfAccountData {
  readonly status: types.VrfStatusKind
  readonly counter: BN
  readonly authority: PublicKey
  readonly oracleQueue: PublicKey
  readonly escrow: PublicKey
  readonly callback: types.CallbackZC
  readonly batchSize: number
  readonly builders: Array<types.VrfBuilder>
  readonly buildersLen: number
  readonly testMode: boolean
  readonly currentRound: types.VrfRound
  readonly ebuf: Array<number>

  static readonly discriminator = Buffer.from([
    101, 35, 62, 239, 103, 151, 6, 18,
  ])

  static readonly layout = borsh.struct([
    types.VrfStatus.layout("status"),
    borsh.u128("counter"),
    borsh.publicKey("authority"),
    borsh.publicKey("oracleQueue"),
    borsh.publicKey("escrow"),
    types.CallbackZC.layout("callback"),
    borsh.u32("batchSize"),
    borsh.array(types.VrfBuilder.layout(), 8, "builders"),
    borsh.u32("buildersLen"),
    borsh.bool("testMode"),
    types.VrfRound.layout("currentRound"),
    borsh.array(borsh.u8(), 1024, "ebuf"),
  ])

  constructor(fields: VrfAccountDataFields) {
    this.status = fields.status
    this.counter = fields.counter
    this.authority = fields.authority
    this.oracleQueue = fields.oracleQueue
    this.escrow = fields.escrow
    this.callback = new types.CallbackZC({ ...fields.callback })
    this.batchSize = fields.batchSize
    this.builders = fields.builders.map(
      (item) => new types.VrfBuilder({ ...item })
    )
    this.buildersLen = fields.buildersLen
    this.testMode = fields.testMode
    this.currentRound = new types.VrfRound({ ...fields.currentRound })
    this.ebuf = fields.ebuf
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<VrfAccountData | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<VrfAccountData | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): VrfAccountData {
    if (!data.slice(0, 8).equals(VrfAccountData.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = VrfAccountData.layout.decode(data.slice(8))

    return new VrfAccountData({
      status: types.VrfStatus.fromDecoded(dec.status),
      counter: dec.counter,
      authority: dec.authority,
      oracleQueue: dec.oracleQueue,
      escrow: dec.escrow,
      callback: types.CallbackZC.fromDecoded(dec.callback),
      batchSize: dec.batchSize,
      builders: dec.builders.map((item) => types.VrfBuilder.fromDecoded(item)),
      buildersLen: dec.buildersLen,
      testMode: dec.testMode,
      currentRound: types.VrfRound.fromDecoded(dec.currentRound),
      ebuf: dec.ebuf,
    })
  }

  toJSON(): VrfAccountDataJSON {
    return {
      status: this.status.toJSON(),
      counter: this.counter.toString(),
      authority: this.authority.toString(),
      oracleQueue: this.oracleQueue.toString(),
      escrow: this.escrow.toString(),
      callback: this.callback.toJSON(),
      batchSize: this.batchSize,
      builders: this.builders.map((item) => item.toJSON()),
      buildersLen: this.buildersLen,
      testMode: this.testMode,
      currentRound: this.currentRound.toJSON(),
      ebuf: this.ebuf,
    }
  }

  static fromJSON(obj: VrfAccountDataJSON): VrfAccountData {
    return new VrfAccountData({
      status: types.VrfStatus.fromJSON(obj.status),
      counter: new BN(obj.counter),
      authority: new PublicKey(obj.authority),
      oracleQueue: new PublicKey(obj.oracleQueue),
      escrow: new PublicKey(obj.escrow),
      callback: types.CallbackZC.fromJSON(obj.callback),
      batchSize: obj.batchSize,
      builders: obj.builders.map((item) => types.VrfBuilder.fromJSON(item)),
      buildersLen: obj.buildersLen,
      testMode: obj.testMode,
      currentRound: types.VrfRound.fromJSON(obj.currentRound),
      ebuf: obj.ebuf,
    })
  }
}
