import { AccountMeta, Keypair, PublicKey } from '@solana/web3.js';
import { CreateQueueVrfParams } from '../accounts';
import { Callback } from '../generated';
import {
  keypairToString,
  loadKeypair,
  parseBoolean,
  parseString,
} from './utils';

export type IVrfJson = Omit<CreateQueueVrfParams, 'callback'> & {
  callback: Callback;
};

export class VrfJson implements IVrfJson {
  // vrf params
  callback: Callback;

  // permission params
  enable: boolean;

  // accounts
  vrfKeypair: Keypair;
  authorityKeypair?: Keypair;
  authority?: PublicKey;

  constructor(object: Record<string, any>) {
    if (!('callback' in object)) {
      throw new Error(`VRF has no callback defined`);
    }
    this.callback = Callback.fromJSON(object.callback);

    // permissions
    this.enable = parseBoolean(object, 'enable', false);

    // accounts
    const keypairPath = parseString(object, 'keypair');
    this.vrfKeypair = keypairPath
      ? loadKeypair(keypairPath)
      : Keypair.generate();

    if ('authorityKeypair' in object) {
      const authorityPath = parseString(object, 'authorityKeypair');
      this.authorityKeypair = authorityPath
        ? loadKeypair(authorityPath)
        : undefined;
      this.authority = this.authorityKeypair
        ? this.authorityKeypair.publicKey
        : undefined;
    } else if ('authority' in object) {
      if (typeof object.authority !== 'string') {
        throw new Error(`Vrf authority field should be a string`);
      }
      this.authority = new PublicKey(object.authority);
    }
  }

  static loadMultiple(object: Record<string, any>): Array<VrfJson> {
    const vrfJsons: Array<VrfJson> = [];
    if ('vrfs' in object && Array.isArray(object.aggregators)) {
      for (const vrf of object.vrfs) {
        vrfJsons.push(new VrfJson(vrf));
      }
    }

    return vrfJsons;
  }

  toJSON() {
    return {
      callback: {
        programId: this.callback.programId,
        accounts: this.callback.accounts.map((a): AccountMeta => {
          return {
            pubkey: a.pubkey,
            isSigner: a.isSigner,
            isWritable: a.isWritable,
          };
        }),
        isData: Buffer.from(this.callback.ixData),
      },
      keypair: keypairToString(this.vrfKeypair),
      authority: this.authority?.toBase58() ?? undefined,
      authorityKeypair: this.authorityKeypair
        ? keypairToString(this.authorityKeypair)
        : undefined,
    };
  }
}
