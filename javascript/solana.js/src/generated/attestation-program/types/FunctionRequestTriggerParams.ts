import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionRequestTriggerParamsFields {
  bounty: BN | null;
  slotsUntilExpiration: BN | null;
  validAfterSlot: BN | null;
}

export interface FunctionRequestTriggerParamsJSON {
  bounty: string | null;
  slotsUntilExpiration: string | null;
  validAfterSlot: string | null;
}

export class FunctionRequestTriggerParams {
  readonly bounty: BN | null;
  readonly slotsUntilExpiration: BN | null;
  readonly validAfterSlot: BN | null;

  constructor(fields: FunctionRequestTriggerParamsFields) {
    this.bounty = fields.bounty;
    this.slotsUntilExpiration = fields.slotsUntilExpiration;
    this.validAfterSlot = fields.validAfterSlot;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.option(borsh.u64(), "bounty"),
        borsh.option(borsh.u64(), "slotsUntilExpiration"),
        borsh.option(borsh.u64(), "validAfterSlot"),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionRequestTriggerParams({
      bounty: obj.bounty,
      slotsUntilExpiration: obj.slotsUntilExpiration,
      validAfterSlot: obj.validAfterSlot,
    });
  }

  static toEncodable(fields: FunctionRequestTriggerParamsFields) {
    return {
      bounty: fields.bounty,
      slotsUntilExpiration: fields.slotsUntilExpiration,
      validAfterSlot: fields.validAfterSlot,
    };
  }

  toJSON(): FunctionRequestTriggerParamsJSON {
    return {
      bounty: (this.bounty && this.bounty.toString()) || null,
      slotsUntilExpiration:
        (this.slotsUntilExpiration && this.slotsUntilExpiration.toString()) ||
        null,
      validAfterSlot:
        (this.validAfterSlot && this.validAfterSlot.toString()) || null,
    };
  }

  static fromJSON(
    obj: FunctionRequestTriggerParamsJSON
  ): FunctionRequestTriggerParams {
    return new FunctionRequestTriggerParams({
      bounty: (obj.bounty && new BN(obj.bounty)) || null,
      slotsUntilExpiration:
        (obj.slotsUntilExpiration && new BN(obj.slotsUntilExpiration)) || null,
      validAfterSlot:
        (obj.validAfterSlot && new BN(obj.validAfterSlot)) || null,
    });
  }

  toEncodable() {
    return FunctionRequestTriggerParams.toEncodable(this);
  }
}
