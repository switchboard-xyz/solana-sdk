import assert from "assert";
import "mocha";

import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider } from "@coral-xyz/anchor";
import {
  SystemProgram,
  SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
} from "@solana/web3.js";

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { sleep } from "@switchboard-xyz/common";
import {
  AnchorWallet,
  Callback,
  PermissionAccount,
  QueueAccount,
  SwitchboardProgram,
  SwitchboardTestContextV2,
  types,
} from "@switchboard-xyz/solana.js";

import { AnchorVrfParser } from "../target/types/anchor_vrf_parser";

describe("anchor-vrf-parser test", () => {
  const provider = AnchorProvider.env();
  anchor.setProvider(provider);

  const vrfClientProgram: anchor.Program<AnchorVrfParser> =
    anchor.workspace.AnchorVrfParser;

  const payer = (provider.wallet as AnchorWallet).payer;

  const vrfSecret = anchor.web3.Keypair.generate();
  console.log(`VRF Account: ${vrfSecret.publicKey}`);

  const [vrfClientKey, vrfClientBump] =
    anchor.utils.publicKey.findProgramAddressSync(
      [
        Buffer.from("STATE"),
        vrfSecret.publicKey.toBytes(),
        payer.publicKey.toBytes(),
      ],
      vrfClientProgram.programId
    );

  const vrfIxCoder = new anchor.BorshInstructionCoder(vrfClientProgram.idl);
  const vrfClientCallback: Callback = {
    programId: vrfClientProgram.programId,
    accounts: [
      // ensure all accounts in updateResult are populated
      { pubkey: vrfClientKey, isSigner: false, isWritable: true },
      { pubkey: vrfSecret.publicKey, isSigner: false, isWritable: false },
    ],
    ixData: vrfIxCoder.encode("updateResult", ""), // pass any params for instruction here
  };

  let switchboard: SwitchboardTestContextV2;
  let queueAccount: QueueAccount;
  let queue: types.OracleQueueAccountData;

  before(async () => {
    if (process.env.USE_SWITCHBOARD_DEVNET_QUEUE) {
      const switchboardProgram = await SwitchboardProgram.fromProvider(
        vrfClientProgram.provider as anchor.AnchorProvider
      );
      [queueAccount, queue] = await QueueAccount.load(
        switchboardProgram,
        "F8ce7MsckeZAbAGmxjJNetxYXQa9mKr9nnrC3qKubyYy"
      );
    } else {
      switchboard = await SwitchboardTestContextV2.loadFromProvider(provider, {
        // You can provide a keypair to so the PDA schemes dont change between test runs
        name: "Test Queue",
        keypair: SwitchboardTestContextV2.loadKeypair("~/.keypairs/queue.json"),
        queueSize: 10,
        reward: 0,
        minStake: 0,
        oracleTimeout: 900,
        unpermissionedFeeds: true,
        unpermissionedVrf: true,
        enableBufferRelayers: true,
        oracle: {
          name: "Test Oracle",
          enable: true,
          stakingWalletKeypair: SwitchboardTestContextV2.loadKeypair(
            "~/.keypairs/oracleWallet.json"
          ),
        },
      });
      queueAccount = switchboard.queue;
      queue = await queueAccount.loadData();
      await switchboard.start();
    }
  });

  after(() => {
    switchboard?.stop();
  });

  it("Creates a vrfClient account", async () => {
    const { unpermissionedVrfEnabled, authority, dataBuffer } = queue;

    // Create Switchboard VRF and Permission account
    const [vrfAccount] = await queueAccount.createVrf({
      callback: vrfClientCallback,
      authority: vrfClientKey, // vrf authority
      vrfKeypair: vrfSecret,
      enable: false,
    });

    console.log(`Created VRF Account: ${vrfAccount.publicKey}`);

    const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
      queueAccount.program,
      authority,
      queueAccount.publicKey,
      vrfAccount.publicKey
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
        queueAuthority: payer,
        permission: new types.SwitchboardPermission.PermitVrfRequests(),
        enable: true,
      });
      console.log(`Set VRF Permissions`);
    }

    // Create VRF Client account
    await vrfClientProgram.methods
      .initState({
        maxResult: new anchor.BN(1337000),
        permissionBump: permissionBump,
        switchboardStateBump: queueAccount.program.programState.bump,
      })
      .accounts({
        state: vrfClientKey,
        vrf: vrfAccount.publicKey,
        payer: payer.publicKey,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    console.log(`Created VrfClient Account: ${vrfClientKey}`);

    const [payerTokenWallet] =
      await queueAccount.program.mint.getOrCreateWrappedUser(
        queueAccount.program.walletPubkey,
        { fundUpTo: 0.002 }
      );

    const vrf = await vrfAccount.loadData();

    // give account time to propagate to oracle RPCs
    await sleep(2000);

    try {
      // Request randomness
      await vrfClientProgram.methods.requestResult!({})
        .accounts({
          state: vrfClientKey,
          authority: payer.publicKey,
          switchboardProgram: queueAccount.program.programId,
          vrf: vrfAccount.publicKey,
          oracleQueue: queueAccount.publicKey,
          queueAuthority: authority,
          dataBuffer,
          permission: permissionAccount.publicKey,
          escrow: vrf.escrow,
          payerWallet: payerTokenWallet,
          payerAuthority: payer.publicKey,
          recentBlockhashes: SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
          programState: queueAccount.program.programState.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      const result = await vrfAccount.nextResult(
        new anchor.BN(vrf.counter.toNumber() + 1),
        45_000
      );
      if (!result.success) {
        throw new Error(`Failed to get VRF Result: ${result.status}`);
      }

      const vrfClient = await vrfClientProgram.account.vrfClient.fetch(
        vrfClientKey
      );

      console.log(`VrfClient Result: ${vrfClient.result}`);
    } catch (error) {
      const callbackTxn = await vrfAccount.getCallbackTransactions();
      if (callbackTxn.length && callbackTxn[0].meta?.logMessages?.length) {
        console.log(
          JSON.stringify(callbackTxn[0].meta.logMessages, undefined, 2)
        );
      }

      throw error;
    }
  });

  it("Creates and closes a vrfClient account", async () => {
    // we create a new client & VRF because a VRF must wait at least 1500 slots
    // after a request before it can be closed
    const newVrfSecret = anchor.web3.Keypair.generate();

    const [newVrfClientKey, newVrfClientBump] =
      anchor.utils.publicKey.findProgramAddressSync(
        [
          Buffer.from("STATE"),
          newVrfSecret.publicKey.toBytes(),
          payer.publicKey.toBytes(),
        ],
        vrfClientProgram.programId
      );

    const vrfIxCoder = new anchor.BorshInstructionCoder(vrfClientProgram.idl);
    const vrfClientCallback: Callback = {
      programId: vrfClientProgram.programId,
      accounts: [
        // ensure all accounts in updateResult are populated
        { pubkey: newVrfClientKey, isSigner: false, isWritable: true },
        { pubkey: newVrfSecret.publicKey, isSigner: false, isWritable: false },
      ],
      ixData: vrfIxCoder.encode("updateResult", ""), // pass any params for instruction here
    };

    const { unpermissionedVrfEnabled, authority, dataBuffer } = queue;

    // Create Switchboard VRF and Permission account
    const [newVrfAccount] = await queueAccount.createVrf({
      callback: vrfClientCallback,
      authority: newVrfClientKey, // vrf authority
      vrfKeypair: newVrfSecret,
      enable: false,
    });

    console.log(`Created New VRF Account: ${newVrfAccount.publicKey}`);

    const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
      queueAccount.program,
      authority,
      queueAccount.publicKey,
      newVrfAccount.publicKey
    );

    console.log(
      `Created New Permission Account: ${permissionAccount.publicKey}`
    );

    // If queue requires permissions to use VRF, check the correct authority was provided
    if (!unpermissionedVrfEnabled) {
      if (!payer.publicKey.equals(authority)) {
        throw new Error(
          `queue requires PERMIT_VRF_REQUESTS and wrong queue authority provided`
        );
      }

      await permissionAccount.set({
        queueAuthority: payer,
        permission: new types.SwitchboardPermission.PermitVrfRequests(),
        enable: true,
      });
      console.log(`Set New VRF Permissions`);
    }

    // Create VRF Client account
    await vrfClientProgram.methods
      .initState({
        maxResult: new anchor.BN(1337000),
        permissionBump: permissionBump,
        switchboardStateBump: queueAccount.program.programState.bump,
      })
      .accounts({
        state: newVrfClientKey,
        vrf: newVrfAccount.publicKey,
        payer: payer.publicKey,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    console.log(`Created New VrfClient Account: ${newVrfClientKey}`);

    await sleep(5000);

    const newVrfClientState = await vrfClientProgram.account.vrfClient.fetch(
      newVrfClientKey
    );
    assert(
      newVrfClientState.vrf.equals(newVrfAccount.publicKey),
      `Vrf Client VRF account mismatch, expected ${newVrfAccount.publicKey}, received ${newVrfClientState.vrf}`
    );

    const newVrfInitialState = await newVrfAccount.loadData();

    // send any wrapped SOL to the payers associated wSOL wallet
    const [payerTokenAccount] =
      await queueAccount.program.mint.getOrCreateWrappedUser(payer.publicKey, {
        fundUpTo: 0,
      });

    // close the client and VRF account
    await vrfClientProgram.methods
      .closeState({})
      .accounts({
        state: newVrfClientKey,
        authority: payer.publicKey,
        payer: payer.publicKey,
        vrf: newVrfAccount.publicKey,
        escrow: newVrfInitialState.escrow,
        permission: permissionAccount.publicKey,
        oracleQueue: queueAccount.publicKey,
        queueAuthority: queue.authority,
        programState: queueAccount.program.programState.publicKey,
        solDest: payer.publicKey,
        escrowDest: payerTokenAccount,
        switchboardProgram: queueAccount.program.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    const vrfClientAccountInfo =
      await vrfClientProgram.provider.connection.getAccountInfo(
        newVrfClientKey,
        "processed"
      );
    assert(vrfClientAccountInfo === null, "VrfClientNotClosed");

    const vrfAccountInfo =
      await vrfClientProgram.provider.connection.getAccountInfo(
        newVrfAccount.publicKey,
        "processed"
      );
    assert(vrfAccountInfo === null, "VrfAccountNotClosed");
  });
});
