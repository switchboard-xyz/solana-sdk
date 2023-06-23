import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionSetConfigParamsFields {
  name: Uint8Array | null;
  metadata: Uint8Array | null;
  container: Uint8Array | null;
  containerRegistry: Uint8Array | null;
  version: Uint8Array | null;
  schedule: Uint8Array | null;
  mrEnclaves: Array<Array<number>> | null;
  usersDisabled: boolean | null;
  usersRequireAuthorization: boolean | null;
  usersDefaultSlotsUntilExpiration: BN | null;
  usersRequestFee: BN | null;
}

export interface FunctionSetConfigParamsJSON {
  name: Array<number> | null;
  metadata: Array<number> | null;
  container: Array<number> | null;
  containerRegistry: Array<number> | null;
  version: Array<number> | null;
  schedule: Array<number> | null;
  mrEnclaves: Array<Array<number>> | null;
  usersDisabled: boolean | null;
  usersRequireAuthorization: boolean | null;
  usersDefaultSlotsUntilExpiration: string | null;
  usersRequestFee: string | null;
}

export class FunctionSetConfigParams {
  readonly name: Uint8Array | null;
  readonly metadata: Uint8Array | null;
  readonly container: Uint8Array | null;
  readonly containerRegistry: Uint8Array | null;
  readonly version: Uint8Array | null;
  readonly schedule: Uint8Array | null;
  readonly mrEnclaves: Array<Array<number>> | null;
  readonly usersDisabled: boolean | null;
  readonly usersRequireAuthorization: boolean | null;
  readonly usersDefaultSlotsUntilExpiration: BN | null;
  readonly usersRequestFee: BN | null;

  constructor(fields: FunctionSetConfigParamsFields) {
    this.name = fields.name;
    this.metadata = fields.metadata;
    this.container = fields.container;
    this.containerRegistry = fields.containerRegistry;
    this.version = fields.version;
    this.schedule = fields.schedule;
    this.mrEnclaves = fields.mrEnclaves;
    this.usersDisabled = fields.usersDisabled;
    this.usersRequireAuthorization = fields.usersRequireAuthorization;
    this.usersDefaultSlotsUntilExpiration =
      fields.usersDefaultSlotsUntilExpiration;
    this.usersRequestFee = fields.usersRequestFee;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.option(borsh.vecU8(), "name"),
        borsh.option(borsh.vecU8(), "metadata"),
        borsh.option(borsh.vecU8(), "container"),
        borsh.option(borsh.vecU8(), "containerRegistry"),
        borsh.option(borsh.vecU8(), "version"),
        borsh.option(borsh.vecU8(), "schedule"),
        borsh.option(borsh.vec(borsh.array(borsh.u8(), 32)), "mrEnclaves"),
        borsh.option(borsh.bool(), "usersDisabled"),
        borsh.option(borsh.bool(), "usersRequireAuthorization"),
        borsh.option(borsh.u64(), "usersDefaultSlotsUntilExpiration"),
        borsh.option(borsh.u64(), "usersRequestFee"),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionSetConfigParams({
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
      container:
        (obj.container &&
          new Uint8Array(
            obj.container.buffer,
            obj.container.byteOffset,
            obj.container.length
          )) ||
        null,
      containerRegistry:
        (obj.containerRegistry &&
          new Uint8Array(
            obj.containerRegistry.buffer,
            obj.containerRegistry.byteOffset,
            obj.containerRegistry.length
          )) ||
        null,
      version:
        (obj.version &&
          new Uint8Array(
            obj.version.buffer,
            obj.version.byteOffset,
            obj.version.length
          )) ||
        null,
      schedule:
        (obj.schedule &&
          new Uint8Array(
            obj.schedule.buffer,
            obj.schedule.byteOffset,
            obj.schedule.length
          )) ||
        null,
      mrEnclaves: obj.mrEnclaves,
      usersDisabled: obj.usersDisabled,
      usersRequireAuthorization: obj.usersRequireAuthorization,
      usersDefaultSlotsUntilExpiration: obj.usersDefaultSlotsUntilExpiration,
      usersRequestFee: obj.usersRequestFee,
    });
  }

  static toEncodable(fields: FunctionSetConfigParamsFields) {
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
      container:
        (fields.container &&
          Buffer.from(
            fields.container.buffer,
            fields.container.byteOffset,
            fields.container.length
          )) ||
        null,
      containerRegistry:
        (fields.containerRegistry &&
          Buffer.from(
            fields.containerRegistry.buffer,
            fields.containerRegistry.byteOffset,
            fields.containerRegistry.length
          )) ||
        null,
      version:
        (fields.version &&
          Buffer.from(
            fields.version.buffer,
            fields.version.byteOffset,
            fields.version.length
          )) ||
        null,
      schedule:
        (fields.schedule &&
          Buffer.from(
            fields.schedule.buffer,
            fields.schedule.byteOffset,
            fields.schedule.length
          )) ||
        null,
      mrEnclaves: fields.mrEnclaves,
      usersDisabled: fields.usersDisabled,
      usersRequireAuthorization: fields.usersRequireAuthorization,
      usersDefaultSlotsUntilExpiration: fields.usersDefaultSlotsUntilExpiration,
      usersRequestFee: fields.usersRequestFee,
    };
  }

  toJSON(): FunctionSetConfigParamsJSON {
    return {
      name: (this.name && Array.from(this.name.values())) || null,
      metadata: (this.metadata && Array.from(this.metadata.values())) || null,
      container:
        (this.container && Array.from(this.container.values())) || null,
      containerRegistry:
        (this.containerRegistry &&
          Array.from(this.containerRegistry.values())) ||
        null,
      version: (this.version && Array.from(this.version.values())) || null,
      schedule: (this.schedule && Array.from(this.schedule.values())) || null,
      mrEnclaves: this.mrEnclaves,
      usersDisabled: this.usersDisabled,
      usersRequireAuthorization: this.usersRequireAuthorization,
      usersDefaultSlotsUntilExpiration:
        (this.usersDefaultSlotsUntilExpiration &&
          this.usersDefaultSlotsUntilExpiration.toString()) ||
        null,
      usersRequestFee:
        (this.usersRequestFee && this.usersRequestFee.toString()) || null,
    };
  }

  static fromJSON(obj: FunctionSetConfigParamsJSON): FunctionSetConfigParams {
    return new FunctionSetConfigParams({
      name: (obj.name && Uint8Array.from(obj.name)) || null,
      metadata: (obj.metadata && Uint8Array.from(obj.metadata)) || null,
      container: (obj.container && Uint8Array.from(obj.container)) || null,
      containerRegistry:
        (obj.containerRegistry && Uint8Array.from(obj.containerRegistry)) ||
        null,
      version: (obj.version && Uint8Array.from(obj.version)) || null,
      schedule: (obj.schedule && Uint8Array.from(obj.schedule)) || null,
      mrEnclaves: obj.mrEnclaves,
      usersDisabled: obj.usersDisabled,
      usersRequireAuthorization: obj.usersRequireAuthorization,
      usersDefaultSlotsUntilExpiration:
        (obj.usersDefaultSlotsUntilExpiration &&
          new BN(obj.usersDefaultSlotsUntilExpiration)) ||
        null,
      usersRequestFee:
        (obj.usersRequestFee && new BN(obj.usersRequestFee)) || null,
    });
  }

  toEncodable() {
    return FunctionSetConfigParams.toEncodable(this);
  }
}
