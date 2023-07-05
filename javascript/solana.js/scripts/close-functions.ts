#!/usr/bin/env tsx

// import { SwitchboardAttestationProgram } from "../../../../switchboard-core/switchboard_v2/target/types/switchboard_attestation_program";
import * as sbv2 from "../src";
import { AggregatorAccount, CrankAccount, QueueAccount } from "../src";

import {
  Aggregator,
  CHECK_ICON,
  FAILED_ICON,
  IAggregatorDefinition,
  jsonReplacers,
  PLUS_ICON,
  setupOutputDir,
} from "./utils.js";

import * as anchor from "@coral-xyz/anchor";
import { Connection, TransactionInstruction } from "@solana/web3.js";

const VERBOSE = process.env.VERBOSE || false;

const fnDiscriminator = Buffer.from([76, 139, 47, 44, 240, 182, 148, 200]);

const enclaveDiscriminator = Buffer.from([90, 162, 39, 88, 77, 157, 156, 165]);

type FunctionAccountWithState = {
  account: sbv2.FunctionAccount;
  // state: sbv2.attestationTypes.FunctionAccountData;
};

async function main() {
  const program = await sbv2.SwitchboardProgram.load(
    "devnet",
    new Connection(
      "https://switchbo-switchbo-6225.devnet.rpcpool.com/f6fb9f02-0777-498b-b8f5-67cbb1fc0d14"
    ),
    sbv2.loadKeypair("~/.config/solana/id.json")
  );

  const attestationProgramAccounts =
    await program.connection.getProgramAccounts(sbv2.SB_ATTESTATION_PID);

  const functionAccounts: FunctionAccountWithState[] = [];
  const ixns: TransactionInstruction[] = [];

  for (const { pubkey, account } of attestationProgramAccounts) {
    const discriminator = account.data.slice(0, 8);
    if (Buffer.compare(discriminator, enclaveDiscriminator) === 0) {
      functionAccounts.push({
        account: new sbv2.FunctionAccount(program, pubkey),
        // state: sbv2.attestationTypes.FunctionAccountData.decode(account.data),
      });

      ixns.push(
        sbv2.attestationTypes.functionOverrideClose(program, {
          function: pubkey,
          solDest: program.walletPubkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
      );
    }
  }

  for (const account of functionAccounts) {
    console.log(account.account.publicKey.toBase58());
  }

  console.log(`Found ${functionAccounts.length} enclaves`);

  const txns = sbv2.TransactionObject.packIxns(program.walletPubkey, ixns);

  console.log(`Sending ${txns.length} transactions`);

  const signatures = await program.signAndSendAll(txns);
  console.log(signatures);
}

main().catch((error) => {
  console.error(error);
});
