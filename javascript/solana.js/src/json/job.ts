import { Keypair } from '@solana/web3.js';
import { OracleJob } from '@switchboard-xyz/common';
import {
  keypairToString,
  loadKeypair,
  parseNumber,
  parseString,
} from './utils';

export class JobJson {
  // params
  name: string;
  weight: number;
  expiration: number;
  job: OracleJob;
  data: Uint8Array;

  // accounts
  keypair: Keypair;
  authority?: Keypair;

  constructor(object: Record<string, any>) {
    this.name = parseString(object, 'name', '');
    this.weight = parseNumber(object, 'weight', 1);
    this.expiration = parseNumber(object, 'expiration', 0);

    if (!('tasks' in object) || !Array.isArray(object.tasks)) {
      throw new Error(`Job definitions require a 'tasks' array`);
    }

    this.job = OracleJob.fromObject(object);
    this.data = OracleJob.encodeDelimited(this.job).finish();

    const keypairPath = parseString(object, 'keypair');
    this.keypair = keypairPath ? loadKeypair(keypairPath) : Keypair.generate();

    const authorityPath = parseString(object, 'authority');
    this.authority = authorityPath ? loadKeypair(authorityPath) : undefined;
  }

  static loadMultiple(object: Record<string, any>): Array<JobJson> {
    const jobJsons: Array<JobJson> = [];
    if ('jobs' in object && Array.isArray(object.jobs)) {
      for (const job of object.jobs) {
        jobJsons.push(new JobJson(job));
      }
    }

    return jobJsons;
  }

  toJSON() {
    return {
      name: this.name,
      weight: this.weight,
      expiration: this.expiration,
      keypair: keypairToString(this.keypair),
      authority: this.authority ? keypairToString(this.authority) : undefined,
      tasks: this.job.toJSON(),
    };
  }
}
