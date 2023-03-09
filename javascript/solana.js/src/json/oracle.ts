import { CreateQueueOracleParams } from '../accounts';
import { loadKeypair } from '../utils';

import {
  keypairToString,
  parseBoolean,
  parseNumber,
  parseString,
} from './utils';

import { Keypair } from '@solana/web3.js';

export class OracleJson implements CreateQueueOracleParams {
  // oracle params
  name: string;
  metadata: string;

  // staking params
  stakeAmount: number;

  // permission params
  enable: boolean;

  // accounts
  authority?: Keypair;
  stakingWalletKeypair: Keypair;

  constructor(object: Record<string, any>) {
    this.name = parseString(object, 'name', '');
    this.metadata = parseString(object, 'metadata', '');

    // staking
    this.stakeAmount = parseNumber(object, 'stakeAmount', 0);

    // permission
    this.enable = parseBoolean(object, 'enable', false);

    // accounts
    const authorityPath = parseString(object, 'authority');
    this.authority = authorityPath ? loadKeypair(authorityPath) : undefined;

    const stakingWalletPath = parseString(object, 'stakingWalletKeypair');
    this.stakingWalletKeypair = stakingWalletPath
      ? loadKeypair(stakingWalletPath)
      : Keypair.generate();
  }

  static loadMultiple(object: Record<string, any>): Array<OracleJson> {
    const oracleJsons: Array<OracleJson> = [];
    if ('oracles' in object && Array.isArray(object.oracles)) {
      for (const oracle of object.oracles) {
        oracleJsons.push(new OracleJson(oracle));
      }
    }

    return oracleJsons;
  }

  toJSON() {
    return {
      name: this.name,
      metadata: this.metadata,
      stakeAmount: this.stakeAmount,
      authority: this.authority ? keypairToString(this.authority) : undefined,
      stakingWalletKeypair: keypairToString(this.stakingWalletKeypair),
    };
  }
}
