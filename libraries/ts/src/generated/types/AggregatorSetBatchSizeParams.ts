import * as borsh from "@project-serum/borsh"

export interface AggregatorSetBatchSizeParamsFields {
  batchSize: number
}

export interface AggregatorSetBatchSizeParamsJSON {
  batchSize: number
}

export class AggregatorSetBatchSizeParams {
  readonly batchSize: number

  constructor(fields: AggregatorSetBatchSizeParamsFields) {
    this.batchSize = fields.batchSize
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u32("batchSize")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new AggregatorSetBatchSizeParams({
      batchSize: obj.batchSize,
    })
  }

  static toEncodable(fields: AggregatorSetBatchSizeParamsFields) {
    return {
      batchSize: fields.batchSize,
    }
  }

  toJSON(): AggregatorSetBatchSizeParamsJSON {
    return {
      batchSize: this.batchSize,
    }
  }

  static fromJSON(
    obj: AggregatorSetBatchSizeParamsJSON
  ): AggregatorSetBatchSizeParams {
    return new AggregatorSetBatchSizeParams({
      batchSize: obj.batchSize,
    })
  }

  toEncodable() {
    return AggregatorSetBatchSizeParams.toEncodable(this)
  }
}
