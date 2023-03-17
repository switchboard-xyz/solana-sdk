import * as sbv2 from './src';

import { PublicKey } from '@solana/web3.js';
import { Big, BN, IOracleJob, toUtf8 } from '@switchboard-xyz/common';
import chalk from 'chalk';
import fs from 'fs';
import os from 'os';
import path from 'path';

export const CHECK_ICON = chalk.green('\u2714');

export const FAILED_ICON = chalk.red('\u2717');

export const PLUS_ICON = chalk.blue('\u002B');

const ignoreFields = [
  'program',
  'jobHashes',
  'jobsChecksum',
  'currentRound',
  'latestConfirmedRound',
];

export function setupOutputDir(programId: string) {
  const dirPath = path.join(os.homedir(), 'devnet-migration', programId);
  const feedDirPath = path.join(dirPath, 'feeds');
  if (!fs.existsSync(feedDirPath)) {
    fs.mkdirSync(feedDirPath, { recursive: true });
  }
  const jobDirPath = path.join(dirPath, 'jobs');
  if (!fs.existsSync(jobDirPath)) {
    fs.mkdirSync(jobDirPath, { recursive: true });
  }

  return [dirPath, feedDirPath, jobDirPath];
}

export function jsonReplacers(key, value) {
  if (ignoreFields.includes(key)) {
    return undefined;
  }
  if (
    !value ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value;
  }

  if (
    key === 'ebuf' ||
    key === '_ebuf' ||
    key === 'reserved' ||
    key === 'reserved1'
  ) {
    return;
  }

  if (value instanceof PublicKey) {
    return value.toBase58();
  }

  if ((key === 'name' || key === 'metadata') && Array.isArray(value)) {
    return toUtf8(value);
  }

  if (Array.isArray(value) && value.length > 0) {
    if (typeof value[0] === 'number') {
      if (value.every(item => item === 0)) {
        return [];
      }

      return `[${value.join(',')}]`;
    }

    if (value[0] instanceof PublicKey) {
      return value.filter(
        pubkey => !(pubkey as PublicKey).equals(PublicKey.default)
      );
    }
  }

  if (
    value instanceof sbv2.types.SwitchboardDecimal ||
    ('mantissa' in value && 'scale' in value)
  ) {
    const big = sbv2.types.SwitchboardDecimal.from(value).toBig();
    return big.toString();
  }

  if (value instanceof Big) {
    return value.toString();
  }

  if (BN.isBN(value)) {
    return value.toString();
  }

  return value;
}

export interface IAggregatorDefinition {
  account: {
    publicKey: string;
    size: number;
  };
  data: {
    name: string;
    metadata: string;
    queuePubkey: string;
    oracleRequestBatchSize: number;
    minOracleResults: number;
    minJobResults: number;
    minUpdateDelaySeconds: number;
    startAfter: string;
    varianceThreshold: string;
    forceReportPeriod: string;
    expiration: string;
    consecutiveFailureCount: string;
    nextAllowedUpdateTime: string;
    isLocked: boolean;
    crankPubkey: string;
    jobPubkeysData: Array<string>;
    authority: string;
    historyBuffer: string;
    resolutionMode: {
      kind: string;
    };
    basePriorityFee: number;
    priorityFeeBump: number;
    priorityFeeBumpPeriod: number;
    maxPriorityFeeMultiplier: number;
  };
  permissionAccount: {
    publicKey: string;
    size: number;
  };
  permissions: {
    authority: string;
    permissions: number;
    granter: string;
    grantee: string;
    expiration: string;
  };
  leaseAccount: {
    publicKey: string;
    size: number;
  };
  lease: {
    escrow: string;
    queue: string;
    aggregator: string;
    tokenProgram: string;
    isActive: boolean;
    crankRowCount: number;
    createdAt: string;
    withdrawAuthority: string;
  };
  balance: number;
  jobs: Array<IJobDefinition>;
}

export interface Aggregator {
  publicKey: string;
  definition: {
    name: string;
    metadata: string;
    batchSize: number;
    minRequiredOracleResults: number;
    minRequiredJobResults: number;
    minUpdateDelaySeconds: number;
    historyBufferLength?: number;
    startAfter: number;
    varianceThreshold: number;
    forceReportPeriod: number;
    expiration: number;
    pushCrank: boolean;
    disableCrank: boolean;
    authority: string;
    slidingWindow: boolean;
    basePriorityFee: number;
    priorityFeeBump: number;
    priorityFeeBumpPeriod: number;
    maxPriorityFeeMultiplier: number;
    jobs: Array<{ pubkey: string; weight: number }>;
  };
  data: IAggregatorDefinition;
}

export interface IJobDefinition {
  account: {
    publicKey: string;
  };
  data: {
    name: string;
    metadata: string;
    authority: string;
    expiration: string;
    hash: string;
    data: string;
    referenceCount: number;
    totalSpent: string;
    createdAt: string;
    isInitializing: number;
  };
  oracleJob: IOracleJob;
}

export interface Job {
  publicKey: string;
  definition: {
    data: string;
    name: string;
    authority: string;
    expiration: number;
  };
  data: IJobDefinition;
}
