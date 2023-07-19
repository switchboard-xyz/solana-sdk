// eslint-disable-next-line node/no-unpublished-import
import type { CustomRandomnessRequest } from "../target/types/custom_randomness_request";

import { printLogs } from "./utils";

import type { Program } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import * as spl from "@solana/spl-token";
import type { Connection } from "@solana/web3.js";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { toUtf8 } from "@switchboard-xyz/common";
import type {
  FunctionAccount,
  SwitchboardWallet,
} from "@switchboard-xyz/solana.js";
import {
  attestationTypes,
  FunctionRequestAccount,
  TransactionObject,
} from "@switchboard-xyz/solana.js";
import {
  AttestationQueueAccount,
  type BootstrappedAttestationQueue,
  NativeMint,
  parseMrEnclave,
  SwitchboardProgram,
} from "@switchboard-xyz/solana.js";
import assert from "assert";

const MRENCLAVE = parseMrEnclave(
  Buffer.from("Y6keo0uTCiWDNcWwGjZ2jfTd4VFhrr6LC/6Mk1aiNCA=", "base64")
);
const emptyEnclave: number[] = new Array(32).fill(0);

describe("custom_randomness_request", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace
    .CustomRandomnessRequest as Program<CustomRandomnessRequest>;

  const payer = (program.provider as anchor.AnchorProvider).publicKey;
  const [housePubkey, houseBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("CUSTOMRANDOMNESS")],
    program.programId
  );
  const houseTokenWallet = anchor.utils.token.associatedAddress({
    mint: NativeMint.address,
    owner: housePubkey,
  });

  let switchboard: BootstrappedAttestationQueue;
  let functionAccount: FunctionAccount;
  let requestAccount: FunctionRequestAccount;
  let wallet: SwitchboardWallet;

  const [userPubkey, userBump] = PublicKey.findProgramAddressSync(
    [Buffer.from("CUSTOMRANDOMNESS"), payer.toBytes()],
    program.programId
  );
  const userTokenWallet = anchor.utils.token.associatedAddress({
    mint: NativeMint.address,
    owner: userPubkey,
  });

  before(async () => {
    const switchboardProgram = await SwitchboardProgram.fromProvider(
      program.provider as anchor.AnchorProvider
    );

    switchboard = await AttestationQueueAccount.bootstrapNewQueue(
      switchboardProgram
    );

    [functionAccount] =
      await switchboard.attestationQueue.account.createFunction({
        name: "test function",
        metadata: "this function handles XYZ for my protocol",
        schedule: "15 * * * * *",
        container: "switchboardlabs/basic-oracle-function",
        version: "latest",
        mrEnclave: MRENCLAVE,
        // authority: programStatePubkey,
      });
    wallet = await functionAccount.wallet;

    console.log(
      `state: ${switchboardProgram.attestationProgramState.publicKey}`
    );
    console.log(`attestationQueue: ${switchboard.attestationQueue.publicKey}`);
    console.log(`function: ${functionAccount.publicKey}`);
  });

  it("house_init", async () => {
    const preHouseState = await program.provider.connection.getAccountInfo(
      housePubkey
    );
    if (preHouseState === null || preHouseState.data.byteLength === 0) {
      const tx = await program.methods
        .houseInit(10)
        .accounts({
          house: housePubkey,
          authority: payer,
          function: functionAccount.publicKey,
          escrowWallet: wallet.publicKey,
          tokenWallet: wallet.tokenWallet,
          mint: switchboard.program.mint.address,
          houseTokenWallet: houseTokenWallet,
        })
        .rpc();
      console.log("house_init transaction signature", tx);
    }

    const houseState = await program.account.houseState.fetch(housePubkey);
    writeHouseState(housePubkey, houseState);

    assert(houseState.bump === houseBump, "HouseBumpMismatch");
    assert(houseState.authority.equals(payer), "HouseAuthorityMismatch");
    assert(
      houseState.function.equals(functionAccount.publicKey),
      "HouseFunctionMismatch"
    );
    assert(
      houseState.tokenWallet.equals(houseTokenWallet),
      "HouseTokenWalletMismatch"
    );
    assert(houseState.maxGuess === 10, "HouseMaxGuessMismatch");
  });

  it("user_init", async () => {
    // Add your test here.
    const tx = await program.methods
      .userInit()
      .accounts({
        house: housePubkey,
        houseTokenWallet: houseTokenWallet,
        user: userPubkey,
        userTokenWallet,
        mint: NativeMint.address,
      })
      .rpc();
    console.log("user_init transaction signature", tx);

    const userState = await program.account.userState.fetch(userPubkey);
    writeUserState(userPubkey, userState);

    assert(userState.bump === userBump, "UserBumpMismatch");
    assert(userState.authority.equals(payer), "UserAuthorityMismatch");
    assert(
      userState.tokenWallet.equals(userTokenWallet),
      "UserTokenWalletMismatch"
    );
  });

  it("funds house escrow", async () => {
    const initialBalance = await switchboard.program.mint.fetchBalance(
      houseTokenWallet
    );
    assert(initialBalance === 0, "Initial balance mismatch");

    const [payerTokenWallet] =
      await switchboard.program.mint.getOrCreateWrappedUser(payer, {
        fundUpTo: 2,
      });

    const tx = await spl.transfer(
      switchboard.program.connection,
      switchboard.program.wallet.payer,
      payerTokenWallet,
      houseTokenWallet,
      payer,
      switchboard.program.mint.toTokenAmount(2)
    );

    const finalBalance = await switchboard.program.mint.fetchBalance(
      houseTokenWallet
    );
    assert(finalBalance === 2, "Final balance mismatch");
  });

  it("user_guess", async () => {
    const requestKeypair = Keypair.generate();

    requestAccount = new FunctionRequestAccount(
      switchboard.program,
      requestKeypair.publicKey
    );

    // try {
    // Add your test here.
    const tx = await program.methods
      .userGuess(4, new anchor.BN(10000))
      .accounts({
        house: housePubkey,
        user: userPubkey,
        request: requestKeypair.publicKey,
        function: functionAccount.publicKey,
        requestEscrow: anchor.utils.token.associatedAddress({
          mint: NativeMint.address,
          owner: requestKeypair.publicKey,
        }),
        mint: NativeMint.address,
        state: switchboard.program.attestationProgramState.publicKey,
        attestationQueue: switchboard.attestationQueue.publicKey,
        switchboard: switchboard.program.attestationProgramId,
        userTokenWallet,
        houseTokenWallet,
      })
      .signers([requestKeypair])
      .rpc();

    console.log("user_guess transaction signature", tx);
    await printLogs(program.provider.connection, tx);
    // } catch (error) {
    //   await handleFailedTxnLogs(switchboard.program.connection, error);
    // }

    const userState = await program.account.userState.fetch(userPubkey);
    writeUserState(userPubkey, userState);

    assert(
      userState.currentRound.request.equals(requestKeypair.publicKey),
      "RequestPubkeyMismatch"
    );
    assert(userState.currentRound.guess === 4, "UserGuessMismatch");
    assert(
      userState.currentRound.wager.eq(new anchor.BN(10000)),
      "UserWagerMismatch"
    );
    assert(
      getStatus(userState.currentRound.status) === "pending",
      "UserStatusMismatch"
    );

    const requestState = await requestAccount.loadData();
    const expectedRequestParams = `PID=${
      program.programId
    },MAX_GUESS=${10},USER=${userPubkey}`;
    const requestParams = toUtf8(requestState.containerParams);

    assert(requestParams === expectedRequestParams, "Request params mismatch");
  });

  it("user_settle", async () => {
    const enclaveSigner = Keypair.generate();

    const requestState = await requestAccount.loadData();

    const receiver = await switchboard.program.mint.getOrCreateAssociatedUser(
      payer
    );

    const requestVerifyIxn = attestationTypes.functionRequestVerify(
      switchboard.program,
      {
        params: {
          observedTime: new anchor.BN(Math.floor(Date.now() / 1000)),
          mrEnclave: Array.from(MRENCLAVE),
          isFailure: false,
          requestSlot: requestState.activeRequest.requestSlot,
          containerParamsHash: requestState.containerParamsHash,
        },
      },
      {
        request: requestAccount.publicKey,
        function: functionAccount.publicKey,
        functionEnclaveSigner: enclaveSigner.publicKey,
        verifierQuote: switchboard.verifier.publicKey,
        verifierEnclaveSigner: switchboard.verifier.signer.publicKey,
        attestationQueue: switchboard.attestationQueue.publicKey,
        verifierPermission: switchboard.verifier.permissionAccount.publicKey,
        state: switchboard.program.attestationProgramState.publicKey,
        escrow: requestAccount.getEscrow(),
        functionEscrow: wallet.tokenWallet,
        receiver,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      }
    );

    try {
      const tx = await program.methods
        .userSettle(4)
        .accounts({
          house: housePubkey,
          user: userPubkey,
          request: requestAccount.publicKey,
          function: functionAccount.publicKey,
          enclaveSigner: enclaveSigner.publicKey,
          houseTokenWallet,
          userTokenWallet,
          mint: NativeMint.address,
        })
        .preInstructions([requestVerifyIxn])
        .signers([switchboard.verifier.signer, enclaveSigner])
        .rpc();

      console.log("user_guess transaction signature", tx);
      await printLogs(program.provider.connection, tx);
    } catch (error) {
      console.error(error);
      await handleFailedTxnLogs(switchboard.program.connection, error);
    }

    const userState = await program.account.userState.fetch(userPubkey);
    writeUserState(userPubkey, userState);

    assert(userState.currentRound.result === 4, "UserResultMismatch");

    const status = getStatus(userState.currentRound.status);
    assert(status === "settled", "UserStatusMismatch");
  });
});

