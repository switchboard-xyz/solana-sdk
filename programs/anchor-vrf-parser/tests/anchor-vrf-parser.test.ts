import "mocha";

import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider } from "@coral-xyz/anchor";
import {
  SystemProgram,
  SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
} from "@solana/web3.js";

import { AnchorVrfParser, IDL } from "../target/types/anchor_vrf_parser";
import { VrfClient } from "../client/accounts";
import { PROGRAM_ID } from "../client/programId";
import {
  AnchorWallet,
  Callback,
  PermissionAccount,
  types,
} from "@switchboard-xyz/solana.js";
import { sleep } from "@switchboard-xyz/common";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Switchboard } from "./init";

describe("anchor-vrf-parser test", () => {
  const provider = AnchorProvider.env();
  anchor.setProvider(provider);

  // const vrfClientProgram = anchor.workspace
  //   .AnchorVrfParser as Program<AnchorVrfParser>;

  const vrfClientProgram = new anchor.Program(
    IDL,
    PROGRAM_ID,
    provider,
    new anchor.BorshCoder(IDL)
  ) as anchor.Program<AnchorVrfParser>;

  const payer = (provider.wallet as AnchorWallet).payer;

  let switchboard: Switchboard;

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

  before(async () => {
    switchboard = await Switchboard.load(provider);
  });

  it("Creates a vrfClient account", async () => {
    const queue = switchboard.queue.account;
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

    // Request randomness
    await vrfClientProgram.methods.requestResult!({
      switchboardStateBump: switchboard.program.programState.bump,
      permissionBump,
      // callback: vrf.callback,
    })
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

    const vrfClient = await VrfClient.fetch(
      vrfClientProgram.provider.connection,
      vrfClientKey
    );

    console.log(`VrfClient Result: ${vrfClient.result}`);

    return;
  });
});
