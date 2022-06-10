import * as borsh from "@project-serum/borsh"
import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface LeaseInitParamsFields {
  loadAmount: BN
  withdrawAuthority: PublicKey
  leaseBump: number
  stateBump: number
}

export interface LeaseInitParamsJSON {
  loadAmount: string
  withdrawAuthority: string
  leaseBump: number
  stateBump: number
}

export class LeaseInitParams {
  readonly loadAmount: BN
  readonly withdrawAuthority: PublicKey
  readonly leaseBump: number
  readonly stateBump: number

  constructor(fields: LeaseInitParamsFields) {
    this.loadAmount = fields.loadAmount
    this.withdrawAuthority = fields.withdrawAuthority
    this.leaseBump = fields.leaseBump
    this.stateBump = fields.stateBump
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u64("loadAmount"),
        borsh.publicKey("withdrawAuthority"),
        borsh.u8("leaseBump"),
        borsh.u8("stateBump"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new LeaseInitParams({
      loadAmount: obj.loadAmount,
      withdrawAuthority: obj.withdrawAuthority,
      leaseBump: obj.leaseBump,
      stateBump: obj.stateBump,
    })
  }

  static toEncodable(fields: LeaseInitParamsFields) {
    return {
      loadAmount: fields.loadAmount,
      withdrawAuthority: fields.withdrawAuthority,
      leaseBump: fields.leaseBump,
      stateBump: fields.stateBump,
    }
  }

  toJSON(): LeaseInitParamsJSON {
    return {
      loadAmount: this.loadAmount.toString(),
      withdrawAuthority: this.withdrawAuthority.toString(),
      leaseBump: this.leaseBump,
      stateBump: this.stateBump,
    }
  }

  static fromJSON(obj: LeaseInitParamsJSON): LeaseInitParams {
    return new LeaseInitParams({
      loadAmount: new BN(obj.loadAmount),
      withdrawAuthority: new PublicKey(obj.withdrawAuthority),
      leaseBump: obj.leaseBump,
      stateBump: obj.stateBump,
    })
  }

  toEncodable() {
    return LeaseInitParams.toEncodable(this)
  }
}
