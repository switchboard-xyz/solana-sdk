import * as borsh from "@project-serum/borsh"

export interface RequestResultParamsFields {
  permissionBump: number
  switchboardStateBump: number
}

export interface RequestResultParamsJSON {
  permissionBump: number
  switchboardStateBump: number
}

export class RequestResultParams {
  readonly permissionBump: number
  readonly switchboardStateBump: number

  constructor(fields: RequestResultParamsFields) {
    this.permissionBump = fields.permissionBump
    this.switchboardStateBump = fields.switchboardStateBump
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.u8("permissionBump"), borsh.u8("switchboardStateBump")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new RequestResultParams({
      permissionBump: obj.permissionBump,
      switchboardStateBump: obj.switchboardStateBump,
    })
  }

  static toEncodable(fields: RequestResultParamsFields) {
    return {
      permissionBump: fields.permissionBump,
      switchboardStateBump: fields.switchboardStateBump,
    }
  }

  toJSON(): RequestResultParamsJSON {
    return {
      permissionBump: this.permissionBump,
      switchboardStateBump: this.switchboardStateBump,
    }
  }

  static fromJSON(obj: RequestResultParamsJSON): RequestResultParams {
    return new RequestResultParams({
      permissionBump: obj.permissionBump,
      switchboardStateBump: obj.switchboardStateBump,
    })
  }

  toEncodable() {
    return RequestResultParams.toEncodable(this)
  }
}
