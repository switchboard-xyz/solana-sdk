import * as borsh from "@project-serum/borsh"

export interface VrfProveAndVerifyParamsFields {
  nonce: number | null
  stateBump: number
  idx: number
  proof: Array<number>
}

export interface VrfProveAndVerifyParamsJSON {
  nonce: number | null
  stateBump: number
  idx: number
  proof: Array<number>
}

export class VrfProveAndVerifyParams {
  readonly nonce: number | null
  readonly stateBump: number
  readonly idx: number
  readonly proof: Array<number>

  constructor(fields: VrfProveAndVerifyParamsFields) {
    this.nonce = fields.nonce
    this.stateBump = fields.stateBump
    this.idx = fields.idx
    this.proof = fields.proof
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.option(borsh.u32(), "nonce"),
        borsh.u8("stateBump"),
        borsh.u32("idx"),
        borsh.vecU8("proof"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new VrfProveAndVerifyParams({
      nonce: obj.nonce,
      stateBump: obj.stateBump,
      idx: obj.idx,
      proof: Array.from(obj.proof),
    })
  }

  static toEncodable(fields: VrfProveAndVerifyParamsFields) {
    return {
      nonce: fields.nonce,
      stateBump: fields.stateBump,
      idx: fields.idx,
      proof: Buffer.from(fields.proof),
    }
  }

  toJSON(): VrfProveAndVerifyParamsJSON {
    return {
      nonce: this.nonce,
      stateBump: this.stateBump,
      idx: this.idx,
      proof: this.proof,
    }
  }

  static fromJSON(obj: VrfProveAndVerifyParamsJSON): VrfProveAndVerifyParams {
    return new VrfProveAndVerifyParams({
      nonce: obj.nonce,
      stateBump: obj.stateBump,
      idx: obj.idx,
      proof: obj.proof,
    })
  }

  toEncodable() {
    return VrfProveAndVerifyParams.toEncodable(this)
  }
}
