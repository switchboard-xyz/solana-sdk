import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionRoutineSetConfigParamsFields {
  name: Uint8Array | null;
  metadata: Uint8Array | null;
  bounty: BN | null;
  schedule: Uint8Array | null;
  containerParams: Uint8Array | null;
  appendContainerParams: boolean;
}

export interface FunctionRoutineSetConfigParamsJSON {
  name: Array<number> | null;
  metadata: Array<number> | null;
  bounty: string | null;
  schedule: Array<number> | null;
  containerParams: Array<number> | null;
  appendContainerParams: boolean;
}

export class FunctionRoutineSetConfigParams {
  readonly name: Uint8Array | null;
  readonly metadata: Uint8Array | null;
  readonly bounty: BN | null;
  readonly schedule: Uint8Array | null;
  readonly containerParams: Uint8Array | null;
  readonly appendContainerParams: boolean;

  constructor(fields: FunctionRoutineSetConfigParamsFields) {
    this.name = fields.name;
    this.metadata = fields.metadata;
    this.bounty = fields.bounty;
    this.schedule = fields.schedule;
    this.containerParams = fields.containerParams;
    this.appendContainerParams = fields.appendContainerParams;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.option(borsh.vecU8(), "name"),
        borsh.option(borsh.vecU8(), "metadata"),
        borsh.option(borsh.u64(), "bounty"),
        borsh.option(borsh.vecU8(), "schedule"),
        borsh.option(borsh.vecU8(), "containerParams"),
        borsh.bool("appendContainerParams"),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionRoutineSetConfigParams({
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
      schedule:
        (obj.schedule &&
          new Uint8Array(
            obj.schedule.buffer,
            obj.schedule.byteOffset,
            obj.schedule.length
          )) ||
        null,
      containerParams:
        (obj.containerParams &&
          new Uint8Array(
            obj.containerParams.buffer,
            obj.containerParams.byteOffset,
            obj.containerParams.length
          )) ||
        null,
      appendContainerParams: obj.appendContainerParams,
    });
  }

  static toEncodable(fields: FunctionRoutineSetConfigParamsFields) {
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
      schedule:
        (fields.schedule &&
          Buffer.from(
            fields.schedule.buffer,
            fields.schedule.byteOffset,
            fields.schedule.length
          )) ||
        null,
      containerParams:
        (fields.containerParams &&
          Buffer.from(
            fields.containerParams.buffer,
            fields.containerParams.byteOffset,
            fields.containerParams.length
          )) ||
        null,
      appendContainerParams: fields.appendContainerParams,
    };
  }

  toJSON(): FunctionRoutineSetConfigParamsJSON {
    return {
      name: (this.name && Array.from(this.name.values())) || null,
      metadata: (this.metadata && Array.from(this.metadata.values())) || null,
      bounty: (this.bounty && this.bounty.toString()) || null,
      schedule: (this.schedule && Array.from(this.schedule.values())) || null,
      containerParams:
        (this.containerParams && Array.from(this.containerParams.values())) ||
        null,
      appendContainerParams: this.appendContainerParams,
    };
  }

  static fromJSON(
    obj: FunctionRoutineSetConfigParamsJSON
  ): FunctionRoutineSetConfigParams {
    return new FunctionRoutineSetConfigParams({
      name: (obj.name && Uint8Array.from(obj.name)) || null,
      metadata: (obj.metadata && Uint8Array.from(obj.metadata)) || null,
      bounty: (obj.bounty && new BN(obj.bounty)) || null,
      schedule: (obj.schedule && Uint8Array.from(obj.schedule)) || null,
      containerParams:
        (obj.containerParams && Uint8Array.from(obj.containerParams)) || null,
      appendContainerParams: obj.appendContainerParams,
    });
  }

  toEncodable() {
    return FunctionRoutineSetConfigParams.toEncodable(this);
  }
}
