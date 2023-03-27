import * as sbv2 from '../src';
import { AggregatorAccount, CrankAccount, QueueAccount } from '../src';

import {
  Aggregator,
  CHECK_ICON,
  FAILED_ICON,
  IAggregatorDefinition,
  jsonReplacers,
  PLUS_ICON,
  setupOutputDir,
} from './utils';

import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import { OracleJob, sleep, toUtf8 } from '@switchboard-xyz/common';
import assert from 'assert';
// import { backOff } from 'exponential-backoff';
import fs from 'fs';
import os from 'os';
import path from 'path';

const VERBOSE = process.env.VERBOSE || false;

// expects a directory of keypairs that corresponds to
// aggregatorAccount pubkeys and also the feed authority
const keypairDirectory = path.join(os.homedir(), 'aggregator-keypairs');

const DEFAULT_FEED_OPTIONS = {
  slidingWindow: true,
  basePriorityFee: 10,
  priorityFeeBump: 25,
  priorityFeeBumpPeriod: 150,
  maxPriorityFeeMultiplier: 10,
  historyLimit: 10000,
  enable: true,
};

const aggregatorMapPath = path.join(
  os.homedir(),
  'devnet-migration',
  sbv2.SBV2_MAINNET_PID.toBase58(),
  'aggregator_map.csv'
);

