import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { Connection, PublicKey } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface JobAccountDataFields {
  name: Array<number>
  metadata: Array<number>
  authorWallet: PublicKey
  expiration: BN
  hash: Array<number>
  data: Array<number>
  referenceCount: number
  totalSpent: BN
}

export interface JobAccountDataJSON {
  name: Array<number>
  metadata: Array<number>
  authorWallet: string
  expiration: string
  hash: Array<number>
  data: Array<number>
  referenceCount: number
  totalSpent: string
}

export class JobAccountData {
  readonly name: Array<number>
  readonly metadata: Array<number>
  readonly authorWallet: PublicKey
  readonly expiration: BN
  readonly hash: Array<number>
  readonly data: Array<number>
  readonly referenceCount: number
  readonly totalSpent: BN

  static readonly discriminator = Buffer.from([
    124, 69, 101, 195, 229, 218, 144, 63,
  ])

  static readonly layout = borsh.struct([
    borsh.array(borsh.u8(), 32, "name"),
    borsh.array(borsh.u8(), 64, "metadata"),
    borsh.publicKey("authorWallet"),
    borsh.i64("expiration"),
    borsh.array(borsh.u8(), 32, "hash"),
    borsh.vecU8("data"),
    borsh.u32("referenceCount"),
    borsh.u128("totalSpent"),
  ])

  constructor(fields: JobAccountDataFields) {
    this.name = fields.name
    this.metadata = fields.metadata
    this.authorWallet = fields.authorWallet
    this.expiration = fields.expiration
    this.hash = fields.hash
    this.data = fields.data
    this.referenceCount = fields.referenceCount
    this.totalSpent = fields.totalSpent
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<JobAccountData | null> {
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
  ): Promise<Array<JobAccountData | null>> {
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

  static decode(data: Buffer): JobAccountData {
    if (!data.slice(0, 8).equals(JobAccountData.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = JobAccountData.layout.decode(data.slice(8))

    return new JobAccountData({
      name: dec.name,
      metadata: dec.metadata,
      authorWallet: dec.authorWallet,
      expiration: dec.expiration,
      hash: dec.hash,
      data: Array.from(dec.data),
      referenceCount: dec.referenceCount,
      totalSpent: dec.totalSpent,
    })
  }

  toJSON(): JobAccountDataJSON {
    return {
      name: this.name,
      metadata: this.metadata,
      authorWallet: this.authorWallet.toString(),
      expiration: this.expiration.toString(),
      hash: this.hash,
      data: this.data,
      referenceCount: this.referenceCount,
      totalSpent: this.totalSpent.toString(),
    }
  }

  static fromJSON(obj: JobAccountDataJSON): JobAccountData {
    return new JobAccountData({
      name: obj.name,
      metadata: obj.metadata,
      authorWallet: new PublicKey(obj.authorWallet),
      expiration: new BN(obj.expiration),
      hash: obj.hash,
      data: obj.data,
      referenceCount: obj.referenceCount,
      totalSpent: new BN(obj.totalSpent),
    })
  }
}
