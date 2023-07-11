import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh";

export interface AttestationQueueRemoveMrEnclaveParamsFields {
  mrEnclave: Array<number>;
}

export interface AttestationQueueRemoveMrEnclaveParamsJSON {
  mrEnclave: Array<number>;
}

export class AttestationQueueRemoveMrEnclaveParams {
  readonly mrEnclave: Array<number>;

  constructor(fields: AttestationQueueRemoveMrEnclaveParamsFields) {
    this.mrEnclave = fields.mrEnclave;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.array(borsh.u8(), 32, "mrEnclave")], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new AttestationQueueRemoveMrEnclaveParams({
      mrEnclave: obj.mrEnclave,
    });
  }

  static toEncodable(fields: AttestationQueueRemoveMrEnclaveParamsFields) {
    return {
      mrEnclave: fields.mrEnclave,
    };
  }

  toJSON(): AttestationQueueRemoveMrEnclaveParamsJSON {
    return {
      mrEnclave: this.mrEnclave,
    };
  }

  static fromJSON(
    obj: AttestationQueueRemoveMrEnclaveParamsJSON
  ): AttestationQueueRemoveMrEnclaveParams {
    return new AttestationQueueRemoveMrEnclaveParams({
      mrEnclave: obj.mrEnclave,
    });
  }

  toEncodable() {
    return AttestationQueueRemoveMrEnclaveParams.toEncodable(this);
  }
}
