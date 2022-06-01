import * as borsh from "@project-serum/borsh"

export interface CrankPopParamsFields {
  stateBump: number
  leaseBumps: Array<number>
  permissionBumps: Array<number>
  nonce: number | null
  failOpenOnAccountMismatch: boolean | null
}

export interface CrankPopParamsJSON {
  stateBump: number
  leaseBumps: Array<number>
  permissionBumps: Array<number>
  nonce: number | null
  failOpenOnAccountMismatch: boolean | null
}

export class CrankPopParams {
  readonly stateBump: number
  readonly leaseBumps: Array<number>
  readonly permissionBumps: Array<number>
  readonly nonce: number | null
  readonly failOpenOnAccountMismatch: boolean | null

  constructor(fields: CrankPopParamsFields) {
    this.stateBump = fields.stateBump
    this.leaseBumps = fields.leaseBumps
    this.permissionBumps = fields.permissionBumps
    this.nonce = fields.nonce
    this.failOpenOnAccountMismatch = fields.failOpenOnAccountMismatch
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u8("stateBump"),
        borsh.vecU8("leaseBumps"),
        borsh.vecU8("permissionBumps"),
        borsh.option(borsh.u32(), "nonce"),
        borsh.option(borsh.bool(), "failOpenOnAccountMismatch"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new CrankPopParams({
      stateBump: obj.stateBump,
      leaseBumps: Array.from(obj.leaseBumps),
      permissionBumps: Array.from(obj.permissionBumps),
      nonce: obj.nonce,
      failOpenOnAccountMismatch: obj.failOpenOnAccountMismatch,
    })
  }

  static toEncodable(fields: CrankPopParamsFields) {
    return {
      stateBump: fields.stateBump,
      leaseBumps: Buffer.from(fields.leaseBumps),
      permissionBumps: Buffer.from(fields.permissionBumps),
      nonce: fields.nonce,
      failOpenOnAccountMismatch: fields.failOpenOnAccountMismatch,
    }
  }

  toJSON(): CrankPopParamsJSON {
    return {
      stateBump: this.stateBump,
      leaseBumps: this.leaseBumps,
      permissionBumps: this.permissionBumps,
      nonce: this.nonce,
      failOpenOnAccountMismatch: this.failOpenOnAccountMismatch,
    }
  }

  static fromJSON(obj: CrankPopParamsJSON): CrankPopParams {
    return new CrankPopParams({
      stateBump: obj.stateBump,
      leaseBumps: obj.leaseBumps,
      permissionBumps: obj.permissionBumps,
      nonce: obj.nonce,
      failOpenOnAccountMismatch: obj.failOpenOnAccountMismatch,
    })
  }

  toEncodable() {
    return CrankPopParams.toEncodable(this)
  }
}
