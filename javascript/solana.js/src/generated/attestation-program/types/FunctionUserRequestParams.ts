import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionUserRequestParamsFields {
  bounty: BN | null;
  slotsUntilExpiration: BN | null;
}

export interface FunctionUserRequestParamsJSON {
  bounty: string | null;
  slotsUntilExpiration: string | null;
}

export class FunctionUserRequestParams {
  readonly bounty: BN | null;
  readonly slotsUntilExpiration: BN | null;

  constructor(fields: FunctionUserRequestParamsFields) {
    this.bounty = fields.bounty;
    this.slotsUntilExpiration = fields.slotsUntilExpiration;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.option(borsh.u64(), "bounty"),
        borsh.option(borsh.u64(), "slotsUntilExpiration"),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionUserRequestParams({
      bounty: obj.bounty,
      slotsUntilExpiration: obj.slotsUntilExpiration,
    });
  }

  static toEncodable(fields: FunctionUserRequestParamsFields) {
    return {
      bounty: fields.bounty,
      slotsUntilExpiration: fields.slotsUntilExpiration,
    };
  }

  toJSON(): FunctionUserRequestParamsJSON {
    return {
      bounty: (this.bounty && this.bounty.toString()) || null,
      slotsUntilExpiration:
        (this.slotsUntilExpiration && this.slotsUntilExpiration.toString()) ||
        null,
    };
  }

  static fromJSON(
    obj: FunctionUserRequestParamsJSON
  ): FunctionUserRequestParams {
    return new FunctionUserRequestParams({
      bounty: (obj.bounty && new BN(obj.bounty)) || null,
      slotsUntilExpiration:
        (obj.slotsUntilExpiration && new BN(obj.slotsUntilExpiration)) || null,
    });
  }

  toEncodable() {
    return FunctionUserRequestParams.toEncodable(this);
  }
}
