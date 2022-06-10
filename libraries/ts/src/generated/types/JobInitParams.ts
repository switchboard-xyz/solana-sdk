import * as borsh from "@project-serum/borsh"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface JobInitParamsFields {
  name: Array<number>
  expiration: BN
  stateBump: number
  data: Array<number>
}

export interface JobInitParamsJSON {
  name: Array<number>
  expiration: string
  stateBump: number
  data: Array<number>
}

export class JobInitParams {
  readonly name: Array<number>
  readonly expiration: BN
  readonly stateBump: number
  readonly data: Array<number>

  constructor(fields: JobInitParamsFields) {
    this.name = fields.name
    this.expiration = fields.expiration
    this.stateBump = fields.stateBump
    this.data = fields.data
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.array(borsh.u8(), 32, "name"),
        borsh.i64("expiration"),
        borsh.u8("stateBump"),
        borsh.vecU8("data"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new JobInitParams({
      name: obj.name,
      expiration: obj.expiration,
      stateBump: obj.stateBump,
      data: Array.from(obj.data),
    })
  }

  static toEncodable(fields: JobInitParamsFields) {
    return {
      name: fields.name,
      expiration: fields.expiration,
      stateBump: fields.stateBump,
      data: Buffer.from(fields.data),
    }
  }

  toJSON(): JobInitParamsJSON {
    return {
      name: this.name,
      expiration: this.expiration.toString(),
      stateBump: this.stateBump,
      data: this.data,
    }
  }

  static fromJSON(obj: JobInitParamsJSON): JobInitParams {
    return new JobInitParams({
      name: obj.name,
      expiration: new BN(obj.expiration),
      stateBump: obj.stateBump,
      data: obj.data,
    })
  }

  toEncodable() {
    return JobInitParams.toEncodable(this)
  }
}
