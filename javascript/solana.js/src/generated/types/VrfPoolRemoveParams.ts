import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh';

export interface VrfPoolRemoveParamsFields {}

export interface VrfPoolRemoveParamsJSON {}

export class VrfPoolRemoveParams {
  constructor(fields: VrfPoolRemoveParamsFields) {}

  static layout(property?: string) {
    return borsh.struct([], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new VrfPoolRemoveParams({});
  }

  static toEncodable(fields: VrfPoolRemoveParamsFields) {
    return {};
  }

  toJSON(): VrfPoolRemoveParamsJSON {
    return {};
  }

  static fromJSON(obj: VrfPoolRemoveParamsJSON): VrfPoolRemoveParams {
    return new VrfPoolRemoveParams({});
  }

  toEncodable() {
    return VrfPoolRemoveParams.toEncodable(this);
  }
}
