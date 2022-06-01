import * as borsh from "@project-serum/borsh"

export interface OracleInitParamsFields {
  name: Array<number>
  metadata: Array<number>
  stateBump: number
  oracleBump: number
}

export interface OracleInitParamsJSON {
  name: Array<number>
  metadata: Array<number>
  stateBump: number
  oracleBump: number
}

export class OracleInitParams {
  readonly name: Array<number>
  readonly metadata: Array<number>
  readonly stateBump: number
  readonly oracleBump: number

  constructor(fields: OracleInitParamsFields) {
    this.name = fields.name
    this.metadata = fields.metadata
    this.stateBump = fields.stateBump
    this.oracleBump = fields.oracleBump
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.vecU8("name"),
        borsh.vecU8("metadata"),
        borsh.u8("stateBump"),
        borsh.u8("oracleBump"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new OracleInitParams({
      name: Array.from(obj.name),
      metadata: Array.from(obj.metadata),
      stateBump: obj.stateBump,
      oracleBump: obj.oracleBump,
    })
  }

  static toEncodable(fields: OracleInitParamsFields) {
    return {
      name: Buffer.from(fields.name),
      metadata: Buffer.from(fields.metadata),
      stateBump: fields.stateBump,
      oracleBump: fields.oracleBump,
    }
  }

  toJSON(): OracleInitParamsJSON {
    return {
      name: this.name,
      metadata: this.metadata,
      stateBump: this.stateBump,
      oracleBump: this.oracleBump,
    }
  }

  static fromJSON(obj: OracleInitParamsJSON): OracleInitParams {
    return new OracleInitParams({
      name: obj.name,
      metadata: obj.metadata,
      stateBump: obj.stateBump,
      oracleBump: obj.oracleBump,
    })
  }

  toEncodable() {
    return OracleInitParams.toEncodable(this)
  }
}
