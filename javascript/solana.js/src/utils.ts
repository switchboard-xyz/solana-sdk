import {
  type AggregatorAccount,
  type CreateQueueFeedParams,
  JobAccount,
  type QueueAccount,
} from './accounts';
import { type AggregatorAccountData } from './generated';
import { TransactionObject } from './TransactionObject';

import { Keypair, PublicKey } from '@solana/web3.js';
import { OracleJob } from '@switchboard-xyz/common';
import fs from 'fs';
import os from 'os';
import path from 'path';

export function loadKeypair(keypairPath: string): Keypair {
  const fullPath =
    keypairPath.startsWith('/') || keypairPath.startsWith('C:')
      ? keypairPath
      : keypairPath.startsWith('~')
      ? os.homedir() + keypairPath.slice(1)
      : path.join(process.cwd(), keypairPath);

  if (!fs.existsSync(fullPath)) {
    const keypair = Keypair.generate();
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, `[${keypair.secretKey}]`);
    return keypair;
  }

  return Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(fullPath, 'utf-8')))
  );
}

/**
 * Create a feed and wait for it to resolve to a static value
 * @param queueAccount - the oracle queue to create the feed on
 * @param params - the aggregator init params and the static value to resolve the feed to
 * @param timeout - the number of milliseconds to wait before timing out
 *
 * Basic usage example:
 *
 * ```ts
 * import { createStaticFeed, QueueAccount, AggregatorAccount } from "@switchboard-xyz/solana.js";
 *
 * let queueAccount: QueueAccount;
 * let staticFeedAccount: AggregatorAccount;
 *
 * [staticFeedAccount] = await createStaticFeed(queueAccount, {
 *    value: 10,
 * });
 * const staticFeedValue: Big = await staticFeedAccount.fetchLatestValue();
 * assert(staticFeedValue.toNumber() === 10, "StaticFeedValueMismatch");
 * ```
 */
export async function createStaticFeed(
  queueAccount: QueueAccount,
  params: Partial<CreateQueueFeedParams> & { value: number },
  timeout = 30000
): Promise<[AggregatorAccount, AggregatorAccountData]> {
  const [aggregatorAccount] = await queueAccount.createFeed({
    ...params,
    batchSize: params.batchSize ?? 1,
    minUpdateDelaySeconds: params.minUpdateDelaySeconds ?? 10,
    minRequiredOracleResults: params.minRequiredOracleResults ?? 1,
    minRequiredJobResults: params.minRequiredJobResults ?? 1,
    jobs: [
      {
        weight: 1,
        data: OracleJob.encodeDelimited(
          OracleJob.fromObject({
            tasks: [
              {
                valueTask: {
                  value: params.value,
                },
              },
            ],
          })
        ).finish(),
      },
    ],
  });

  const [state] = await aggregatorAccount.openRoundAndAwaitResult(
    undefined,
    timeout
  );

  return [aggregatorAccount, state];
}

/**
 * Update an existing aggregator that resolves to a new static value, then await the new result
 * @param aggregatorAccount - the aggregator account to modify
 * @param value - the static value the feed will resolve to
 * @param timeout - the number of milliseconds to wait before timing out
 *
 * Basic usage example:
 *
 * ```ts
 * import { updateStaticFeed, AggregatorAccount } from "@switchboard-xyz/solana.js";
 *
 * let staticFeedAccount: AggregatorAccount;
 *
 * const staticFeedState = await updateStaticFeed(staticFeedAccount, 100);
 * staticFeedValue = AggregatorAccount.decodeLatestValue(staticFeedState);
 * assert(staticFeedValue.toNumber() === 100, "StaticFeedValueMismatch");
 * ```
 */
export async function updateStaticFeed(
  aggregatorAccount: AggregatorAccount,
  value: number,
  timeout = 30000
): Promise<AggregatorAccountData> {
  const aggregator = await aggregatorAccount.loadData();

  const [jobAccount, jobInit] = JobAccount.createInstructions(
    aggregatorAccount.program,
    aggregatorAccount.program.walletPubkey,
    {
      data: OracleJob.encodeDelimited(
        OracleJob.create({
          tasks: [
            OracleJob.Task.create({
              valueTask: OracleJob.ValueTask.create({
                value,
              }),
            }),
          ],
        })
      ).finish(),
    }
  );

  const oldJobKeys = aggregator.jobPubkeysData.filter(
    pubkey => !pubkey.equals(PublicKey.default)
  );

  const oldJobs: Array<[JobAccount, number]> = oldJobKeys.map((pubkey, i) => [
    new JobAccount(aggregatorAccount.program, pubkey),
    i,
  ]);

  const removeJobTxns = oldJobs.map(job =>
    aggregatorAccount.removeJobInstruction(
      aggregatorAccount.program.walletPubkey,
      {
        job: job[0],
        jobIdx: job[1],
      }
    )
  );

  const addJobTxn = aggregatorAccount.addJobInstruction(
    aggregatorAccount.program.walletPubkey,
    { job: jobAccount }
  );

  const txns = TransactionObject.pack([
    ...jobInit,
    ...removeJobTxns,
    addJobTxn,
  ]);
  await aggregatorAccount.program.signAndSendAll(txns);

  const [state] = await aggregatorAccount.openRoundAndAwaitResult(
    undefined,
    timeout
  );

  return state;
}
