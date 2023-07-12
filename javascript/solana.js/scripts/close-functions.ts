#!/usr/bin/env tsx

// import { SwitchboardAttestationProgram } from "../../../../switchboard-core/switchboard_v2/target/types/switchboard_attestation_program";
import * as sbv2 from "../src";

import * as anchor from "@coral-xyz/anchor";
import type { TransactionInstruction } from "@solana/web3.js";
import { Connection } from "@solana/web3.js";

const VERBOSE = process.env.VERBOSE || false;

const fnDiscriminator = Buffer.from([76, 139, 47, 44, 240, 182, 148, 200]);

const enclaveDiscriminator = Buffer.from([90, 162, 39, 88, 77, 157, 156, 165]);

type FunctionAccountWithState = {
  account: sbv2.FunctionAccount;
};

type EnclaveAccountWithState = {
  account: sbv2.VerifierAccount;
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

  const ixns: TransactionInstruction[] = [];

  for (const { pubkey, account } of attestationProgramAccounts) {
    const discriminator = account.data.slice(0, 8);
    if (Buffer.compare(discriminator, fnDiscriminator) === 0) {
      ixns.push(
        sbv2.attestationTypes.accountCloseOverride(program, {
          enclave: sbv2.SB_ATTESTATION_PID,
          function: pubkey,
          solDest: program.walletPubkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
      );
    }

    if (Buffer.compare(discriminator, enclaveDiscriminator) === 0) {
      ixns.push(
        sbv2.attestationTypes.accountCloseOverride(program, {
          enclave: pubkey,
          function: sbv2.SB_ATTESTATION_PID,
          solDest: program.walletPubkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
      );
    }
  }

  console.log(`Found ${ixns.length} accounts to close`);

  const txns = sbv2.TransactionObject.packIxns(program.walletPubkey, ixns);

  console.log(`Sending ${txns.length} transactions`);

  const signatures = await program.signAndSendAll(txns);
  console.log(signatures);
}

main().catch((error) => {
  console.error(error);
});
