import * as borsh from "@project-serum/borsh"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VrfRoundFields {
  alpha: Array<number>
  alphaLen: number
  requestSlot: BN
  requestTimestamp: BN
  result: Array<number>
  numVerified: number
  ebuf: Array<number>
}

export interface VrfRoundJSON {
  alpha: Array<number>
  alphaLen: number
  requestSlot: string
  requestTimestamp: string
  result: Array<number>
  numVerified: number
  ebuf: Array<number>
}

export class VrfRound {
  readonly alpha: Array<number>
  readonly alphaLen: number
  readonly requestSlot: BN
  readonly requestTimestamp: BN
  readonly result: Array<number>
  readonly numVerified: number
  readonly ebuf: Array<number>

  constructor(fields: VrfRoundFields) {
    this.alpha = fields.alpha
    this.alphaLen = fields.alphaLen
    this.requestSlot = fields.requestSlot
    this.requestTimestamp = fields.requestTimestamp
    this.result = fields.result
    this.numVerified = fields.numVerified
    this.ebuf = fields.ebuf
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.array(borsh.u8(), 256, "alpha"),
        borsh.u32("alphaLen"),
        borsh.u64("requestSlot"),
        borsh.i64("requestTimestamp"),
        borsh.array(borsh.u8(), 32, "result"),
        borsh.u32("numVerified"),
        borsh.array(borsh.u8(), 256, "ebuf"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new VrfRound({
      alpha: obj.alpha,
      alphaLen: obj.alphaLen,
      requestSlot: obj.requestSlot,
      requestTimestamp: obj.requestTimestamp,
      result: obj.result,
      numVerified: obj.numVerified,
      ebuf: obj.ebuf,
    })
  }

  static toEncodable(fields: VrfRoundFields) {
    return {
      alpha: fields.alpha,
      alphaLen: fields.alphaLen,
      requestSlot: fields.requestSlot,
      requestTimestamp: fields.requestTimestamp,
      result: fields.result,
      numVerified: fields.numVerified,
      ebuf: fields.ebuf,
    }
  }

  toJSON(): VrfRoundJSON {
    return {
      alpha: this.alpha,
      alphaLen: this.alphaLen,
      requestSlot: this.requestSlot.toString(),
      requestTimestamp: this.requestTimestamp.toString(),
      result: this.result,
      numVerified: this.numVerified,
      ebuf: this.ebuf,
    }
  }

  static fromJSON(obj: VrfRoundJSON): VrfRound {
    return new VrfRound({
      alpha: obj.alpha,
      alphaLen: obj.alphaLen,
      requestSlot: new BN(obj.requestSlot),
      requestTimestamp: new BN(obj.requestTimestamp),
      result: obj.result,
      numVerified: obj.numVerified,
      ebuf: obj.ebuf,
    })
  }

  toEncodable() {
    return VrfRound.toEncodable(this)
  }
}
