import { Keypair } from '@solana/web3.js';
import { CreateQueueFeedParams } from '../accounts';
import { JobJson } from './job';
import {
  keypairToString,
  loadKeypair,
  parseBoolean,
  parseNumber,
  parseString,
} from './utils';

export class AggregatorJson implements CreateQueueFeedParams {
  // aggregator params
  name: string;
  metadata: string;
  batchSize: number;
  minRequiredOracleResults: number;
  minRequiredJobResults: number;
  minUpdateDelaySeconds: number;
  startAfter: number;
  expiration: number;
  varianceThreshold: number;
  forceReportPeriod: number;
  historyLimit?: number;

  disableCrank: boolean;
  crankIndex?: number;

  slidingWindow?: boolean;
  basePriorityFee?: number;
  priorityFeeBump?: number;
  priorityFeeBumpPeriod?: number;
  maxPriorityFeeMultiplier?: number;

  // lease params
  fundAmount: number;

  // permission params
  enable: boolean;

  // accounts
  keypair: Keypair;
  authority?: Keypair;

  // resources
  jobs: Array<JobJson>;

  constructor(object: Record<string, any>) {
    this.name = parseString(object, 'name', '');
    this.metadata = parseString(object, 'metadata', '');
    this.batchSize = parseNumber(object, 'batchSize', 1);
    this.minRequiredOracleResults = parseNumber(
      object,
      'minRequiredOracleResults',
      1
    );
    this.minRequiredJobResults = parseNumber(
      object,
      'minRequiredJobResults',
      1
    );
    this.minUpdateDelaySeconds = parseNumber(
      object,
      'minUpdateDelaySeconds',
      30
    );
    this.startAfter = parseNumber(object, 'startAfter', 0);
    this.expiration = parseNumber(object, 'expiration', 0);
    this.varianceThreshold = parseNumber(object, 'varianceThreshold', 0);
    this.forceReportPeriod = parseNumber(object, 'forceReportPeriod', 0);
    this.historyLimit =
      'historyLimit' in object
        ? Number.parseInt(object.historyLimit)
        : undefined;

    this.disableCrank = parseBoolean(object, 'disableCrank', false);
    this.crankIndex =
      'crankIndex' in object ? Number(object.crankIndex) : undefined;

    this.slidingWindow = parseBoolean(object, 'slidingWindow', undefined);

    this.basePriorityFee =
      'basePriorityFee' in object
        ? Number.parseInt(object.basePriorityFee)
        : undefined;
    this.priorityFeeBump =
      'priorityFeeBump' in object
        ? Number.parseInt(object.priorityFeeBump)
        : undefined;
    this.priorityFeeBumpPeriod =
      'priorityFeeBumpPeriod' in object
        ? Number.parseInt(object.priorityFeeBumpPeriod)
        : undefined;
    this.maxPriorityFeeMultiplier =
      'maxPriorityFeeMultiplier' in object
        ? Number.parseInt(object.maxPriorityFeeMultiplier)
        : undefined;

    // lease
    this.fundAmount = parseNumber(object, 'fundAmount', 0);

    // permissions
    this.enable = parseBoolean(object, 'enable', false);

    // accounts
    const keypairPath = parseString(object, 'keypair');
    this.keypair = keypairPath ? loadKeypair(keypairPath) : Keypair.generate();

    const authorityPath = parseString(object, 'authority');
    this.authority = authorityPath ? loadKeypair(authorityPath) : undefined;

    // resources
    this.jobs = JobJson.loadMultiple(object);
  }

  static loadMultiple(object: Record<string, any>): Array<AggregatorJson> {
    const aggregatorJsons: Array<AggregatorJson> = [];
    if ('aggregators' in object && Array.isArray(object.aggregators)) {
      for (const aggregator of object.aggregators) {
        aggregatorJsons.push(new AggregatorJson(aggregator));
      }
    }

    return aggregatorJsons;
  }

  toJSON() {
    return {
      name: this.name,
      metadata: this.metadata,
      batchSize: this.batchSize,
      minRequiredOracleResults: this.minRequiredOracleResults,
      minRequiredJobResults: this.minRequiredJobResults,
      minUpdateDelaySeconds: this.minUpdateDelaySeconds,
      startAfter: this.startAfter,
      expiration: this.expiration,
      varianceThreshold: this.varianceThreshold,
      forceReportPeriod: this.forceReportPeriod,
      historyLimit: this.historyLimit,
      disableCrank: this.disableCrank,
      slidingWindow: this.slidingWindow,
      basePriorityFee: this.basePriorityFee,
      priorityFeeBump: this.priorityFeeBump,
      priorityFeeBumpPeriod: this.priorityFeeBumpPeriod,
      maxPriorityFeeMultiplier: this.maxPriorityFeeMultiplier,
      fundAmount: this.fundAmount,
      keypair: keypairToString(this.keypair),
      authority: this.authority ? keypairToString(this.authority) : undefined,
      jobs: this.jobs.map(job => job.toJSON()),
    };
  }
}
