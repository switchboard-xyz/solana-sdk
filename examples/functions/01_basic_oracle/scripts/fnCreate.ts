import type { BasicOracle } from "../target/types/basic_oracle";

import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import * as sb from "@switchboard-xyz/solana.js";

const rpcUrl =
  "https://api.devnet.solana.com";
const kp = sb.loadKeypair(
  "~/switchboard_environments_v2/devnet/upgrade_authority/upgrade_authority.json"
);
const DEFAULT_DEVNET_QUEUE = "CkvizjVnm2zA5Wuwan34NhVT3zFc7vqUyGnA6tuEF5aE";
const DEFAULT_MAINNET_QUEUE = "2ie3JZfKcvsRLsJaP5fSo43gUo1vsurnUAtAgUdUAiDG";

async function main() {
  const con = new Connection(rpcUrl);
  const switchboardProgram = await sb.SwitchboardProgram.load(
    "mainnet-beta",
    con,
    kp
  );
  const attestationProgram = await sb.SwitchboardProgram.loadAnchorProgram(
    "mainnet-beta",
    con,
    kp,
    switchboardProgram.attestationProgramId
  );

  console.log(`ProgramID: ${switchboardProgram}`);

  const recentSlot = (
    await con.getLatestBlockhashAndContext({
      commitment: "finalized",
    })
  ).context.slot;
  console.log(recentSlot);
  const [fn, tx] = await sb.FunctionAccount.create(switchboardProgram, {
    container: "t1",
    recentSlot: recentSlot,
    attestationQueue: new sb.AttestationQueueAccount(
      switchboardProgram,
      new PublicKey(DEFAULT_DEVNET_QUEUE)
    ),
    mrEnclave: Buffer.from(
      "63ba8df478b4a74795a79a73b8f0a6f792f88e95f9ed6202289091e6e1b65fa1",
      "hex"
    ),
    requestsDisabled: false,
    requestsRequireAuthorization: false,
    requestsDefaultSlotsUntilExpiration: new anchor.BN("0"),
    requestsFee: 0,
  });

  // console.log("Your transaction signature", tx);

  console.log("Your transaction signature", tx);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
