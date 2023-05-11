import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh';
import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionInitParamsFields {
  container: Array<number>;
  version: Array<number>;
  schedule: Array<number>;
}

export interface FunctionInitParamsJSON {
  container: Array<number>;
  version: Array<number>;
  schedule: Array<number>;
}

export class FunctionInitParams {
  readonly container: Array<number>;
  readonly version: Array<number>;
  readonly schedule: Array<number>;

  constructor(fields: FunctionInitParamsFields) {
    this.container = fields.container;
    this.version = fields.version;
    this.schedule = fields.schedule;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.array(borsh.u8(), 32, 'container'),
        borsh.array(borsh.u8(), 32, 'version'),
        borsh.array(borsh.u8(), 64, 'schedule'),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionInitParams({
      container: obj.container,
      version: obj.version,
      schedule: obj.schedule,
    });
  }

  static toEncodable(fields: FunctionInitParamsFields) {
    return {
      container: fields.container,
      version: fields.version,
      schedule: fields.schedule,
    };
  }

  toJSON(): FunctionInitParamsJSON {
    return {
      container: this.container,
      version: this.version,
      schedule: this.schedule,
    };
  }

  static fromJSON(obj: FunctionInitParamsJSON): FunctionInitParams {
    return new FunctionInitParams({
      container: obj.container,
      version: obj.version,
      schedule: obj.schedule,
    });
  }

  toEncodable() {
    return FunctionInitParams.toEncodable(this);
  }
}
