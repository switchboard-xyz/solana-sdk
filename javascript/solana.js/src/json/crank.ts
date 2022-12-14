import { Keypair } from '@solana/web3.js';
import { CreateQueueCrankParams } from '../accounts';
import {
  keypairToString,
  loadKeypair,
  parseNumber,
  parseString,
} from './utils';

export class CrankJson implements CreateQueueCrankParams {
  // crank params
  name: string;
  metadata: string;
  maxRows: number;

  // accounts
  keypair: Keypair;
  dataBuffer: Keypair;

  constructor(object: Record<string, any>) {
    this.name = parseString(object, 'name', '');
    this.metadata = parseString(object, 'metadata', '');
    this.maxRows = parseNumber(object, 'maxRows', 100);

    // accounts
    const keypairPath = parseString(object, 'keypair');
    this.keypair = keypairPath ? loadKeypair(keypairPath) : Keypair.generate();

    const dataBufferPath = parseString(object, 'dataBufferKeypair');
    this.dataBuffer = dataBufferPath
      ? loadKeypair(dataBufferPath)
      : Keypair.generate();
  }

  static loadMultiple(object: Record<string, any>): Array<CrankJson> {
    const crankJsons: Array<CrankJson> = [];
    if ('cranks' in object && Array.isArray(object.cranks)) {
      for (const crank of object.cranks) {
        if ('maxRows' in crank) {
          crankJsons.push(new CrankJson(crank));
        }
      }
    }

    return crankJsons;
  }

  toJSON() {
    return {
      name: this.name,
      metadata: this.metadata,
      maxRows: this.maxRows,
      keypair: keypairToString(this.keypair),
      dataBuffer: keypairToString(this.dataBuffer),
    };
  }
}
