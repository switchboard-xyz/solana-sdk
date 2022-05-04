import * as anchor from "@project-serum/anchor";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import * as spl from "@solana/spl-token";
import {
  PublicKey,
  SystemProgram,
  SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
} from "@solana/web3.js";
import {
  loadSwitchboardProgram,
  OracleQueueAccount,
  PermissionAccount,
  ProgramStateAccount,
  SwitchboardPermission,
  VrfAccount,
} from "@switchboard-xyz/switchboard-v2";
import chai from "chai";
import "mocha";
import { getVrfClientCallback, getVrfClientFromSeed } from "../src/api";
import { VrfClient } from "../src/generated";
import type { AnchorVrfParser } from "../target/types/anchor_vrf_parser";
import { promiseWithTimeout } from "./test-utils";
const expect = chai.expect;

describe("creates a vrf account on the devnet permissionless queue", async () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const vrfClientProgram = anchor.workspace
    .AnchorVrfParser as anchor.Program<AnchorVrfParser>;

  const payer = (
    (vrfClientProgram.provider as anchor.AnchorProvider).wallet as NodeWallet
  ).payer;

  const vrfSecret = anchor.web3.Keypair.generate();

  // create state account but dont send instruction
  // need public key for VRF CPI
  const [vrfClientKey, vrfClientBump] = getVrfClientFromSeed(
    vrfClientProgram as any,
    vrfSecret.publicKey,
    payer.publicKey // client state authority
  );

  const vrfClientCallback = getVrfClientCallback(
    vrfClientProgram as any,
    vrfClientKey,
    vrfSecret.publicKey
  );

  it("Creates a vrfClient account", async () => {
    let switchboardProgram: anchor.Program;
    try {
      switchboardProgram = await loadSwitchboardProgram(
        "devnet",
        vrfClientProgram.provider.connection,
        payer
      );
    } catch {
      console.log(`might not be connected to devnet - test exiting`);
      return;
    }

    // override queue
    const queue = new OracleQueueAccount({
      program: switchboardProgram,
      publicKey: new PublicKey("F8ce7MsckeZAbAGmxjJNetxYXQa9mKr9nnrC3qKubyYy"),
    });

    const { unpermissionedVrfEnabled, authority, dataBuffer } =
      await queue.loadData();

    // Create Switchboard VRF and Permission account
    const vrfAccount = await VrfAccount.create(switchboardProgram, {
      queue,
      callback: vrfClientCallback,
      authority: vrfClientKey, // vrf authority
      keypair: vrfSecret,
    });
    const { escrow } = await vrfAccount.loadData();
    console.log(`Created VRF Account: ${vrfAccount.publicKey}`);

    const permissionAccount = await PermissionAccount.create(
      switchboardProgram,
      {
        authority,
        granter: queue.publicKey,
        grantee: vrfAccount.publicKey,
      }
    );
    console.log(`Created Permission Account: ${permissionAccount.publicKey}`);

    // If queue requires permissions to use VRF, check the correct authority was provided
    if (!unpermissionedVrfEnabled) {
      if (!payer.publicKey.equals(authority)) {
        throw new Error(
          `queue requires PERMIT_VRF_REQUESTS and wrong queue authority provided`
        );
      }

      await permissionAccount.set({
        authority: payer,
        permission: SwitchboardPermission.PERMIT_VRF_REQUESTS,
        enable: true,
      });
      console.log(`Set VRF Permissions`);
    }

    // Create VRF Client account
    await vrfClientProgram.rpc.initState(
      {
        maxResult: new anchor.BN(1),
      },
      {
        accounts: {
          state: vrfClientKey,
          vrf: vrfAccount.publicKey,
          payer: payer.publicKey,
          authority: payer.publicKey,
          systemProgram: SystemProgram.programId,
        },
      }
    );
    console.log(`Created VrfClient Account: ${vrfClientKey}`);

    // Get required switchboard accounts
    const [programStateAccount, programStateBump] =
      ProgramStateAccount.fromSeed(switchboardProgram);
    const [permissionKey, permissionBump] = PermissionAccount.fromSeed(
      switchboardProgram,
      authority,
      queue.publicKey,
      vrfAccount.publicKey
    );
    const switchboardMint = await programStateAccount.getTokenMint();
    const payerTokenAccount =
      await switchboardMint.getOrCreateAssociatedAccountInfo(payer.publicKey);

    // Request randomness
    console.log(`Sending RequestRandomness instruction`);
    const requestTxn = await vrfClientProgram.rpc.requestResult(
      {
        switchboardStateBump: programStateBump,
        permissionBump,
      },
      {
        accounts: {
          state: vrfClientKey,
          authority: payer.publicKey,
          switchboardProgram: switchboardProgram.programId,
          vrf: vrfAccount.publicKey,
          oracleQueue: queue.publicKey,
          queueAuthority: authority,
          dataBuffer,
          permission: permissionAccount.publicKey,
          escrow,
          payerWallet: payerTokenAccount.address,
          payerAuthority: payer.publicKey,
          recentBlockhashes: SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
          programState: programStateAccount.publicKey,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
        },
        signers: [payer, payer],
      }
    );

    const vrfClientAccountDecoder = new anchor.BorshAccountsCoder(
      vrfClientProgram.idl
    );

    let ws: number;
    const waitForEventPromise = new Promise(
      (resolve: (result: anchor.BN) => void) => {
        ws = vrfClientProgram.addEventListener(
          "VrfClientResultUpdated",
          async (event: any, slot: number) => {
            console.log("VrfClientResultUpdated invoked");
            resolve(event.result as anchor.BN);
          }
        );
      }
    );

    const awaitResult = await promiseWithTimeout(
      30_000,
      waitForEventPromise
    ).finally(() => {
      try {
        vrfClientProgram.provider.connection.removeAccountChangeListener(ws);
      } catch {}
    });
    if (!awaitResult) {
      throw new Error(`failed to get a VRF result`);
    }

    console.log(JSON.stringify(awaitResult, undefined, 2));

    const vrfClient = await VrfClient.fromAccountAddress(
      vrfClientProgram.provider.connection,
      vrfClientKey
    );

    console.log(`VrfClient Result: ${vrfClient.result}`);
  });
});
