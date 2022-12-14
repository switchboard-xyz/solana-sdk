import { Keypair } from '@solana/web3.js';
import { QueueInitParams } from '../accounts';
import {
  keypairToString,
  loadKeypair,
  parseBoolean,
  parseNumber,
  parseString,
} from './utils';

export type IQueueInitParams = Omit<QueueInitParams, 'authority'> & {
  authority?: Keypair;
};

export class QueueJson implements IQueueInitParams {
  // queue params
  name?: string;
  metadata?: string;
  reward: number;
  minStake: number;
  feedProbationPeriod?: number;
  oracleTimeout?: number;
  slashingEnabled?: boolean;
  varianceToleranceMultiplier?: number;
  consecutiveFeedFailureLimit?: number;
  consecutiveOracleFailureLimit?: number;
  queueSize: number;
  unpermissionedFeeds?: boolean;
  unpermissionedVrf?: boolean;
  enableBufferRelayers?: boolean;

  // accounts
  authority?: Keypair;
  keypair: Keypair;
  dataBuffer: Keypair;

  constructor(object: Record<string, any>) {
    this.name = parseString(object, 'name', '');
    this.metadata = parseString(object, 'metadata', '');
    this.reward = parseNumber(object, 'reward', 0);
    this.minStake = parseNumber(object, 'minStake', 0);
    this.feedProbationPeriod = parseNumber(
      object,
      'feedProbationPeriod',
      undefined
    );
    this.oracleTimeout = parseNumber(object, 'oracleTimeout', undefined);
    this.slashingEnabled = parseBoolean(object, 'slashingEnabled', undefined);
    this.varianceToleranceMultiplier = parseNumber(
      object,
      'varianceToleranceMultiplier',
      undefined
    );
    this.consecutiveFeedFailureLimit = parseNumber(
      object,
      'consecutiveFeedFailureLimit',
      undefined
    );
    this.consecutiveOracleFailureLimit = parseNumber(
      object,
      'consecutiveOracleFailureLimit',
      undefined
    );
    this.queueSize = parseNumber(object, 'queueSize', 100);
    this.unpermissionedFeeds = parseBoolean(
      object,
      'unpermissionedFeeds',
      undefined
    );
    this.unpermissionedVrf = parseBoolean(object, 'unpermissionedVrf', false);
    this.enableBufferRelayers = parseBoolean(
      object,
      'enableBufferRelayers',
      undefined
    );

    // accounts
    const keypairPath = parseString(object, 'keypair');
    this.keypair = keypairPath ? loadKeypair(keypairPath) : Keypair.generate();

    const authorityPath = parseString(object, 'authorityKeypair');
    this.authority = authorityPath ? loadKeypair(authorityPath) : undefined;

    const dataBufferPath = parseString(object, 'dataBufferKeypair');
    this.dataBuffer = dataBufferPath
      ? loadKeypair(dataBufferPath)
      : Keypair.generate();
  }

  toJSON() {
    return {
      name: this.name,
      metadata: this.metadata,
      reward: this.reward,
      minStake: this.minStake,
      feedProbationPeriod: this.feedProbationPeriod,
      oracleTimeout: this.oracleTimeout,
      slashingEnabled: this.slashingEnabled,
      varianceToleranceMultiplier: this.varianceToleranceMultiplier,
      consecutiveFeedFailureLimit: this.consecutiveFeedFailureLimit,
      consecutiveOracleFailureLimit: this.consecutiveOracleFailureLimit,
      queueSize: this.queueSize,
      unpermissionedFeeds: this.unpermissionedFeeds,
      unpermissionedVrf: this.unpermissionedVrf,
      enableBufferRelayers: this.enableBufferRelayers,
      authority: this.authority ? keypairToString(this.authority) : undefined,
      keypair: keypairToString(this.keypair),
      dataBuffer: keypairToString(this.dataBuffer),
    };
  }
}
