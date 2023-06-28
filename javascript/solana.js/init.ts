import * as sbv2 from "./src";

import { Connection } from "@solana/web3.js";

async function main() {
  const program = await sbv2.SwitchboardProgram.load(
    "devnet",
    new Connection(
      "https://switchbo-switchbo-6225.devnet.rpcpool.com/f6fb9f02-0777-498b-b8f5-67cbb1fc0d14"
    ),
    sbv2.loadKeypair(
      "~/switchboard_environments_v2/devnet/upgrade_authority/upgrade_authority.json"
    )
  );

  const [programState] = await sbv2.AttestationProgramStateAccount.getOrCreate(
    program
  );

  console.log(`Initialized: ${programState.publicKey.toBase58()}`);
}

main()
  .then(() => {
    // console.log("Executed successfully");
  })
  .catch((err) => {
    console.error(err);
  });
