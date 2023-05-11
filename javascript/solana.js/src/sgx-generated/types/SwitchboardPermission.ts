import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh';
import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface PermitNodeheartbeatJSON {
  kind: 'PermitNodeheartbeat';
}

export class PermitNodeheartbeat {
  static readonly discriminator = 0;
  static readonly kind = 'PermitNodeheartbeat';
  readonly discriminator = 0;
  readonly kind = 'PermitNodeheartbeat';

  toJSON(): PermitNodeheartbeatJSON {
    return {
      kind: 'PermitNodeheartbeat',
    };
  }

  toEncodable() {
    return {
      PermitNodeheartbeat: {},
    };
  }
}

export interface PermitQueueUsageJSON {
  kind: 'PermitQueueUsage';
}

export class PermitQueueUsage {
  static readonly discriminator = 1;
  static readonly kind = 'PermitQueueUsage';
  readonly discriminator = 1;
  readonly kind = 'PermitQueueUsage';

  toJSON(): PermitQueueUsageJSON {
    return {
      kind: 'PermitQueueUsage',
    };
  }

  toEncodable() {
    return {
      PermitQueueUsage: {},
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.SwitchboardPermissionKind {
  if (typeof obj !== 'object') {
    throw new Error('Invalid enum object');
  }

  if ('PermitNodeheartbeat' in obj) {
    return new PermitNodeheartbeat();
  }
  if ('PermitQueueUsage' in obj) {
    return new PermitQueueUsage();
  }

  throw new Error('Invalid enum object');
}

export function fromJSON(
  obj: types.SwitchboardPermissionJSON
): types.SwitchboardPermissionKind {
  switch (obj.kind) {
    case 'PermitNodeheartbeat': {
      return new PermitNodeheartbeat();
    }
    case 'PermitQueueUsage': {
      return new PermitQueueUsage();
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], 'PermitNodeheartbeat'),
    borsh.struct([], 'PermitQueueUsage'),
  ]);
  if (property !== undefined) {
    return ret.replicate(property);
  }
  return ret;
}
