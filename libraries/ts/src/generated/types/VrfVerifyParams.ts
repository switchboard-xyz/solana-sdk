import * as borsh from "@project-serum/borsh"

export interface VrfVerifyParamsFields {
  nonce: number | null
  stateBump: number
  idx: number
}

export interface VrfVerifyParamsJSON {
  nonce: number | null
  stateBump: number
  idx: number
}

export class VrfVerifyParams {
  readonly nonce: number | null
  readonly stateBump: number
  readonly idx: number

  constructor(fields: VrfVerifyParamsFields) {
    this.nonce = fields.nonce
    this.stateBump = fields.stateBump
    this.idx = fields.idx
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.option(borsh.u32(), "nonce"),
        borsh.u8("stateBump"),
        borsh.u32("idx"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new VrfVerifyParams({
      nonce: obj.nonce,
      stateBump: obj.stateBump,
      idx: obj.idx,
    })
  }

  static toEncodable(fields: VrfVerifyParamsFields) {
    return {
      nonce: fields.nonce,
      stateBump: fields.stateBump,
      idx: fields.idx,
    }
  }

  toJSON(): VrfVerifyParamsJSON {
    return {
      nonce: this.nonce,
      stateBump: this.stateBump,
      idx: this.idx,
    }
  }

  static fromJSON(obj: VrfVerifyParamsJSON): VrfVerifyParams {
    return new VrfVerifyParams({
      nonce: obj.nonce,
      stateBump: obj.stateBump,
      idx: obj.idx,
    })
  }

  toEncodable() {
    return VrfVerifyParams.toEncodable(this)
  }
}
