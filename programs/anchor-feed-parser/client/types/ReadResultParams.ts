import * as borsh from "@project-serum/borsh"

export interface ReadResultParamsFields {
  maxConfidenceInterval: number | null
}

export interface ReadResultParamsJSON {
  maxConfidenceInterval: number | null
}

export class ReadResultParams {
  readonly maxConfidenceInterval: number | null

  constructor(fields: ReadResultParamsFields) {
    this.maxConfidenceInterval = fields.maxConfidenceInterval
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.option(borsh.f64(), "maxConfidenceInterval")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new ReadResultParams({
      maxConfidenceInterval: obj.maxConfidenceInterval,
    })
  }

  static toEncodable(fields: ReadResultParamsFields) {
    return {
      maxConfidenceInterval: fields.maxConfidenceInterval,
    }
  }

  toJSON(): ReadResultParamsJSON {
    return {
      maxConfidenceInterval: this.maxConfidenceInterval,
    }
  }

  static fromJSON(obj: ReadResultParamsJSON): ReadResultParams {
    return new ReadResultParams({
      maxConfidenceInterval: obj.maxConfidenceInterval,
    })
  }

  toEncodable() {
    return ReadResultParams.toEncodable(this)
  }
}
