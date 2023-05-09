import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh';
import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VrfLiteProveAndVerifyParamsFields {
  nonce: number | null;
  proof: Uint8Array;
  proofEncoded: string;
  counter: BN;
}

export interface VrfLiteProveAndVerifyParamsJSON {
  nonce: number | null;
  proof: Array<number>;
  proofEncoded: string;
  counter: string;
}

export class VrfLiteProveAndVerifyParams {
  readonly nonce: number | null;
  readonly proof: Uint8Array;
  readonly proofEncoded: string;
  readonly counter: BN;

  constructor(fields: VrfLiteProveAndVerifyParamsFields) {
    this.nonce = fields.nonce;
    this.proof = fields.proof;
    this.proofEncoded = fields.proofEncoded;
    this.counter = fields.counter;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.option(borsh.u32(), 'nonce'),
        borsh.vecU8('proof'),
        borsh.str('proofEncoded'),
        borsh.u128('counter'),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new VrfLiteProveAndVerifyParams({
      nonce: obj.nonce,
      proof: new Uint8Array(
        obj.proof.buffer,
        obj.proof.byteOffset,
        obj.proof.length
      ),
      proofEncoded: obj.proofEncoded,
      counter: obj.counter,
    });
  }

  static toEncodable(fields: VrfLiteProveAndVerifyParamsFields) {
    return {
      nonce: fields.nonce,
      proof: Buffer.from(
        fields.proof.buffer,
        fields.proof.byteOffset,
        fields.proof.length
      ),
      proofEncoded: fields.proofEncoded,
      counter: fields.counter,
    };
  }

  toJSON(): VrfLiteProveAndVerifyParamsJSON {
    return {
      nonce: this.nonce,
      proof: Array.from(this.proof.values()),
      proofEncoded: this.proofEncoded,
      counter: this.counter.toString(),
    };
  }

  static fromJSON(
    obj: VrfLiteProveAndVerifyParamsJSON
  ): VrfLiteProveAndVerifyParams {
    return new VrfLiteProveAndVerifyParams({
      nonce: obj.nonce,
      proof: Uint8Array.from(obj.proof),
      proofEncoded: obj.proofEncoded,
      counter: new BN(obj.counter),
    });
  }

  toEncodable() {
    return VrfLiteProveAndVerifyParams.toEncodable(this);
  }
}
