import * as borsh from "@project-serum/borsh"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface InitStateParamsFields {
  maxResult: BN
}

export interface InitStateParamsJSON {
  maxResult: string
}

export class InitStateParams {
  readonly maxResult: BN

  constructor(fields: InitStateParamsFields) {
    this.maxResult = fields.maxResult
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u64("maxResult")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new InitStateParams({
      maxResult: obj.maxResult,
    })
  }

  static toEncodable(fields: InitStateParamsFields) {
    return {
      maxResult: fields.maxResult,
    }
  }

  toJSON(): InitStateParamsJSON {
    return {
      maxResult: this.maxResult.toString(),
    }
  }

  static fromJSON(obj: InitStateParamsJSON): InitStateParams {
    return new InitStateParams({
      maxResult: new BN(obj.maxResult),
    })
  }

  toEncodable() {
    return InitStateParams.toEncodable(this)
  }
}
