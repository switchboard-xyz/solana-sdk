import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh";

export interface FunctionRequestInitAndTriggerParamsFields {
  bounty: BN | null;
  slotsUntilExpiration: BN | null;
  maxContainerParamsLen: number | null;
  containerParams: Uint8Array | null;
  garbageCollectionSlot: BN | null;
}

export interface FunctionRequestInitAndTriggerParamsJSON {
  bounty: string | null;
  slotsUntilExpiration: string | null;
  maxContainerParamsLen: number | null;
  containerParams: Array<number> | null;
  garbageCollectionSlot: string | null;
}

export class FunctionRequestInitAndTriggerParams {
  readonly bounty: BN | null;
  readonly slotsUntilExpiration: BN | null;
  readonly maxContainerParamsLen: number | null;
  readonly containerParams: Uint8Array | null;
  readonly garbageCollectionSlot: BN | null;

  constructor(fields: FunctionRequestInitAndTriggerParamsFields) {
    this.bounty = fields.bounty;
    this.slotsUntilExpiration = fields.slotsUntilExpiration;
    this.maxContainerParamsLen = fields.maxContainerParamsLen;
    this.containerParams = fields.containerParams;
    this.garbageCollectionSlot = fields.garbageCollectionSlot;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.option(borsh.u64(), "bounty"),
        borsh.option(borsh.u64(), "slotsUntilExpiration"),
        borsh.option(borsh.u32(), "maxContainerParamsLen"),
        borsh.option(borsh.vecU8(), "containerParams"),
        borsh.option(borsh.u64(), "garbageCollectionSlot"),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionRequestInitAndTriggerParams({
      bounty: obj.bounty,
      slotsUntilExpiration: obj.slotsUntilExpiration,
      maxContainerParamsLen: obj.maxContainerParamsLen,
      containerParams:
        (obj.containerParams &&
          new Uint8Array(
            obj.containerParams.buffer,
            obj.containerParams.byteOffset,
            obj.containerParams.length
          )) ||
        null,
      garbageCollectionSlot: obj.garbageCollectionSlot,
    });
  }

  static toEncodable(fields: FunctionRequestInitAndTriggerParamsFields) {
    return {
      bounty: fields.bounty,
      slotsUntilExpiration: fields.slotsUntilExpiration,
      maxContainerParamsLen: fields.maxContainerParamsLen,
      containerParams:
        (fields.containerParams &&
          Buffer.from(
            fields.containerParams.buffer,
            fields.containerParams.byteOffset,
            fields.containerParams.length
          )) ||
        null,
      garbageCollectionSlot: fields.garbageCollectionSlot,
    };
  }

  toJSON(): FunctionRequestInitAndTriggerParamsJSON {
    return {
      bounty: (this.bounty && this.bounty.toString()) || null,
      slotsUntilExpiration:
        (this.slotsUntilExpiration && this.slotsUntilExpiration.toString()) ||
        null,
      maxContainerParamsLen: this.maxContainerParamsLen,
      containerParams:
        (this.containerParams && Array.from(this.containerParams.values())) ||
        null,
      garbageCollectionSlot:
        (this.garbageCollectionSlot && this.garbageCollectionSlot.toString()) ||
        null,
    };
  }

  static fromJSON(
    obj: FunctionRequestInitAndTriggerParamsJSON
  ): FunctionRequestInitAndTriggerParams {
    return new FunctionRequestInitAndTriggerParams({
      bounty: (obj.bounty && new BN(obj.bounty)) || null,
      slotsUntilExpiration:
        (obj.slotsUntilExpiration && new BN(obj.slotsUntilExpiration)) || null,
      maxContainerParamsLen: obj.maxContainerParamsLen,
      containerParams:
        (obj.containerParams && Uint8Array.from(obj.containerParams)) || null,
      garbageCollectionSlot:
        (obj.garbageCollectionSlot && new BN(obj.garbageCollectionSlot)) ||
        null,
    });
  }

  toEncodable() {
    return FunctionRequestInitAndTriggerParams.toEncodable(this);
  }
}
