import * as borsh from "@project-serum/borsh"

export interface OracleQueueVrfConfigParamsFields {
  unpermissionedVrfEnabled: boolean
}

export interface OracleQueueVrfConfigParamsJSON {
  unpermissionedVrfEnabled: boolean
}

export class OracleQueueVrfConfigParams {
  readonly unpermissionedVrfEnabled: boolean

  constructor(fields: OracleQueueVrfConfigParamsFields) {
    this.unpermissionedVrfEnabled = fields.unpermissionedVrfEnabled
  }

  static layout(property?: string) {
    return borsh.struct([borsh.bool("unpermissionedVrfEnabled")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new OracleQueueVrfConfigParams({
      unpermissionedVrfEnabled: obj.unpermissionedVrfEnabled,
    })
  }

  static toEncodable(fields: OracleQueueVrfConfigParamsFields) {
    return {
      unpermissionedVrfEnabled: fields.unpermissionedVrfEnabled,
    }
  }

  toJSON(): OracleQueueVrfConfigParamsJSON {
    return {
      unpermissionedVrfEnabled: this.unpermissionedVrfEnabled,
    }
  }

  static fromJSON(
    obj: OracleQueueVrfConfigParamsJSON
  ): OracleQueueVrfConfigParams {
    return new OracleQueueVrfConfigParams({
      unpermissionedVrfEnabled: obj.unpermissionedVrfEnabled,
    })
  }

  toEncodable() {
    return OracleQueueVrfConfigParams.toEncodable(this)
  }
}
