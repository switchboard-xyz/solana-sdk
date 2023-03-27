import * as sbv2 from '../src';

import { jsonReplacers, setupOutputDir } from './utils';

import * as anchor from '@coral-xyz/anchor';
import * as spl from '@solana/spl-token';
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from '@solana/web3.js';
import { OracleJob, toUtf8 } from '@switchboard-xyz/common';
// import { backOff } from 'exponential-backoff';
import fs from 'fs';
import _ from 'lodash';
import path from 'path';

const LEASE_THRESHOLD = (10 * 12500) / LAMPORTS_PER_SOL; // must have at least 10 queue rewards in the lease to migrate

const VERBOSE = process.env.VERBOSE || false;

interface JobDefinition {
  account: sbv2.JobAccount;
  data: sbv2.types.JobAccountData;
  oracleJob: OracleJob;
}

interface AggregatorDefinition {
  account: sbv2.AggregatorAccount;
  data: sbv2.types.AggregatorAccountData;
  historyBufferLength?: number;
  // permissions
  permissionAccount: sbv2.PermissionAccount;
  permissions: sbv2.types.PermissionAccountData;
  // lease
  leaseAccount: sbv2.LeaseAccount;
  lease: sbv2.types.LeaseAccountData;
  // jobs
  jobs: Array<JobDefinition>;
}

type AggregatorDefinitionWithLeaseBalance = AggregatorDefinition & {
  balance: number;
};

