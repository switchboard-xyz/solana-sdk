import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import {
  Keypair,
  SystemProgram,
  SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
} from "@solana/web3.js";
import {
  OracleAccount,
  PermissionAccount,
  ProgramStateAccount,
  SwitchboardPermission,
  SwitchboardTestContext,
  VrfAccount,
} from "@switchboard-xyz/switchboard-v2";
import chai from "chai";
import "mocha";
import path from "path";
import { getVrfClientCallback, getVrfClientFromSeed } from "../src/api";
import { VrfClient } from "../src/generated";
import type { AnchorVrfParser } from "../target/types/anchor_vrf_parser";
import { promiseWithTimeout } from "./test-utils";
const expect = chai.expect;

describe("vrfClient test", async () => {
  anchor.setProvider(anchor.Provider.env());

  const vrfClientProgram = anchor.workspace
    .AnchorVrfParser as anchor.Program<AnchorVrfParser>;

  const payer = Keypair.fromSecretKey(
    (vrfClientProgram.provider.wallet as anchor.Wallet).payer.secretKey
  );

  let switchboard: SwitchboardTestContext;

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

  before(async () => {
    // TODO: Add try catch block to check devnet environment accounts
    switchboard = await SwitchboardTestContext.loadFromEnv(
      vrfClientProgram.provider,
      path.join(process.cwd(), "./switchboard.env")
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
    const requestTxn = await vrfClientProgram.rpc.requestResult(
      {
        switchboardStateBump: programStateBump,
        permissionBump,
      },
      {
        accounts: {
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
        },
        signers: [payer, payer],
      }
    );

    const vrfClientAccountDecoder = new anchor.BorshAccountsCoder(
      vrfClientProgram.idl
    );

    let ws: number;

    const waitToCrankPromise = new Promise(
      (resolve: (result: string[]) => void) => {
        ws = switchboard.program.addEventListener(
          "VrfProveEvent",
          async (event: any, slot: number) => {
            console.log("VrfProveEvent invoked");
            if (!vrfSecret.publicKey.equals(event.vrfPubkey)) {
              console.log(`not the same vrfKey`);
              return;
            }

            const vrf = await vrfAccount.loadData();
            const round = vrf.builders[0];
            // console.log(
            //   JSON.stringify(
            //     round,
            //     (key, value) => {
            //       if (Array.isArray(value)) {
            //         return `[${value.map((el) => el.toString()).join(",")}]`;
            //       }
            //       return value;
            //     },
            //     2
            //   )
            // );
            if (round.status.statusVerifying) {
              console.log(`Ready to turn the crank`);
              const oracle = new OracleAccount({
                program: switchboard.program,
                publicKey: round.producer,
              });
              const txns = await vrfAccount.verify(oracle);
              resolve(txns);
            }
          }
        );
      }
    );

    // const resultPromise = new Promise(
    //   (resolve: (result: anchor.BN) => void) => {
    //     ws = vrfClientProgram.provider.connection.onAccountChange(
    //       vrfClientKey,
    //       (accountInfo) => {
    //         const accountData = vrfClientAccountDecoder.decode(
    //           "VrfClient",
    //           accountInfo.data
    //         );
    //         const result: anchor.BN = accountData.result;
    //         if (!result.eq(new anchor.BN(0))) {
    //           vrfClientProgram.provider.connection.removeAccountChangeListener(
    //             ws
    //           );
    //           resolve(accountData.result);
    //         }
    //       }
    //     );
    //   }
    // );

    const awaitResult = await promiseWithTimeout(
      20_000,
      waitToCrankPromise
    ).catch(() => {
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
