import * as anchor from "@project-serum/anchor";
import type NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import * as spl from "@solana/spl-token";
import {
  AccountInfo,
  Context,
  PublicKey,
  SystemProgram,
  SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
} from "@solana/web3.js";
import {
  promiseWithTimeout,
  SwitchboardTestContext,
} from "@switchboard-xyz/sbv2-utils";
import {
  Callback,
  PermissionAccount,
  ProgramStateAccount,
  SwitchboardPermission,
  VrfAccount,
} from "@switchboard-xyz/switchboard-v2";
import chai from "chai";
import "mocha";
import type { AnchorVrfParser } from "../../../target/types/anchor_vrf_parser";

const expect = chai.expect;

interface VrfClientState {
  bump: number;
  maxResult: anchor.BN;
  resultBuffer: number[];
  result: anchor.BN;
  lastTimestamp: anchor.BN;
  authority: PublicKey;
  vrf: PublicKey;
}

describe("anchor-vrf-parser test", async () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const vrfClientProgram = anchor.workspace
    .AnchorVrfParser as anchor.Program<AnchorVrfParser>;
  const provider = vrfClientProgram.provider as anchor.AnchorProvider;
  const payer = (provider.wallet as NodeWallet).payer;

  let switchboard: SwitchboardTestContext;

  const vrfSecret = anchor.web3.Keypair.generate();

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
    // First, attempt to load the switchboard devnet PID
    try {
      switchboard = await SwitchboardTestContext.loadDevnetQueue(provider);
      console.log("devnet detected");
      return;
    } catch (error: any) {
      console.log(`Error: SBV2 Devnet - ${error.message}`);
    }
    // If fails, fallback to looking for a local env file
    try {
      switchboard = await SwitchboardTestContext.loadFromEnv(provider);
      console.log("localnet detected");
      return;
    } catch (error: any) {
      console.log(`Error: SBV2 Localnet - ${error.message}`);
    }
    // If fails, throw error
    throw new Error(
      `Failed to load the SwitchboardTestContext from devnet or from a switchboard.env file`
    );
  });

  it("Creates a vrfClient account", async () => {
    const queue = switchboard.queue;
    const { unpermissionedVrfEnabled, authority, dataBuffer } =
      await queue.loadData();

    // Create Switchboard VRF and Permission account
    const vrfAccount = await VrfAccount.create(switchboard.program, {
      queue,
      callback: vrfClientCallback,
      authority: vrfClientKey, // vrf authority
      keypair: vrfSecret,
    });
    const { escrow } = await vrfAccount.loadData();
    console.log(`Created VRF Account: ${vrfAccount.publicKey}`);

    const permissionAccount = await PermissionAccount.create(
      switchboard.program,
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
      ProgramStateAccount.fromSeed(switchboard.program);
    const [permissionKey, permissionBump] = PermissionAccount.fromSeed(
      switchboard.program,
      authority,
      queue.publicKey,
      vrfAccount.publicKey
    );
    const switchboardMint = await programStateAccount.getTokenMint();
    const payerTokenAccount =
      await switchboardMint.getOrCreateAssociatedAccountInfo(payer.publicKey);

    // Request randomness
    console.log(`Sending RequestRandomness instruction`);
    const requestTxn = await vrfClientProgram.methods
      .requestResult({
        switchboardStateBump: programStateBump,
        permissionBump,
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
        escrow,
        payerWallet: payerTokenAccount.address,
        payerAuthority: payer.publicKey,
        recentBlockhashes: SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
        programState: programStateAccount.publicKey,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
      })
      .signers([payer, payer])
      .rpc();

    const vrfClientAccountCoder = new anchor.BorshAccountsCoder(
      vrfClientProgram.idl
    );

    // watch VrfClientState for a populated result
    let ws: number | undefined = undefined;
    const waitForResultPromise = new Promise(
      (
        resolve: (result: anchor.BN) => void,
        reject: (reason: string) => void
      ) => {
        try {
          ws = vrfClientProgram.provider.connection.onAccountChange(
            vrfClientKey,
            async (accountInfo: AccountInfo<Buffer>, context: Context) => {
              const clientState: VrfClientState = vrfClientAccountCoder.decode(
                "VrfClient",
                accountInfo.data
              );
              if (clientState.result.gt(new anchor.BN(0))) {
                resolve(clientState.result);
              }
            }
          );
        } catch (error: any) {
          reject(error);
        }
      }
    );

    let result: anchor.BN;
    try {
      result = await promiseWithTimeout(30_000, waitForResultPromise);
    } catch (error) {
      throw error;
    } finally {
      if (ws) {
        await vrfClientProgram.provider.connection.removeAccountChangeListener(
          ws
        );
      }
    }

    if (!result) {
      throw new Error(`failed to get a VRF result`);
    }

    console.log(`VrfClient Result: ${result}`);
  });
});
