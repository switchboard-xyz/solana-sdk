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
  mrEnclaves: Array<Array<number>> | null;
  requestsDisabled: boolean | null;
  requestsRequireAuthorization: boolean | null;
  requestsDevFee: BN | null;
  routinesDisabled: boolean | null;
  lockRoutinesDisabled: boolean | null;
  routinesRequireAuthorization: boolean | null;
  routinesDevFee: BN | null;
}

export interface FunctionSetConfigParamsJSON {
  name: Array<number> | null;
  metadata: Array<number> | null;
  container: Array<number> | null;
  containerRegistry: Array<number> | null;
  version: Array<number> | null;
  mrEnclaves: Array<Array<number>> | null;
  requestsDisabled: boolean | null;
  requestsRequireAuthorization: boolean | null;
  requestsDevFee: string | null;
  routinesDisabled: boolean | null;
  lockRoutinesDisabled: boolean | null;
  routinesRequireAuthorization: boolean | null;
  routinesDevFee: string | null;
}

export class FunctionSetConfigParams {
  readonly name: Uint8Array | null;
  readonly metadata: Uint8Array | null;
  readonly container: Uint8Array | null;
  readonly containerRegistry: Uint8Array | null;
  readonly version: Uint8Array | null;
  readonly mrEnclaves: Array<Array<number>> | null;
  readonly requestsDisabled: boolean | null;
  readonly requestsRequireAuthorization: boolean | null;
  readonly requestsDevFee: BN | null;
  readonly routinesDisabled: boolean | null;
  readonly lockRoutinesDisabled: boolean | null;
  readonly routinesRequireAuthorization: boolean | null;
  readonly routinesDevFee: BN | null;

  constructor(fields: FunctionSetConfigParamsFields) {
    this.name = fields.name;
    this.metadata = fields.metadata;
    this.container = fields.container;
    this.containerRegistry = fields.containerRegistry;
    this.version = fields.version;
    this.mrEnclaves = fields.mrEnclaves;
    this.requestsDisabled = fields.requestsDisabled;
    this.requestsRequireAuthorization = fields.requestsRequireAuthorization;
    this.requestsDevFee = fields.requestsDevFee;
    this.routinesDisabled = fields.routinesDisabled;
    this.lockRoutinesDisabled = fields.lockRoutinesDisabled;
    this.routinesRequireAuthorization = fields.routinesRequireAuthorization;
    this.routinesDevFee = fields.routinesDevFee;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.option(borsh.vecU8(), "name"),
        borsh.option(borsh.vecU8(), "metadata"),
        borsh.option(borsh.vecU8(), "container"),
        borsh.option(borsh.vecU8(), "containerRegistry"),
        borsh.option(borsh.vecU8(), "version"),
        borsh.option(borsh.vec(borsh.array(borsh.u8(), 32)), "mrEnclaves"),
        borsh.option(borsh.bool(), "requestsDisabled"),
        borsh.option(borsh.bool(), "requestsRequireAuthorization"),
        borsh.option(borsh.u64(), "requestsDevFee"),
        borsh.option(borsh.bool(), "routinesDisabled"),
        borsh.option(borsh.bool(), "lockRoutinesDisabled"),
        borsh.option(borsh.bool(), "routinesRequireAuthorization"),
        borsh.option(borsh.u64(), "routinesDevFee"),
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
      mrEnclaves: obj.mrEnclaves,
      requestsDisabled: obj.requestsDisabled,
      requestsRequireAuthorization: obj.requestsRequireAuthorization,
      requestsDevFee: obj.requestsDevFee,
      routinesDisabled: obj.routinesDisabled,
      lockRoutinesDisabled: obj.lockRoutinesDisabled,
      routinesRequireAuthorization: obj.routinesRequireAuthorization,
      routinesDevFee: obj.routinesDevFee,
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
      mrEnclaves: fields.mrEnclaves,
      requestsDisabled: fields.requestsDisabled,
      requestsRequireAuthorization: fields.requestsRequireAuthorization,
      requestsDevFee: fields.requestsDevFee,
      routinesDisabled: fields.routinesDisabled,
      lockRoutinesDisabled: fields.lockRoutinesDisabled,
      routinesRequireAuthorization: fields.routinesRequireAuthorization,
      routinesDevFee: fields.routinesDevFee,
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
      mrEnclaves: this.mrEnclaves,
      requestsDisabled: this.requestsDisabled,
      requestsRequireAuthorization: this.requestsRequireAuthorization,
      requestsDevFee:
        (this.requestsDevFee && this.requestsDevFee.toString()) || null,
      routinesDisabled: this.routinesDisabled,
      lockRoutinesDisabled: this.lockRoutinesDisabled,
      routinesRequireAuthorization: this.routinesRequireAuthorization,
      routinesDevFee:
        (this.routinesDevFee && this.routinesDevFee.toString()) || null,
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
      mrEnclaves: obj.mrEnclaves,
      requestsDisabled: obj.requestsDisabled,
      requestsRequireAuthorization: obj.requestsRequireAuthorization,
      requestsDevFee:
        (obj.requestsDevFee && new BN(obj.requestsDevFee)) || null,
      routinesDisabled: obj.routinesDisabled,
      lockRoutinesDisabled: obj.lockRoutinesDisabled,
      routinesRequireAuthorization: obj.routinesRequireAuthorization,
      routinesDevFee:
        (obj.routinesDevFee && new BN(obj.routinesDevFee)) || null,
    });
  }

  toEncodable() {
    return FunctionSetConfigParams.toEncodable(this);
  }
}
