import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionExtendLookupParamsFields {
  newAddresses: Array<PublicKey>;
}

export interface FunctionExtendLookupParamsJSON {
  newAddresses: Array<string>;
}

export class FunctionExtendLookupParams {
  readonly newAddresses: Array<PublicKey>;

  constructor(fields: FunctionExtendLookupParamsFields) {
    this.newAddresses = fields.newAddresses;
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.vec(borsh.publicKey(), "newAddresses")],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionExtendLookupParams({
      newAddresses: obj.newAddresses,
    });
  }

  static toEncodable(fields: FunctionExtendLookupParamsFields) {
    return {
      newAddresses: fields.newAddresses,
    };
  }

  toJSON(): FunctionExtendLookupParamsJSON {
    return {
      newAddresses: this.newAddresses.map((item) => item.toString()),
    };
  }

  static fromJSON(
    obj: FunctionExtendLookupParamsJSON
  ): FunctionExtendLookupParams {
    return new FunctionExtendLookupParams({
      newAddresses: obj.newAddresses.map((item) => new PublicKey(item)),
    });
  }

  toEncodable() {
    return FunctionExtendLookupParams.toEncodable(this);
  }
}
