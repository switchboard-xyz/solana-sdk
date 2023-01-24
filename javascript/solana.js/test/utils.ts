import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from '@solana/web3.js';
import { OracleJob } from '@switchboard-xyz/common';
import dotenv from 'dotenv';
import fs from 'fs';
import os from 'os';
import path from 'path';
import * as sbv2 from '../src';
import {
  AggregatorAccount,
  CreateQueueFeedParams,
  QueueAccount,
  SBV2_DEVNET_PID,
  SBV2_MAINNET_PID,
  TransactionObject,
} from '../src';
dotenv.config();

type SolanaCluster = 'localnet' | 'devnet' | 'mainnet-beta';

export const sleep = (ms: number): Promise<any> =>
  new Promise(s => setTimeout(s, ms));

export const DEFAULT_KEYPAIR_PATH = path.join(
  os.homedir(),
  '.config/solana/id.json'
);

export interface TestContext {
  cluster: SolanaCluster;
  program: sbv2.SwitchboardProgram;
  payer: Keypair;
  toUrl: (signature: string) => string;
}

export function isLocalnet(): boolean {
  if (process.env.SOLANA_LOCALNET) {
    switch (process.env.SOLANA_LOCALNET) {
      case '1':
      case 'true':
      case 'localnet': {
        return true;
      }
    }
  }
  return false;
}

export function getCluster(): SolanaCluster {
  if (process.env.SOLANA_CLUSTER) {
    const cluster = String(process.env.SOLANA_CLUSTER);
    if (
      cluster === 'localnet' ||
      cluster === 'devnet' ||
      cluster === 'mainnet-beta'
    ) {
      return cluster;
    } else {
      throw new Error(
        `SOLANA_CLUSTER must be localnet, devnet, or mainnet-beta`
      );
    }
  }

  if (isLocalnet()) {
    return 'localnet';
  }

  return 'devnet';
}

export function getProgramId(cluster: SolanaCluster): PublicKey {
  if (process.env.SWITCHBOARD_PROGRAM_ID) {
    return new PublicKey(process.env.SWITCHBOARD_PROGRAM_ID);
  }

  if (cluster === 'mainnet-beta') {
    return SBV2_MAINNET_PID;
  }

  return SBV2_DEVNET_PID;
}

export function getRpcUrl(cluster: SolanaCluster): string {
  if (process.env.SOLANA_RPC_URL) {
    return String(process.env.SOLANA_RPC_URL);
  }

  if (cluster === 'localnet') {
    return 'http://localhost:8899';
  }

  return clusterApiUrl(cluster);
}

export async function setupTest(): Promise<TestContext> {
  const cluster = getCluster();
  const payer: Keypair = fs.existsSync(DEFAULT_KEYPAIR_PATH)
    ? Keypair.fromSecretKey(
        new Uint8Array(
          JSON.parse(fs.readFileSync(DEFAULT_KEYPAIR_PATH, 'utf8'))
        )
      )
    : Keypair.generate();

  const programId = getProgramId(cluster);

  const program = await sbv2.SwitchboardProgram.load(
    cluster,
    new Connection(getRpcUrl(cluster), { commitment: 'confirmed' }),
    payer,
    programId
  );

  // request airdrop if low on funds
  const payerBalance = await program.connection.getBalance(payer.publicKey);
  if (payerBalance === 0) {
    const airdropTxn = await program.connection.requestAirdrop(
      payer.publicKey,
      1 * LAMPORTS_PER_SOL
    );
    console.log(`Airdrop requested: ${airdropTxn}`);
    await program.connection.confirmTransaction(airdropTxn);
  }

  // Check if programStateAccount exists
  try {
    const programState = await program.connection.getAccountInfo(
      program.programState.publicKey
    );
    if (!programState || programState.data === null) {
      await sbv2.ProgramStateAccount.getOrCreate(program);
    }
  } catch (e) {
    console.error(e);
  }

  await program.mint.getOrCreateAssociatedUser(program.walletPubkey);

  return {
    cluster,
    program,
    payer,
    toUrl: signature =>
      cluster === 'localnet'
        ? `https://explorer.solana.com/tx/${signature}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`
        : `https://explorer.solana.com/tx/${signature}${
            cluster === 'devnet' ? '?cluster=devnet' : ''
          }`,
  };
}

export async function createFeed(
  queueAccount: QueueAccount,
  feedConfig?: Partial<CreateQueueFeedParams>
): Promise<AggregatorAccount> {
  const [aggregatorAccount] = await queueAccount.createFeed({
    name: feedConfig?.name ?? `Aggregator`,
    queueAuthority: feedConfig?.queueAuthority,
    batchSize: feedConfig?.batchSize ?? 1,
    minRequiredOracleResults: feedConfig?.minRequiredOracleResults ?? 1,
    minRequiredJobResults: feedConfig?.minRequiredOracleResults ?? 1,
    minUpdateDelaySeconds: feedConfig?.minUpdateDelaySeconds ?? 10,
    fundAmount: feedConfig?.fundAmount ?? 0,
    enable: feedConfig?.enable ?? true,
    jobs:
      feedConfig?.jobs && feedConfig?.jobs.length > 0
        ? feedConfig?.jobs
        : [
            {
              weight: 2,
              data: OracleJob.encodeDelimited(
                OracleJob.fromObject({
                  tasks: [
                    {
                      valueTask: {
                        value: 1,
                      },
                    },
                  ],
                })
              ).finish(),
            },
          ],
  });

  return aggregatorAccount;
}

export async function createFeeds(
  queueAccount: QueueAccount,
  numFeeds: number,
  feedConfig?: Partial<CreateQueueFeedParams>
): Promise<Array<AggregatorAccount>> {
  const aggregators: Array<AggregatorAccount> = [];
  const txns: Array<Array<TransactionObject>> = [];
  for (const i of Array.from(Array(numFeeds).keys())) {
    const [aggregatorAccount, txn] = await queueAccount.createFeedInstructions(
      queueAccount.program.walletPubkey,
      {
        name: feedConfig?.name ?? `Aggregator-${i + 1}`,
        queueAuthority: feedConfig?.queueAuthority,
        batchSize: feedConfig?.batchSize ?? 1,
        minRequiredOracleResults: feedConfig?.minRequiredOracleResults ?? 1,
        minRequiredJobResults: feedConfig?.minRequiredOracleResults ?? 1,
        minUpdateDelaySeconds:
          feedConfig?.minUpdateDelaySeconds ??
          5 + Math.floor(Math.random() * 25), // 5 - 30 sec,
        fundAmount: feedConfig?.fundAmount ?? 0,
        disableWrap: true,
        enable: feedConfig?.enable ?? true,
        slidingWindow: feedConfig?.slidingWindow ?? false,
        jobs:
          feedConfig?.jobs && feedConfig?.jobs.length > 0
            ? feedConfig?.jobs
            : [
                {
                  weight: 2,
                  data: OracleJob.encodeDelimited(
                    OracleJob.fromObject({
                      tasks: [
                        {
                          valueTask: {
                            value: 1,
                          },
                        },
                      ],
                    })
                  ).finish(),
                },
              ],
      }
    );

    aggregators.push(aggregatorAccount);
    txns.push(txn);
  }

  await queueAccount.program.signAndSendAll(
    TransactionObject.pack(txns.flat())
  );

  return aggregators;
}
