import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionInitParamsFields {
  name: Uint8Array;
  metadata: Uint8Array;
  container: Uint8Array;
  containerRegistry: Uint8Array;
  version: Uint8Array;
  schedule: Uint8Array;
  mrEnclave: Array<number>;
  recentSlot: BN;
  requestsDisabled: boolean;
  requestsRequireAuthorization: boolean;
  requestsFee: BN;
  creatorSeed: Array<number> | null;
}

export interface FunctionInitParamsJSON {
  name: Array<number>;
  metadata: Array<number>;
  container: Array<number>;
  containerRegistry: Array<number>;
  version: Array<number>;
  schedule: Array<number>;
  mrEnclave: Array<number>;
  recentSlot: string;
  requestsDisabled: boolean;
  requestsRequireAuthorization: boolean;
  requestsFee: string;
  creatorSeed: Array<number> | null;
}

export class FunctionInitParams {
  readonly name: Uint8Array;
  readonly metadata: Uint8Array;
  readonly container: Uint8Array;
  readonly containerRegistry: Uint8Array;
  readonly version: Uint8Array;
  readonly schedule: Uint8Array;
  readonly mrEnclave: Array<number>;
  readonly recentSlot: BN;
  readonly requestsDisabled: boolean;
  readonly requestsRequireAuthorization: boolean;
  readonly requestsFee: BN;
  readonly creatorSeed: Array<number> | null;

  constructor(fields: FunctionInitParamsFields) {
    this.name = fields.name;
    this.metadata = fields.metadata;
    this.container = fields.container;
    this.containerRegistry = fields.containerRegistry;
    this.version = fields.version;
    this.schedule = fields.schedule;
    this.mrEnclave = fields.mrEnclave;
    this.recentSlot = fields.recentSlot;
    this.requestsDisabled = fields.requestsDisabled;
    this.requestsRequireAuthorization = fields.requestsRequireAuthorization;
    this.requestsFee = fields.requestsFee;
    this.creatorSeed = fields.creatorSeed;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.vecU8("name"),
        borsh.vecU8("metadata"),
        borsh.vecU8("container"),
        borsh.vecU8("containerRegistry"),
        borsh.vecU8("version"),
        borsh.vecU8("schedule"),
        borsh.array(borsh.u8(), 32, "mrEnclave"),
        borsh.u64("recentSlot"),
        borsh.bool("requestsDisabled"),
        borsh.bool("requestsRequireAuthorization"),
        borsh.u64("requestsFee"),
        borsh.option(borsh.array(borsh.u8(), 32), "creatorSeed"),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionInitParams({
      name: new Uint8Array(
        obj.name.buffer,
        obj.name.byteOffset,
        obj.name.length
      ),
      metadata: new Uint8Array(
        obj.metadata.buffer,
        obj.metadata.byteOffset,
        obj.metadata.length
      ),
      container: new Uint8Array(
        obj.container.buffer,
        obj.container.byteOffset,
        obj.container.length
      ),
      containerRegistry: new Uint8Array(
        obj.containerRegistry.buffer,
        obj.containerRegistry.byteOffset,
        obj.containerRegistry.length
      ),
      version: new Uint8Array(
        obj.version.buffer,
        obj.version.byteOffset,
        obj.version.length
      ),
      schedule: new Uint8Array(
        obj.schedule.buffer,
        obj.schedule.byteOffset,
        obj.schedule.length
      ),
      mrEnclave: obj.mrEnclave,
      recentSlot: obj.recentSlot,
      requestsDisabled: obj.requestsDisabled,
      requestsRequireAuthorization: obj.requestsRequireAuthorization,
      requestsFee: obj.requestsFee,
      creatorSeed: obj.creatorSeed,
    });
  }

  static toEncodable(fields: FunctionInitParamsFields) {
    return {
      name: Buffer.from(
        fields.name.buffer,
        fields.name.byteOffset,
        fields.name.length
      ),
      metadata: Buffer.from(
        fields.metadata.buffer,
        fields.metadata.byteOffset,
        fields.metadata.length
      ),
      container: Buffer.from(
        fields.container.buffer,
        fields.container.byteOffset,
        fields.container.length
      ),
      containerRegistry: Buffer.from(
        fields.containerRegistry.buffer,
        fields.containerRegistry.byteOffset,
        fields.containerRegistry.length
      ),
      version: Buffer.from(
        fields.version.buffer,
        fields.version.byteOffset,
        fields.version.length
      ),
      schedule: Buffer.from(
        fields.schedule.buffer,
        fields.schedule.byteOffset,
        fields.schedule.length
      ),
      mrEnclave: fields.mrEnclave,
      recentSlot: fields.recentSlot,
      requestsDisabled: fields.requestsDisabled,
      requestsRequireAuthorization: fields.requestsRequireAuthorization,
      requestsFee: fields.requestsFee,
      creatorSeed: fields.creatorSeed,
    };
  }

  toJSON(): FunctionInitParamsJSON {
    return {
      name: Array.from(this.name.values()),
      metadata: Array.from(this.metadata.values()),
      container: Array.from(this.container.values()),
      containerRegistry: Array.from(this.containerRegistry.values()),
      version: Array.from(this.version.values()),
      schedule: Array.from(this.schedule.values()),
      mrEnclave: this.mrEnclave,
      recentSlot: this.recentSlot.toString(),
      requestsDisabled: this.requestsDisabled,
      requestsRequireAuthorization: this.requestsRequireAuthorization,
      requestsFee: this.requestsFee.toString(),
      creatorSeed: this.creatorSeed,
    };
  }

  static fromJSON(obj: FunctionInitParamsJSON): FunctionInitParams {
    return new FunctionInitParams({
      name: Uint8Array.from(obj.name),
      metadata: Uint8Array.from(obj.metadata),
      container: Uint8Array.from(obj.container),
      containerRegistry: Uint8Array.from(obj.containerRegistry),
      version: Uint8Array.from(obj.version),
      schedule: Uint8Array.from(obj.schedule),
      mrEnclave: obj.mrEnclave,
      recentSlot: new BN(obj.recentSlot),
      requestsDisabled: obj.requestsDisabled,
      requestsRequireAuthorization: obj.requestsRequireAuthorization,
      requestsFee: new BN(obj.requestsFee),
      creatorSeed: obj.creatorSeed,
    });
  }

  toEncodable() {
    return FunctionInitParams.toEncodable(this);
  }
}
