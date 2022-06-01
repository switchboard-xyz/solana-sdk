import * as borsh from "@project-serum/borsh"

export interface CrankPushParamsFields {
  stateBump: number
  permissionBump: number
}

export interface CrankPushParamsJSON {
  stateBump: number
  permissionBump: number
}

export class CrankPushParams {
  readonly stateBump: number
  readonly permissionBump: number

  constructor(fields: CrankPushParamsFields) {
    this.stateBump = fields.stateBump
    this.permissionBump = fields.permissionBump
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.u8("stateBump"), borsh.u8("permissionBump")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new CrankPushParams({
      stateBump: obj.stateBump,
      permissionBump: obj.permissionBump,
    })
  }

  static toEncodable(fields: CrankPushParamsFields) {
    return {
      stateBump: fields.stateBump,
      permissionBump: fields.permissionBump,
    }
  }

  toJSON(): CrankPushParamsJSON {
    return {
      stateBump: this.stateBump,
      permissionBump: this.permissionBump,
    }
  }

  static fromJSON(obj: CrankPushParamsJSON): CrankPushParams {
    return new CrankPushParams({
      stateBump: obj.stateBump,
      permissionBump: obj.permissionBump,
    })
  }

  toEncodable() {
    return CrankPushParams.toEncodable(this)
  }
}
