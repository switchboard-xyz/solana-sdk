import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh';
import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionInitParamsFields {
  name: Uint8Array;
  metadata: Uint8Array;
  container: Uint8Array;
  containerRegistry: Uint8Array;
  version: Uint8Array;
  schedule: Uint8Array;
}

export interface FunctionInitParamsJSON {
  name: Array<number>;
  metadata: Array<number>;
  container: Array<number>;
  containerRegistry: Array<number>;
  version: Array<number>;
  schedule: Array<number>;
}

export class FunctionInitParams {
  readonly name: Uint8Array;
  readonly metadata: Uint8Array;
  readonly container: Uint8Array;
  readonly containerRegistry: Uint8Array;
  readonly version: Uint8Array;
  readonly schedule: Uint8Array;

  constructor(fields: FunctionInitParamsFields) {
    this.name = fields.name;
    this.metadata = fields.metadata;
    this.container = fields.container;
    this.containerRegistry = fields.containerRegistry;
    this.version = fields.version;
    this.schedule = fields.schedule;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.vecU8('name'),
        borsh.vecU8('metadata'),
        borsh.vecU8('container'),
        borsh.vecU8('containerRegistry'),
        borsh.vecU8('version'),
        borsh.vecU8('schedule'),
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
    });
  }

  toEncodable() {
    return FunctionInitParams.toEncodable(this);
  }
}