function writeHouseState(pubkey: PublicKey, houseState: any) {
  console.log(`## House ${pubkey}`);
  console.log(`\tbump: ${houseState.bump}`);
  console.log(`\tmaxGuess: ${houseState.maxGuess}`);
  console.log(`\tauthority: ${houseState.authority}`);
  console.log(`\tfunction: ${houseState.function}`);
  console.log(`\ttokenWallet: ${houseState.tokenWallet}`);
}

function writeUserState(pubkey: PublicKey, userState: any) {
  console.log(`## User ${pubkey}`);
  console.log(`\tbump: ${userState.bump}`);
  console.log(`\tauthority: ${userState.authority}`);
  console.log(`\ttokenWallet: ${userState.tokenWallet}`);
  console.log(`\tcurrentRound`);
  // console.log(`== Current Round ==`);
  writeUserRound(userState.currentRound);
  console.log(`\tlastRound`);
  // console.log(`== Last Round ==`);
  writeUserRound(userState.lastRound);
}

function getStatus(status: Record<string, any>): string {
  return Object.keys(status)[0];
}

function writeUserRound(round: any) {
  console.log(`\t\trequest: ${round.request}`);
  console.log(`\t\tguess: ${round.guess}`);
  console.log(`\t\tstatus: ${getStatus(round.status)}`);
  console.log(`\t\tresult: ${round.result}`);
  console.log(`\t\tslot: ${(round.slot as anchor.BN).toNumber()}`);
  console.log(`\t\ttimestamp: ${(round.timestamp as anchor.BN).toNumber()}`);
  console.log(`\t\twager: ${(round.wager as anchor.BN).toNumber()}`);
}

async function handleFailedTxnLogs(connection: Connection, error: unknown) {
  const errorString = `${error}`;
  const regex = /Raw transaction (\S+)/;
  const match = errorString.match(regex);
  const base58String = match ? match[1] : null;
  if (base58String) {
    console.log(base58String);
    await printLogs(connection, base58String);
  } else {
    console.log(`Failed to extract txn sig from: ${errorString}`);
  }

  throw error;
}