async function main() {
  const [oldDirPath, oldFeedDirPath, oldJobDirPath] = setupOutputDir(
    '2TfB33aLaneQb5TNVwyDz3jSZXS6jdW2ARw1Dgf84XCG'
  );
  const [newDirPath, newFeedDirPath, newJobDirPath] = setupOutputDir(
    sbv2.SBV2_MAINNET_PID.toBase58()
  );

  const keypairs = new Map<string, Keypair>();
  // first find all keypairs in directory
  for (const file of fs.readdirSync(keypairDirectory)) {
    if (!file.endsWith('.json')) {
      continue;
    }
    const fileName = path.basename(file).replace('.json', '');
    const keypair = sbv2.SwitchboardTestContextV2.loadKeypair(
      path.join(keypairDirectory, file)
    );
    assert(
      keypair.publicKey.toBase58() === fileName,
      `Keypair pubkey mismatch, expected ${fileName}, received ${keypair.publicKey.toBase58()}`
    );
    keypairs.set(keypair.publicKey.toBase58(), keypair);
  }

  if (keypairs.size === 0) {
    throw new Error(`Failed to find any keypairs to migrate!`);
  }

  console.log(`Found ${keypairs.size} keypairs`);

  const devnetConnection = new Connection(
    process.env.SOLANA_DEVNET_RPC ?? clusterApiUrl('devnet')
  );
  console.log(`rpcUrl: ${devnetConnection.rpcEndpoint}`);

  const payer = sbv2.SwitchboardTestContextV2.loadKeypair(
    '~/switchboard_environments_v2/devnet/upgrade_authority/upgrade_authority.json'
  );
  console.log(`payer: ${payer.publicKey.toBase58()}`);

  const oldProgram = await sbv2.SwitchboardProgram.load(
    'devnet',
    devnetConnection,
    payer,
    new PublicKey('2TfB33aLaneQb5TNVwyDz3jSZXS6jdW2ARw1Dgf84XCG')
  );
  const newProgram = await sbv2.SwitchboardProgram.load(
    'devnet',
    devnetConnection,
    payer,
    sbv2.SBV2_MAINNET_PID
  );

  const [oldQueueAccount, oldQueue] = await QueueAccount.load(
    oldProgram,
    'GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U'
  );

  const [oldCrankAccount, oldCrank] = await CrankAccount.load(
    oldProgram,
    '85L2cFUvXaeGQ4HrzP8RJEVCL7WvRrXM2msvEmQ82AVr'
  );

  const [newQueueAccount, newQueue] = await QueueAccount.load(
    newProgram,
    sbv2.SWITCHBOARD_LABS_DEVNET_PERMISSIONED_QUEUE
  );
  const [newCrankAccount, newCrank] = await CrankAccount.load(
    newProgram,
    sbv2.SWITCHBOARD_LABS_DEVNET_PERMISSIONED_CRANK
  );

  // keep track of pubkey changes, shouldnt be needed
  const aggregatorMap = loadAggregatorMap();

  for (const [pubkey, keypair] of keypairs.entries()) {
    const feedPath = path.join(oldFeedDirPath, `${pubkey}.json`);
    const aggregatorAccount = new AggregatorAccount(
      oldProgram,
      keypair.publicKey
    );

    const aggregatorAccountInfo = await devnetConnection.getAccountInfo(
      keypair.publicKey
    );

    const programType: 'old' | 'new' | undefined =
      aggregatorAccountInfo &&
      aggregatorAccountInfo.owner.equals(oldProgram.programId)
        ? 'old'
        : aggregatorAccountInfo &&
          aggregatorAccountInfo.owner.equals(newProgram.programId)
        ? 'new'
        : undefined;

    if (programType === 'new') {
      console.log(`Aggregator ${pubkey} has already been migrated`);
      continue;
    }

    console.log(`${PLUS_ICON} ${pubkey} starting migration`);

    try {
      const aggregatorDefinition = await getOrFetchAggregator(
        aggregatorAccount,
        feedPath
      );

      if (programType === 'old') {
        await closeAggregator(aggregatorAccount, keypair);
        console.log(`\t${CHECK_ICON} feed closed`);
      }

      // recreate aggregator

      await createNewAggregator(
        newQueueAccount,
        newQueue,
        payer, // payer is queueAuthority
        newCrankAccount,
        newCrank,
        aggregatorDefinition,
        feedPath,
        aggregatorMap,
        /// UNCOMMENT THIS LINE TO CREATE WITH THE SAME PUBKEY
        keypair
      );
    } catch (error) {
      console.error(`${FAILED_ICON} failed to migrate aggregator, ${pubkey}`);
      console.error(error);
      continue;
    }

    // try to recreate the account 3x times until successful
  }

  async function closeAggregator(
    aggregatorAccount: AggregatorAccount,
    keypair: Keypair,
    attemptCount = 0
  ) {
    if (attemptCount > 8) {
      throw new Error(`Failed to close aggregator`);
    }
    try {
      const aggregatorState = await aggregatorAccount.loadData();
      const closeAccountIxn = await aggregatorAccount.close({
        authority: aggregatorState.authority.equals(keypair.publicKey)
          ? keypair
          : undefined,
      });
      return;
    } catch (closeError) {
      if (closeError instanceof sbv2.AccountNotFoundError) {
        return;
      }
      if (
        ((closeError as any).toString() as string).includes(
          "account doesn't belong to this program"
        )
      ) {
        return;
      }

      console.log(
        `${FAILED_ICON} failed to close aggregator ${aggregatorAccount.publicKey} after ${attemptCount} attempts`
      );
      console.error(closeError);

      attemptCount = attemptCount + 1;
      await sleep(attemptCount * 1000);
      return await closeAggregator(
        aggregatorAccount,
        keypair,
        attemptCount + 1
      );
    }
  }

  async function getOrFetchAggregator(
    aggregatorAccount: AggregatorAccount,
    feedDefPath: string
  ): Promise<Aggregator> {
    let feedDefinition: Aggregator | undefined = fs.existsSync(feedDefPath)
      ? JSON.parse(fs.readFileSync(feedDefPath, 'utf-8'))
      : undefined;

    if (feedDefinition) {
      console.log(
        `\t${CHECK_ICON} feed definition loaded from ${feedDefPath
          .replace(process.cwd(), '.')
          .replace(os.homedir(), '~')}`
      );
    } else {
      const aggregator = await aggregatorAccount.loadData();

      const lastUpdated =
        AggregatorAccount.decodeLatestTimestamp(aggregator).toNumber();
      if (Math.round(Date.now() / 1000) - lastUpdated > 24 * 60 * 60 * 1000) {
        throw new Error(
          `Aggregator ${aggregatorAccount.publicKey} hasnt been updated in 24 hours, skipping ...`
        );
      }

      // fetch the data
      const jobs = await aggregatorAccount.loadJobs(aggregator);
      const leaseBalance = await aggregatorAccount.fetchBalance();

      const [permissionAccount] = aggregatorAccount.getPermissionAccount(
        aggregator.queuePubkey,
        oldQueue.authority
      );
      const permissions = await permissionAccount.loadData();

      const [leaseAccount] = aggregatorAccount.getLeaseAccount(
        aggregator.queuePubkey
      );
      const lease = await leaseAccount.loadData();

      // this is painful, shouldve used JSON converter
      const aggregatorDefinition: IAggregatorDefinition = {
        account: {
          publicKey: aggregatorAccount.publicKey.toBase58(),
          size: aggregatorAccount.size,
        },
        data: {
          name: toUtf8(aggregator.name),
          metadata: toUtf8(aggregator.metadata),
          queuePubkey: aggregator.queuePubkey.toBase58(),
          oracleRequestBatchSize: aggregator.oracleRequestBatchSize,
          minOracleResults: aggregator.minOracleResults,
          minJobResults: aggregator.minJobResults,
          minUpdateDelaySeconds: aggregator.minUpdateDelaySeconds,
          startAfter: aggregator.startAfter.toString(),
          varianceThreshold: aggregator.varianceThreshold.toBig().toString(),
          forceReportPeriod: aggregator.forceReportPeriod.toString(),
          expiration: aggregator.expiration.toString(),
          consecutiveFailureCount:
            aggregator.consecutiveFailureCount.toString(),
          nextAllowedUpdateTime: aggregator.nextAllowedUpdateTime.toString(),
          isLocked: aggregator.isLocked,
          crankPubkey: aggregator.crankPubkey.toString(),
          jobPubkeysData: [],
          authority: aggregator.authority.toBase58(),
          historyBuffer: aggregator.historyBuffer.toBase58(),
          resolutionMode: aggregator.resolutionMode.toJSON(),
          basePriorityFee: aggregator.basePriorityFee,
          priorityFeeBump: aggregator.priorityFeeBump,
          priorityFeeBumpPeriod: aggregator.priorityFeeBumpPeriod,
          maxPriorityFeeMultiplier: aggregator.maxPriorityFeeMultiplier,
        },
        permissionAccount: {
          publicKey: permissionAccount.publicKey.toString(),
          size: permissionAccount.size,
        },
        permissions: permissions.toJSON(),
        leaseAccount: {
          publicKey: leaseAccount.publicKey.toBase58(),
          size: leaseAccount.size,
        },
        lease: lease.toJSON(),
        balance: leaseBalance,
        jobs: jobs.map(j => {
          return {
            account: {
              publicKey: j.account.publicKey.toBase58(),
            },
            data: {
              name: toUtf8(j.state.name),
              metadata: toUtf8(j.state.metadata),
              authority: j.state.authority.toBase58(),
              expiration: j.state.expiration.toString(),
              hash: `[${j.state.hash}]`,
              data: `[${j.state.data}]`,
              referenceCount: j.state.referenceCount,
              totalSpent: j.state.totalSpent.toString(),
              createdAt: j.state.createdAt.toString(),
              isInitializing: j.state.isInitializing,
            },
            oracleJob: j.job.toJSON(),
          };
        }),
      };
      feedDefinition = {
        publicKey: aggregatorAccount.publicKey.toBase58(),
        definition: {
          ...DEFAULT_FEED_OPTIONS,
          name: aggregatorDefinition.data.name,
          metadata: aggregatorDefinition.data.metadata,
          batchSize: aggregatorDefinition.data.oracleRequestBatchSize,
          minRequiredOracleResults: aggregatorDefinition.data.minOracleResults,
          minRequiredJobResults: aggregatorDefinition.data.minJobResults,
          minUpdateDelaySeconds:
            aggregatorDefinition.data.minUpdateDelaySeconds,
          startAfter: 0,
          varianceThreshold: 0,
          forceReportPeriod: 0,
          expiration: 0,
          pushCrank: true,
          disableCrank: false,
          authority: payer.publicKey.toBase58(),
          jobs: aggregatorDefinition.jobs.map(j => {
            return {
              pubkey: j.account.publicKey,
              weight: 1,
            };
          }),
        },
        data: aggregatorDefinition,
      };

      fs.writeFileSync(
        feedDefPath,
        JSON.stringify(feedDefinition, jsonReplacers, 2)
      );
      console.log(
        `\t${CHECK_ICON} feed definition fetched and saved to ${feedDefPath
          .replace(process.cwd(), '.')
          .replace(os.homedir(), '~')}`
      );
    }

    return feedDefinition;
  }

  async function createNewAggregator(
    queueAccount: QueueAccount,
    queue: sbv2.types.OracleQueueAccountData,
    queueAuthority: Keypair,
    crankAccount: CrankAccount,
    crank: sbv2.types.CrankAccountData,
    aggregator: Aggregator,
    newFeedPath: string,
    aggregatorMap: Map<string, string>,
    keypair?: Keypair
  ) {
    // create a feed but keep ourself as the authority until we do all final checks
    const [aggregatorAccount] = await queueAccount.createFeed({
      ...DEFAULT_FEED_OPTIONS,
      keypair: keypair,
      authority: queueAuthority, // make queueAuthority the authority
      enable: true,
      queueAuthority: queueAuthority,
      name: aggregator.definition.name,
      metadata: aggregator.definition.metadata,
      batchSize: aggregator.definition.batchSize,
      minRequiredOracleResults: aggregator.definition.minRequiredOracleResults,
      minRequiredJobResults: aggregator.definition.minRequiredJobResults,
      minUpdateDelaySeconds: aggregator.definition.minUpdateDelaySeconds,
      jobs: aggregator.data.jobs.map(j => {
        return {
          data: OracleJob.encodeDelimited(
            OracleJob.fromObject(j.oracleJob)
          ).finish(),
          weight: 1,
          name: j.data.name,
        };
      }),
      crankPubkey: aggregator.definition.pushCrank
        ? crankAccount.publicKey
        : undefined,
      crankDataBuffer: aggregator.definition.pushCrank
        ? crank.dataBuffer
        : undefined,
      queueAuthorityPubkey: queue.authority,
      fundAmount: Math.max(0.1, aggregator.data?.balance ?? 0.1),
      withdrawAuthority: queueAuthority.publicKey,
    });

    console.log(
      `${CHECK_ICON} ${aggregator.publicKey.padEnd(
        44,
        ' '
      )} -> ${aggregatorAccount.publicKey.toBase58()}`
    );

    try {
      const accounts = await aggregatorAccount.fetchAccounts(
        undefined,
        queueAccount,
        queue,
        'processed'
      );
      fs.writeFileSync(
        newFeedPath,
        JSON.stringify(
          {
            newPublicKey: aggregatorAccount.publicKey.toBase58(),
            oldPublicKey: aggregator.publicKey,
            newFeed: accounts,
            oldFeed: aggregator,
          },
          jsonReplacers,
          2
        )
      );
    } catch {
      fs.writeFileSync(
        newFeedPath,
        JSON.stringify(
          {
            newPublicKey: aggregatorAccount.publicKey.toBase58(),
            oldPublicKey: aggregator.publicKey,
            oldFeed: aggregator,
          },
          jsonReplacers,
          2
        )
      );
    }

    aggregatorMap.set(
      aggregator.publicKey,
      aggregatorAccount.publicKey.toBase58()
    );
    writeAggregatorMap(aggregatorMap);
  }
}

main().catch(error => {
  console.error(error);
});

function writeAggregatorMap(map: Map<string, string>) {
  const fileString = `oldPubkey, newPubkey\n${Array.from(map.entries())
    .map(r => r.join(', '))
    .join('\n')}`;
  fs.writeFileSync(aggregatorMapPath, fileString);
}

function loadAggregatorMap(): Map<string, string> {
  if (!fs.existsSync(aggregatorMapPath)) {
    return new Map();
  }

  const map = new Map();
  const fileString = fs.readFileSync(aggregatorMapPath, 'utf-8');
  const fileLines = fileString.split('\n').slice(1);
  fileLines.forEach(r => {
    const [oldPubkey, newPubkey] = r.split(', ');
    map.set(oldPubkey, newPubkey);
  });

  return map;
}
