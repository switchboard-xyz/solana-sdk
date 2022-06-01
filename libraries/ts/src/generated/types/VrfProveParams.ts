import * as borsh from "@project-serum/borsh"

export interface VrfProveParamsFields {
  proof: Array<number>
  idx: number
}

export interface VrfProveParamsJSON {
  proof: Array<number>
  idx: number
}

export class VrfProveParams {
  readonly proof: Array<number>
  readonly idx: number

  constructor(fields: VrfProveParamsFields) {
    this.proof = fields.proof
    this.idx = fields.idx
  }

  static layout(property?: string) {
    return borsh.struct([borsh.vecU8("proof"), borsh.u32("idx")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new VrfProveParams({
      proof: Array.from(obj.proof),
      idx: obj.idx,
    })
  }

  static toEncodable(fields: VrfProveParamsFields) {
    return {
      proof: Buffer.from(fields.proof),
      idx: fields.idx,
    }
  }

  toJSON(): VrfProveParamsJSON {
    return {
      proof: this.proof,
      idx: this.idx,
    }
  }

  static fromJSON(obj: VrfProveParamsJSON): VrfProveParams {
    return new VrfProveParams({
      proof: obj.proof,
      idx: obj.idx,
    })
  }

  toEncodable() {
    return VrfProveParams.toEncodable(this)
  }
}
