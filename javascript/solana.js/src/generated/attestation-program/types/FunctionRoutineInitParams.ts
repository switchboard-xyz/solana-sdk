import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionRoutineInitParamsFields {
  name: Uint8Array | null;
  metadata: Uint8Array | null;
  bounty: BN | null;
  schedule: Uint8Array;
  maxContainerParamsLen: number | null;
  containerParams: Uint8Array;
}

export interface FunctionRoutineInitParamsJSON {
  name: Array<number> | null;
  metadata: Array<number> | null;
  bounty: string | null;
  schedule: Array<number>;
  maxContainerParamsLen: number | null;
  containerParams: Array<number>;
}

export class FunctionRoutineInitParams {
  readonly name: Uint8Array | null;
  readonly metadata: Uint8Array | null;
  readonly bounty: BN | null;
  readonly schedule: Uint8Array;
  readonly maxContainerParamsLen: number | null;
  readonly containerParams: Uint8Array;

  constructor(fields: FunctionRoutineInitParamsFields) {
    this.name = fields.name;
    this.metadata = fields.metadata;
    this.bounty = fields.bounty;
    this.schedule = fields.schedule;
    this.maxContainerParamsLen = fields.maxContainerParamsLen;
    this.containerParams = fields.containerParams;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.option(borsh.vecU8(), "name"),
        borsh.option(borsh.vecU8(), "metadata"),
        borsh.option(borsh.u64(), "bounty"),
        borsh.vecU8("schedule"),
        borsh.option(borsh.u32(), "maxContainerParamsLen"),
        borsh.vecU8("containerParams"),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionRoutineInitParams({
      name:
        (obj.name &&
          new Uint8Array(
            obj.name.buffer,
            obj.name.byteOffset,
            obj.name.length
          )) ||
        null,
      metadata:
        (obj.metadata &&
          new Uint8Array(
            obj.metadata.buffer,
            obj.metadata.byteOffset,
            obj.metadata.length
          )) ||
        null,
      bounty: obj.bounty,
      schedule: new Uint8Array(
        obj.schedule.buffer,
        obj.schedule.byteOffset,
        obj.schedule.length
      ),
      maxContainerParamsLen: obj.maxContainerParamsLen,
      containerParams: new Uint8Array(
        obj.containerParams.buffer,
        obj.containerParams.byteOffset,
        obj.containerParams.length
      ),
    });
  }

  static toEncodable(fields: FunctionRoutineInitParamsFields) {
    return {
      name:
        (fields.name &&
          Buffer.from(
            fields.name.buffer,
            fields.name.byteOffset,
            fields.name.length
          )) ||
        null,
      metadata:
        (fields.metadata &&
          Buffer.from(
            fields.metadata.buffer,
            fields.metadata.byteOffset,
            fields.metadata.length
          )) ||
        null,
      bounty: fields.bounty,
      schedule: Buffer.from(
        fields.schedule.buffer,
        fields.schedule.byteOffset,
        fields.schedule.length
      ),
      maxContainerParamsLen: fields.maxContainerParamsLen,
      containerParams: Buffer.from(
        fields.containerParams.buffer,
        fields.containerParams.byteOffset,
        fields.containerParams.length
      ),
    };
  }

  toJSON(): FunctionRoutineInitParamsJSON {
    return {
      name: (this.name && Array.from(this.name.values())) || null,
      metadata: (this.metadata && Array.from(this.metadata.values())) || null,
      bounty: (this.bounty && this.bounty.toString()) || null,
      schedule: Array.from(this.schedule.values()),
      maxContainerParamsLen: this.maxContainerParamsLen,
      containerParams: Array.from(this.containerParams.values()),
    };
  }

  static fromJSON(
    obj: FunctionRoutineInitParamsJSON
  ): FunctionRoutineInitParams {
    return new FunctionRoutineInitParams({
      name: (obj.name && Uint8Array.from(obj.name)) || null,
      metadata: (obj.metadata && Uint8Array.from(obj.metadata)) || null,
      bounty: (obj.bounty && new BN(obj.bounty)) || null,
      schedule: Uint8Array.from(obj.schedule),
      maxContainerParamsLen: obj.maxContainerParamsLen,
      containerParams: Uint8Array.from(obj.containerParams),
    });
  }

  toEncodable() {
    return FunctionRoutineInitParams.toEncodable(this);
  }
}