async function main() {
  const queuePubkey = new PublicKey(
    process.argv.length > 2
      ? process.argv[2]
      : 'F8ce7MsckeZAbAGmxjJNetxYXQa9mKr9nnrC3qKubyYy'
  );
  const [dirPath, feedDirPath, jobDirPath] = setupOutputDir(
    '2TfB33aLaneQb5TNVwyDz3jSZXS6jdW2ARw1Dgf84XCG'
  );

  const devnetConnection = new Connection(
    process.env.SOLANA_DEVNET_RPC ?? clusterApiUrl('devnet')
  );
  console.log(`rpcUrl: ${devnetConnection.rpcEndpoint}`);

  const payer = sbv2.SwitchboardTestContextV2.loadKeypair(
    '~/.config/solana/id.json'
  );
  console.log(`payer: ${payer.publicKey.toBase58()}`);

  const oldProgram = await sbv2.SwitchboardProgram.load(
    'devnet',
    devnetConnection,
    payer,
    new PublicKey('2TfB33aLaneQb5TNVwyDz3jSZXS6jdW2ARw1Dgf84XCG')
  );
  const oldProgramAccounts = await oldProgram.getProgramAccounts();

  const [queueAccount, queue] = await sbv2.QueueAccount.load(
    oldProgram,
    queuePubkey
  );

  // load all devnet permissionless aggregators
  const allAggregators = Array.from(oldProgramAccounts.aggregators.entries());
  console.log(`Found ${allAggregators.length} aggregators on old programId`);

  const filteredAggregators = allAggregators.filter(
    ([aggregatorKey, aggregator]) =>
      aggregator.queuePubkey.equals(queueAccount.publicKey)
  );
  console.log(`Found ${filteredAggregators.length} aggregators on queue`);

  const aggregators = new Map<string, AggregatorDefinition>();

  for (const [aggregatorKey, aggregator] of filteredAggregators) {
    // check permission account exists
    const [permissionAccount] = sbv2.PermissionAccount.fromSeed(
      oldProgram,
      queue.authority,
      queueAccount.publicKey,
      new PublicKey(aggregatorKey)
    );
    const permissions = oldProgramAccounts.permissions.get(
      permissionAccount.publicKey.toBase58()
    );
    if (!permissions) {
      if (VERBOSE) {
        console.error(`No permissions found for aggregator ${aggregatorKey}`);
      }
      continue;
    }

    // check lease account exists and has an active balance
    const [leaseAccount] = sbv2.LeaseAccount.fromSeed(
      oldProgram,
      sbv2.SWITCHBOARD_LABS_DEVNET_PERMISSIONLESS_QUEUE,
      new PublicKey(aggregatorKey)
    );
    const lease = oldProgramAccounts.leases.get(
      leaseAccount.publicKey.toBase58()
    );
    if (!lease) {
      if (VERBOSE) {
        console.error(`No lease found for aggregator ${aggregatorKey}`);
      }
      continue;
    }

    const jobPubkeys = aggregator.jobPubkeysData.slice(
      0,
      aggregator.jobPubkeysSize
    );
    const aggregatorJobs: Array<JobDefinition> = [];
    for (const job of jobPubkeys) {
      const jobData = oldProgramAccounts.jobs.get(job.toBase58());
      if (!jobData) {
        if (VERBOSE) {
          console.error(`Failed to find jobData for ${job}`);
        }
        continue;
      }

      let oracleJob: OracleJob | undefined = undefined;
      try {
        oracleJob = OracleJob.decodeDelimited(jobData.data);
      } catch (error) {
        if (VERBOSE) {
          console.error(`Failed to decode job ${job.toBase58()}, ${error}`);
        }
      }

      if (!oracleJob) {
        continue;
      }

      const jobDefinition = {
        account: new sbv2.JobAccount(oldProgram, job),
        data: jobData,
        oracleJob: oracleJob,
      };

      aggregatorJobs.push(jobDefinition);
    }

    let historyBufferLength: number | undefined = undefined;
    if (!aggregator.historyBuffer.equals(PublicKey.default)) {
      const buffer = oldProgramAccounts.buffers.get(
        aggregator.historyBuffer.toBase58()
      );
      if (buffer) {
        historyBufferLength = Math.ceil((buffer.byteLength - 8) / 28);
      } else {
        console.error(
          `Failed to fetch history buffer for aggregator ${aggregatorKey} (${aggregator.historyBuffer})`
        );
      }
    }

    aggregators.set(aggregatorKey, {
      account: new sbv2.AggregatorAccount(
        oldProgram,
        new PublicKey(aggregatorKey)
      ),
      data: aggregator,
      historyBufferLength,
      permissionAccount,
      permissions,
      leaseAccount,
      lease,
      jobs: aggregatorJobs,
    });
  }

  // fetch all lease balances in batches of 100
  const leaseBalanceMap = new Map<string, number>();
  const allLeaseEscrows: Array<PublicKey> = Array.from(
    aggregators.entries()
  ).map(([aggregatorKey, aggregator]) => aggregator.lease.escrow);
  const leaseBatches: Array<Array<PublicKey>> = _.chunk(allLeaseEscrows, 100);
  for await (const batch of leaseBatches) {
    const leaseEscrowAccountInfos = await anchor.utils.rpc.getMultipleAccounts(
      oldProgram.connection,
      batch
    );
    for (const leaseEscrowAccountInfo of leaseEscrowAccountInfos) {
      try {
        const account = spl.AccountLayout.decode(
          leaseEscrowAccountInfo!.account.data!
        );

        const leaseBalance =
          Number.parseInt(account.amount.toString()) / LAMPORTS_PER_SOL;

        leaseBalanceMap.set(
          leaseEscrowAccountInfo!.publicKey.toBase58(),
          leaseBalance
        );
      } catch (error) {
        if (VERBOSE) {
          console.error(`Failed to fetch lease escrow balance`);
        }
      }
    }
  }

  const aggregatorToMigrate = new Map<
    string,
    AggregatorDefinitionWithLeaseBalance
  >();
  const jobsToMigrate = new Map<string, JobDefinition>();
  for (const [aggregatorKey, aggregator] of aggregators.entries()) {
    const leaseBalance = leaseBalanceMap.get(
      aggregator.lease.escrow.toBase58()
    );
    if (!leaseBalance) {
      continue;
    }

    if (leaseBalance < LEASE_THRESHOLD) {
      console.error(
        `Lease is below threshold for aggregator ${aggregatorKey}, lease balance = ${leaseBalance}`
      );
      continue;
    } else {
      aggregatorToMigrate.set(aggregatorKey, {
        ...aggregator,
        balance: leaseBalance,
      });
      for (const job of aggregator.jobs) {
        jobsToMigrate.set(job.account.publicKey.toBase58(), job);
      }
    }
  }

  console.log(`Found ${aggregatorToMigrate.size} aggregators to migrate`);

  console.log(`Found ${jobsToMigrate.size} jobs to migrate`);

  const jobPubkeys: Array<string> = [];
  for (const [jobKey, job] of jobsToMigrate.entries()) {
    try {
      const jobInitDefinition = {
        data: `[${new Uint8Array(job.data.data)}]`,
        name: toUtf8(job.data.name),
        authority: job.data.authority.toBase58(),
        expiration: job.data.expiration.toNumber(),
        variables: undefined,
      };
      const fileString = JSON.stringify(
        {
          publicKey: jobKey,
          definition: jobInitDefinition,
          data: job,
        },
        jsonReplacers,
        2
      );
      if (fileString.includes('twapTask')) {
        const twapTaskPath = path.join(dirPath, 'twapJobs');
        fs.mkdirSync(twapTaskPath, { recursive: true });
        fs.writeFileSync(path.join(twapTaskPath, `${jobKey}.json`), fileString);
      } else {
        fs.writeFileSync(path.join(jobDirPath, `${jobKey}.json`), fileString);
      }

      jobPubkeys.push(jobKey);
    } catch (error) {}
  }
  fs.writeFileSync(path.join(dirPath, 'jobs.txt'), jobPubkeys.join('\n'));

  const aggregatorPubkeys: Array<string> = [];
  for (const [aggregatorKey, aggregator] of aggregatorToMigrate.entries()) {
    try {
      const jobs: Array<{ pubkey: string; weight: number }> = [];
      for (const [i, job] of aggregator.data.jobPubkeysData
        .slice(0, aggregator.data.jobPubkeysSize)
        .entries()) {
        jobs.push({
          pubkey: job.toBase58(),
          weight:
            aggregator.data.jobWeights.length >= i
              ? aggregator.data.jobWeights[i] ?? 1
              : 1,
        });
      }

      const aggregatorInitDefinition = {
        name: toUtf8(aggregator.data.name),
        metadata: toUtf8(aggregator.data.metadata),
        batchSize: aggregator.data.oracleRequestBatchSize,
        minRequiredOracleResults: aggregator.data.minOracleResults,
        minRequiredJobResults: aggregator.data.minJobResults,
        minUpdateDelaySeconds: aggregator.data.minUpdateDelaySeconds,
        startAfter: aggregator.data.startAfter.toNumber(),
        varianceThreshold: aggregator.data.varianceThreshold.toBig().toNumber(),
        forceReportPeriod: aggregator.data.forceReportPeriod.toNumber(),
        expiration: aggregator.data.expiration.toNumber(),
        disableCrank: aggregator.data.disableCrank,
        authority: aggregator.data.authority.toBase58(),
        historyLimit: aggregator.historyBufferLength,
        slidingWindow:
          aggregator.data.resolutionMode.kind === 'ModeSlidingResolution',
        basePriorityFee: aggregator.data.basePriorityFee,
        priorityFeeBump: aggregator.data.priorityFeeBump,
        priorityFeeBumpPeriod: aggregator.data.priorityFeeBumpPeriod,
        maxPriorityFeeMultiplier: aggregator.data.maxPriorityFeeMultiplier,
        jobs: jobs,
        pushCrank: !aggregator.data.crankPubkey.equals(PublicKey.default),
      };
      fs.writeFileSync(
        path.join(feedDirPath, `${aggregatorKey}.json`),
        JSON.stringify(
          {
            publicKey: aggregatorKey,
            definition: aggregatorInitDefinition,
            data: aggregator,
          },
          jsonReplacers,
          2
        )
      );
      aggregatorPubkeys.push(aggregatorKey);
    } catch (error) {}
  }
  fs.writeFileSync(
    path.join(dirPath, 'aggregators.txt'),
    aggregatorPubkeys.join('\n')
  );
}

main().catch(error => {
  console.error(error);
});
