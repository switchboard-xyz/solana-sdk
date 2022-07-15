import * as borsh from "@project-serum/borsh"

export interface ReadResultParamsFields {
  expectedResult: Array<number> | null
}

export interface ReadResultParamsJSON {
  expectedResult: Array<number> | null
}

export class ReadResultParams {
  readonly expectedResult: Array<number> | null

  constructor(fields: ReadResultParamsFields) {
    this.expectedResult = fields.expectedResult
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.option(borsh.vecU8(), "expectedResult")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new ReadResultParams({
      expectedResult:
        (obj.expectedResult && Array.from(obj.expectedResult)) || null,
    })
  }

  static toEncodable(fields: ReadResultParamsFields) {
    return {
      expectedResult:
        (fields.expectedResult && Buffer.from(fields.expectedResult)) || null,
    }
  }

  toJSON(): ReadResultParamsJSON {
    return {
      expectedResult: this.expectedResult,
    }
  }

  static fromJSON(obj: ReadResultParamsJSON): ReadResultParams {
    return new ReadResultParams({
      expectedResult: obj.expectedResult,
    })
  }

  toEncodable() {
    return ReadResultParams.toEncodable(this)
  }
}
