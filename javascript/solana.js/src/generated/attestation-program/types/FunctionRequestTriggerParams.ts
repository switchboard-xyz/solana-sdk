import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionRequestTriggerParamsFields {
  bounty: BN | null;
  slotsUntilExpiration: BN | null;
}

export interface FunctionRequestTriggerParamsJSON {
  bounty: string | null;
  slotsUntilExpiration: string | null;
}

export class FunctionRequestTriggerParams {
  readonly bounty: BN | null;
  readonly slotsUntilExpiration: BN | null;

  constructor(fields: FunctionRequestTriggerParamsFields) {
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
    return new FunctionRequestTriggerParams({
      bounty: obj.bounty,
      slotsUntilExpiration: obj.slotsUntilExpiration,
    });
  }

  static toEncodable(fields: FunctionRequestTriggerParamsFields) {
    return {
      bounty: fields.bounty,
      slotsUntilExpiration: fields.slotsUntilExpiration,
    };
  }

  toJSON(): FunctionRequestTriggerParamsJSON {
    return {
      bounty: (this.bounty && this.bounty.toString()) || null,
      slotsUntilExpiration:
        (this.slotsUntilExpiration && this.slotsUntilExpiration.toString()) ||
        null,
    };
  }

  static fromJSON(
    obj: FunctionRequestTriggerParamsJSON
  ): FunctionRequestTriggerParams {
    return new FunctionRequestTriggerParams({
      bounty: (obj.bounty && new BN(obj.bounty)) || null,
      slotsUntilExpiration:
        (obj.slotsUntilExpiration && new BN(obj.slotsUntilExpiration)) || null,
    });
  }

  toEncodable() {
    return FunctionRequestTriggerParams.toEncodable(this);
  }
}
