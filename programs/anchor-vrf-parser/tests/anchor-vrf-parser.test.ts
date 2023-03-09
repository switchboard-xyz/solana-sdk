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

  before(async () => {
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
    await switchboard.start();
  });

  after(async () => {
    if (switchboard) {
      switchboard.stop();
    }
  });

  it("Creates a vrfClient account", async () => {
    const queue = switchboard.queue;
    const { unpermissionedVrfEnabled, authority, dataBuffer } =
      await queue.loadData();

    // Create Switchboard VRF and Permission account
    const [vrfAccount] = await queue.createVrf({
      callback: vrfClientCallback,
      authority: vrfClientKey, // vrf authority
      vrfKeypair: vrfSecret,
      enable: false,
    });

    console.log(`Created VRF Account: ${vrfAccount.publicKey}`);

    const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
      queue.program,
      authority,
      queue.publicKey,
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
        switchboardStateBump: switchboard.program.programState.bump,
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
      await switchboard.program.mint.getOrCreateWrappedUser(
        switchboard.program.walletPubkey,
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
          switchboardProgram: switchboard.program.programId,
          vrf: vrfAccount.publicKey,
          oracleQueue: queue.publicKey,
          queueAuthority: authority,
          dataBuffer,
          permission: permissionAccount.publicKey,
          escrow: vrf.escrow,
          payerWallet: payerTokenWallet,
          payerAuthority: payer.publicKey,
          recentBlockhashes: SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
          programState: switchboard.program.programState.publicKey,
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
      console.log(await vrfAccount.getCallbackTransactions());
      throw error;
    }
  });
});
