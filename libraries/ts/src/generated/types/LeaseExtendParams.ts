import * as borsh from "@project-serum/borsh"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface LeaseExtendParamsFields {
  loadAmount: BN
  leaseBump: number
  stateBump: number
}

export interface LeaseExtendParamsJSON {
  loadAmount: string
  leaseBump: number
  stateBump: number
}

export class LeaseExtendParams {
  readonly loadAmount: BN
  readonly leaseBump: number
  readonly stateBump: number

  constructor(fields: LeaseExtendParamsFields) {
    this.loadAmount = fields.loadAmount
    this.leaseBump = fields.leaseBump
    this.stateBump = fields.stateBump
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.u64("loadAmount"), borsh.u8("leaseBump"), borsh.u8("stateBump")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new LeaseExtendParams({
      loadAmount: obj.loadAmount,
      leaseBump: obj.leaseBump,
      stateBump: obj.stateBump,
    })
  }

  static toEncodable(fields: LeaseExtendParamsFields) {
    return {
      loadAmount: fields.loadAmount,
      leaseBump: fields.leaseBump,
      stateBump: fields.stateBump,
    }
  }

  toJSON(): LeaseExtendParamsJSON {
    return {
      loadAmount: this.loadAmount.toString(),
      leaseBump: this.leaseBump,
      stateBump: this.stateBump,
    }
  }

  static fromJSON(obj: LeaseExtendParamsJSON): LeaseExtendParams {
    return new LeaseExtendParams({
      loadAmount: new BN(obj.loadAmount),
      leaseBump: obj.leaseBump,
      stateBump: obj.stateBump,
    })
  }

  toEncodable() {
    return LeaseExtendParams.toEncodable(this)
  }
}
