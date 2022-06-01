import * as borsh from "@project-serum/borsh"

export interface CrankInitParamsFields {
  name: Array<number>
  metadata: Array<number>
  crankSize: number
}

export interface CrankInitParamsJSON {
  name: Array<number>
  metadata: Array<number>
  crankSize: number
}

export class CrankInitParams {
  readonly name: Array<number>
  readonly metadata: Array<number>
  readonly crankSize: number

  constructor(fields: CrankInitParamsFields) {
    this.name = fields.name
    this.metadata = fields.metadata
    this.crankSize = fields.crankSize
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.vecU8("name"), borsh.vecU8("metadata"), borsh.u32("crankSize")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new CrankInitParams({
      name: Array.from(obj.name),
      metadata: Array.from(obj.metadata),
      crankSize: obj.crankSize,
    })
  }

  static toEncodable(fields: CrankInitParamsFields) {
    return {
      name: Buffer.from(fields.name),
      metadata: Buffer.from(fields.metadata),
      crankSize: fields.crankSize,
    }
  }

  toJSON(): CrankInitParamsJSON {
    return {
      name: this.name,
      metadata: this.metadata,
      crankSize: this.crankSize,
    }
  }

  static fromJSON(obj: CrankInitParamsJSON): CrankInitParams {
    return new CrankInitParams({
      name: obj.name,
      metadata: obj.metadata,
      crankSize: obj.crankSize,
    })
  }

  toEncodable() {
    return CrankInitParams.toEncodable(this)
  }
}
