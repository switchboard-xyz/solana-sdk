import * as sbv2 from "./src";
import { TransactionObject } from "./src";
import { CHECK_ICON, FAILED_ICON } from "./utils";

import type { AccountMeta } from "@solana/web3.js";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
// import { backOff } from 'exponential-backoff';
import _ from "lodash";

const VERBOSE = process.env.VERBOSE || false;

const BATCH_SIZE = 20;

async function main() {
  const devnetConnection = new Connection(
    process.env.SOLANA_DEVNET_RPC ?? clusterApiUrl("devnet")
  );
  console.log(`rpcUrl: ${devnetConnection.rpcEndpoint}`);

  const payer = sbv2.SwitchboardTestContextV2.loadKeypair(
    "~/.config/solana/id.json"
  );
  console.log(`payer: ${payer.publicKey.toBase58()}`);

  const oldProgram = await sbv2.SwitchboardProgram.load(
    "devnet",
    devnetConnection,
    payer,
    new PublicKey("2TfB33aLaneQb5TNVwyDz3jSZXS6jdW2ARw1Dgf84XCG")
  );

  const programAccounts = await oldProgram.getProgramAccounts();
  const remainingAccounts: Array<AccountMeta> = [];

  for (const [accountKey, accountData] of Array.from(
    programAccounts.permissions.entries()
  )) {
    if (accountData.bump === 0) {
      remainingAccounts.push({
        pubkey: new PublicKey(accountKey),
        isSigner: false,
        isWritable: true,
      });
    }
  }

  for (const [accountKey, accountData] of Array.from(
    programAccounts.leases.entries()
  )) {
    if (accountData.bump === 0) {
      remainingAccounts.push({
        pubkey: new PublicKey(accountKey),
        isSigner: false,
        isWritable: true,
      });
    }
  }

  for (const [accountKey, accountData] of Array.from(
    programAccounts.oracles.entries()
  )) {
    if (accountData.bump === 0) {
      remainingAccounts.push({
        pubkey: new PublicKey(accountKey),
        isSigner: false,
        isWritable: true,
      });
    }
  }

  if (remainingAccounts.length === 0) {
    console.log(`${CHECK_ICON} ALL BUMPS SET`);
  }

  const batches = _.chunk(remainingAccounts, BATCH_SIZE);

  console.log(`Found ${remainingAccounts.length} bumps to set`);
  console.log(`Num Batches: ${batches.length}`);

  for (const batch of batches) {
    try {
      const setBumpsIxn = sbv2.types.setBumps(
        oldProgram,
        {
          params: {
            stateBump: oldProgram.programState.bump,
          },
        },
        {
          state: oldProgram.programState.publicKey,
        }
      );
      setBumpsIxn.keys.push(...batch);

      const setBumpsTxn = new TransactionObject(
        oldProgram.walletPubkey,
        [setBumpsIxn],
        [],
        undefined
      );

      const setBumpsSignature = await oldProgram.signAndSend(setBumpsTxn, {
        skipConfrimation: true,
      });
      console.log(`${CHECK_ICON} ${setBumpsSignature}`);
    } catch (error) {
      console.log(`${FAILED_ICON} failed to send batch, ${error}`);
      for (const key of batch) {
        console.log(`\t - ${key.pubkey.toBase58()}`);
      }
    }
  }

  //   const [aggregatorAccount, aggregator] = await AggregatorAccount.load(
  //     oldProgram,
  //     '3pGhzWwW9AjnF2iRuRWvK2dQAt6YKLP4UJsibYBpozYS'
  //   );

  //   console.log(
  //     `${'AggregatorAccount'.padEnd(20, ' ')}: ${aggregatorAccount.publicKey}`
  //   );

  //   const [queueAccount, queue] = await QueueAccount.load(
  //     oldProgram,
  //     aggregator.queuePubkey
  //   );
  //   const accounts = aggregatorAccount.getAccounts(queueAccount, queue.authority);

  //   const initialPermissions = await accounts.permissionAccount.loadData();
  //   const initialLease = await accounts.leaseAccount.loadData();
  //   console.log(
  //     `${'PermissionAccount'.padEnd(20, ' ')}: ${
  //       accounts.permissionAccount.publicKey
  //     } (${initialPermissions.bump} => ${accounts.permissionBump})`
  //   );
  //   console.log(
  //     `${'LeaseAccount'.padEnd(20, ' ')}: ${
  //       accounts.permissionAccount.publicKey
  //     } (${initialLease.bump} => ${accounts.leaseBump})`
  //   );

  //   const setBumpsIxn = sbv2.types.setBumps(
  //     oldProgram,
  //     {
  //       params: {
  //         stateBump: oldProgram.programState.bump,
  //       },
  //     },
  //     {
  //       state: oldProgram.programState.publicKey,
  //     }
  //   );

  //   setBumpsIxn.keys.push({
  //     pubkey: accounts.permissionAccount.publicKey,
  //     isSigner: false,
  //     isWritable: true,
  //   });
  //   setBumpsIxn.keys.push({
  //     pubkey: accounts.leaseAccount.publicKey,
  //     isSigner: false,
  //     isWritable: true,
  //   });

  //   const setBumpsTxn = new TransactionObject(
  //     oldProgram.walletPubkey,
  //     [setBumpsIxn],
  //     [],
  //     undefined
  //   );

  //   const setBumpsSignature = await oldProgram.signAndSend(setBumpsTxn);
  //   console.log(`txnSignature: ${setBumpsSignature}`);

  //   await sleep(2000);

  //   const finalPermissionsAccountInfo =
  //     await oldProgram.connection.getAccountInfo(
  //       accounts.permissionAccount.publicKey,
  //       'processed'
  //     );
  //   const finalPermissions = sbv2.types.PermissionAccountData.decode(
  //     finalPermissionsAccountInfo!.data
  //   );
  //   const finalLeaseAccountInfo = await oldProgram.connection.getAccountInfo(
  //     accounts.leaseAccount.publicKey,
  //     'processed'
  //   );
  //   const finalLease = sbv2.types.LeaseAccountData.decode(
  //     finalLeaseAccountInfo!.data
  //   );

  //   const parsedTxnLogs =
  //     await queueAccount.program.connection.getParsedTransaction(
  //       setBumpsSignature,
  //       { commitment: 'confirmed' }
  //     );
  //   console.log(JSON.stringify(parsedTxnLogs?.meta?.logMessages, undefined, 2));

  //   assert(
  //     finalPermissions.bump === accounts.permissionBump,
  //     `PermissionAccount bump mismatch, expected ${accounts.permissionBump}, received ${finalPermissions.bump}`
  //   );
  //   assert(
  //     finalLease.bump === accounts.leaseBump,
  //     `LeaseAccount bump mismatch, expected ${accounts.leaseBump}, received ${finalLease.bump}`
  //   );
}

main().catch((error) => {
  console.error(error);
});
