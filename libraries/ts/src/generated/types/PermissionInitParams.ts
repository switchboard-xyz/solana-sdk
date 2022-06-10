import * as borsh from "@project-serum/borsh"

export interface PermissionInitParamsFields {
  permissionBump: number
}

export interface PermissionInitParamsJSON {
  permissionBump: number
}

export class PermissionInitParams {
  readonly permissionBump: number

  constructor(fields: PermissionInitParamsFields) {
    this.permissionBump = fields.permissionBump
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u8("permissionBump")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new PermissionInitParams({
      permissionBump: obj.permissionBump,
    })
  }

  static toEncodable(fields: PermissionInitParamsFields) {
    return {
      permissionBump: fields.permissionBump,
    }
  }

  toJSON(): PermissionInitParamsJSON {
    return {
      permissionBump: this.permissionBump,
    }
  }

  static fromJSON(obj: PermissionInitParamsJSON): PermissionInitParams {
    return new PermissionInitParams({
      permissionBump: obj.permissionBump,
    })
  }

  toEncodable() {
    return PermissionInitParams.toEncodable(this)
  }
}
