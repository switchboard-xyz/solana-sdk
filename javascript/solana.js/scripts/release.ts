import * as sbv2 from '../src';
import { AggregatorAccount, TransactionObject } from '../src';

import { setupOutputDir } from './utils';

import * as anchor from '@coral-xyz/anchor';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { sleep } from '@switchboard-xyz/common';
// import { backOff } from 'exponential-backoff';
import fs from 'fs';
import _ from 'lodash';
import os from 'os';
import path from 'path';

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

  const devnetConnection = new Connection(
    process.env.SOLANA_DEVNET_RPC ?? clusterApiUrl('devnet')
  );
  console.log(`rpcUrl: ${devnetConnection.rpcEndpoint}`);

  const payer = sbv2.SwitchboardTestContextV2.loadKeypair(
    '~/switchboard_environments_v2/devnet/upgrade_authority/upgrade_authority.json'
  );
  console.log(`payer: ${payer.publicKey.toBase58()}`);

  const newProgram = await sbv2.SwitchboardProgram.load(
    'devnet',
    devnetConnection,
    payer,
    sbv2.SBV2_MAINNET_PID
  );

  const aggregatorMap = loadAggregatorMap();
  const reverseAggregatorMap = new Map(
    Array.from(aggregatorMap.entries()).map(r => [r[1], r[0]])
  );

  console.log(
    `Found ${aggregatorMap.size} aggregators that have already been migrated`
  );

  const oldAggregatorKeys = Array.from(aggregatorMap.keys()).map(
    a => new PublicKey(a)
  );

  const oldAggregators = await fetchAggregators(
    devnetConnection,
    oldAggregatorKeys,
    new PublicKey('2TfB33aLaneQb5TNVwyDz3jSZXS6jdW2ARw1Dgf84XCG')
  );

  console.log(`Loaded ${oldAggregators.size} old aggregators `);

  const newAggregatorKeys = Array.from(aggregatorMap.values()).map(
    a => new PublicKey(a)
  );

  const aggregators = await fetchAggregators(
    devnetConnection,
    newAggregatorKeys,
    sbv2.SBV2_MAINNET_PID,
    payer.publicKey
  );

  console.log(`Found ${aggregators.size} aggregators to release`);

  const txns: Array<TransactionObject> = [];
  for (const [aggregatorKey, aggregator] of aggregators.entries()) {
    const oldAggregatorKey = reverseAggregatorMap.get(aggregatorKey);
    if (!oldAggregatorKey) {
      console.log(
        `Old aggregator key not found for new aggregator ${aggregatorKey}`
      );
      continue;
    }
    const oldAggregator = oldAggregators.get(oldAggregatorKey);
    if (!oldAggregator) {
      console.log(`Failed to find old aggregator ${oldAggregatorKey}`);
      continue;
    }
    const aggregatorAccount = new AggregatorAccount(
      newProgram,
      new PublicKey(aggregatorKey)
    );
    if (aggregator.resolutionMode.kind === 'ModeRoundResolution') {
      txns.push(
        aggregatorAccount.setSlidingWindowInstruction(payer.publicKey, {
          authority: payer,
          mode: new sbv2.types.AggregatorResolutionMode.ModeSlidingResolution(),
        })
      );
    }

    txns.push(
      aggregatorAccount.setAuthorityInstruction(payer.publicKey, {
        newAuthority: oldAggregator.authority,
        authority: payer,
      })
    );
  }

  const packedTxns = TransactionObject.pack(txns);

  console.log(`Packed into ${packedTxns.length} txns`);

  const recentBlockhash = await devnetConnection.getLatestBlockhash();

  const signatures = await newProgram.signAndSendAll(
    packedTxns,
    {
      skipConfrimation: true,
      skipPreflight: true,
    },
    recentBlockhash
  );

  for (const signature of signatures) {
    console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  }

  await sleep(20000);

  const parsedTxns = await devnetConnection.getParsedTransactions(signatures);

  fs.writeFileSync(
    './set-authority-txns.json',
    JSON.stringify(packedTxns, undefined, 2)
  );
}

main().catch(error => {
  console.error(error);
});

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

async function fetchAggregators(
  connection: Connection,
  pubkeys: Array<PublicKey>,
  owner: PublicKey,
  authority?: PublicKey
): Promise<Map<string, sbv2.types.AggregatorAccountData>> {
  const aggregators = new Map<string, sbv2.types.AggregatorAccountData>();

  const batches = _.chunk(pubkeys, 100);
  for (const batch of batches) {
    const accountInfos = await anchor.utils.rpc.getMultipleAccounts(
      connection,
      batch
    );
    for (const account of accountInfos) {
      if (!account) {
        continue;
      }
      if (!account.account.owner.equals(owner)) {
        console.error(
          `Aggregator ${account.publicKey} belongs to wrong program, ${account.account.owner}`
        );
        continue;
      }
      try {
        const aggregator = sbv2.types.AggregatorAccountData.decode(
          account.account.data
        );
        if (!authority || aggregator.authority.equals(authority)) {
          aggregators.set(account.publicKey.toBase58(), aggregator);
        }
      } catch {}
    }
  }

  return aggregators;
}
