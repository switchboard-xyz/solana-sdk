import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionInitParamsFields {
  recentSlot: BN;
  creatorSeed: Array<number> | null;
  name: Uint8Array;
  metadata: Uint8Array;
  container: Uint8Array;
  containerRegistry: Uint8Array;
  version: Uint8Array;
  mrEnclave: Array<number> | null;
  requestsDisabled: boolean;
  requestsRequireAuthorization: boolean;
  requestsDevFee: BN;
  routinesDisabled: boolean;
  routinesRequireAuthorization: boolean;
  routinesDevFee: BN;
}

export interface FunctionInitParamsJSON {
  recentSlot: string;
  creatorSeed: Array<number> | null;
  name: Array<number>;
  metadata: Array<number>;
  container: Array<number>;
  containerRegistry: Array<number>;
  version: Array<number>;
  mrEnclave: Array<number> | null;
  requestsDisabled: boolean;
  requestsRequireAuthorization: boolean;
  requestsDevFee: string;
  routinesDisabled: boolean;
  routinesRequireAuthorization: boolean;
  routinesDevFee: string;
}

export class FunctionInitParams {
  readonly recentSlot: BN;
  readonly creatorSeed: Array<number> | null;
  readonly name: Uint8Array;
  readonly metadata: Uint8Array;
  readonly container: Uint8Array;
  readonly containerRegistry: Uint8Array;
  readonly version: Uint8Array;
  readonly mrEnclave: Array<number> | null;
  readonly requestsDisabled: boolean;
  readonly requestsRequireAuthorization: boolean;
  readonly requestsDevFee: BN;
  readonly routinesDisabled: boolean;
  readonly routinesRequireAuthorization: boolean;
  readonly routinesDevFee: BN;

  constructor(fields: FunctionInitParamsFields) {
    this.recentSlot = fields.recentSlot;
    this.creatorSeed = fields.creatorSeed;
    this.name = fields.name;
    this.metadata = fields.metadata;
    this.container = fields.container;
    this.containerRegistry = fields.containerRegistry;
    this.version = fields.version;
    this.mrEnclave = fields.mrEnclave;
    this.requestsDisabled = fields.requestsDisabled;
    this.requestsRequireAuthorization = fields.requestsRequireAuthorization;
    this.requestsDevFee = fields.requestsDevFee;
    this.routinesDisabled = fields.routinesDisabled;
    this.routinesRequireAuthorization = fields.routinesRequireAuthorization;
    this.routinesDevFee = fields.routinesDevFee;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u64("recentSlot"),
        borsh.option(borsh.array(borsh.u8(), 32), "creatorSeed"),
        borsh.vecU8("name"),
        borsh.vecU8("metadata"),
        borsh.vecU8("container"),
        borsh.vecU8("containerRegistry"),
        borsh.vecU8("version"),
        borsh.option(borsh.array(borsh.u8(), 32), "mrEnclave"),
        borsh.bool("requestsDisabled"),
        borsh.bool("requestsRequireAuthorization"),
        borsh.u64("requestsDevFee"),
        borsh.bool("routinesDisabled"),
        borsh.bool("routinesRequireAuthorization"),
        borsh.u64("routinesDevFee"),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionInitParams({
      recentSlot: obj.recentSlot,
      creatorSeed: obj.creatorSeed,
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
      mrEnclave: obj.mrEnclave,
      requestsDisabled: obj.requestsDisabled,
      requestsRequireAuthorization: obj.requestsRequireAuthorization,
      requestsDevFee: obj.requestsDevFee,
      routinesDisabled: obj.routinesDisabled,
      routinesRequireAuthorization: obj.routinesRequireAuthorization,
      routinesDevFee: obj.routinesDevFee,
    });
  }

  static toEncodable(fields: FunctionInitParamsFields) {
    return {
      recentSlot: fields.recentSlot,
      creatorSeed: fields.creatorSeed,
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
      mrEnclave: fields.mrEnclave,
      requestsDisabled: fields.requestsDisabled,
      requestsRequireAuthorization: fields.requestsRequireAuthorization,
      requestsDevFee: fields.requestsDevFee,
      routinesDisabled: fields.routinesDisabled,
      routinesRequireAuthorization: fields.routinesRequireAuthorization,
      routinesDevFee: fields.routinesDevFee,
    };
  }

  toJSON(): FunctionInitParamsJSON {
    return {
      recentSlot: this.recentSlot.toString(),
      creatorSeed: this.creatorSeed,
      name: Array.from(this.name.values()),
      metadata: Array.from(this.metadata.values()),
      container: Array.from(this.container.values()),
      containerRegistry: Array.from(this.containerRegistry.values()),
      version: Array.from(this.version.values()),
      mrEnclave: this.mrEnclave,
      requestsDisabled: this.requestsDisabled,
      requestsRequireAuthorization: this.requestsRequireAuthorization,
      requestsDevFee: this.requestsDevFee.toString(),
      routinesDisabled: this.routinesDisabled,
      routinesRequireAuthorization: this.routinesRequireAuthorization,
      routinesDevFee: this.routinesDevFee.toString(),
    };
  }

  static fromJSON(obj: FunctionInitParamsJSON): FunctionInitParams {
    return new FunctionInitParams({
      recentSlot: new BN(obj.recentSlot),
      creatorSeed: obj.creatorSeed,
      name: Uint8Array.from(obj.name),
      metadata: Uint8Array.from(obj.metadata),
      container: Uint8Array.from(obj.container),
      containerRegistry: Uint8Array.from(obj.containerRegistry),
      version: Uint8Array.from(obj.version),
      mrEnclave: obj.mrEnclave,
      requestsDisabled: obj.requestsDisabled,
      requestsRequireAuthorization: obj.requestsRequireAuthorization,
      requestsDevFee: new BN(obj.requestsDevFee),
      routinesDisabled: obj.routinesDisabled,
      routinesRequireAuthorization: obj.routinesRequireAuthorization,
      routinesDevFee: new BN(obj.routinesDevFee),
    });
  }

  toEncodable() {
    return FunctionInitParams.toEncodable(this);
  }
}
