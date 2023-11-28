import "mocha";

import type { AttestationQueueAccount } from "../src/index.js";
import type { VerifierAccount } from "../src/index.js";
import * as sbv2 from "../src/index.js";

import type { TestContext } from "./utils.js";
import { printLogs, setupTest } from "./utils.js";

import * as anchor from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import { BN, sleep, toUtf8 } from "@switchboard-xyz/common";
import assert from "assert";

const unixTimestamp = () => Math.floor(Date.now() / 1000);

describe("Function Tests", () => {
  let ctx: TestContext;

  let attestationQueueAccount: AttestationQueueAccount;
  let attestationQuoteVerifierAccount: VerifierAccount;
  const quoteVerifierKeypair = Keypair.generate();
  const quoteVerifierSigner = Keypair.generate();

  const quoteVerifierMrEnclave = Array.from(
    Buffer.from("This is the quote verifier MrEnclave")
  )
    .concat(Array(32).fill(0))
    .slice(0, 32);

  let functionAccount: sbv2.FunctionAccount;

  const mrEnclave = Array.from(
    Buffer.from("This is the custom function MrEnclave")
  )
    .concat(Array(32).fill(0))
    .slice(0, 32);

  before(async () => {
    ctx = await setupTest();

    [attestationQueueAccount] = await sbv2.AttestationQueueAccount.create(
      ctx.program,
      {
        reward: 0,
        allowAuthorityOverrideAfter: 60, // should increase this
        maxQuoteVerificationAge: 604800,
        requireAuthorityHeartbeatPermission: false,
        requireUsagePermissions: false,
        nodeTimeout: 604800,
      }
    );

    const queueData = await attestationQueueAccount.loadData();
    assert(
      queueData.authority.equals(ctx.program.walletPubkey),
      "QueueAuthorityMismatch"
    );

    await attestationQueueAccount.addMrEnclave({
      mrEnclave: new Uint8Array(quoteVerifierMrEnclave),
    });

    [attestationQuoteVerifierAccount] =
      await attestationQueueAccount.createVerifier({
        registryKey: new Uint8Array(Array(64).fill(1)),
        keypair: quoteVerifierKeypair,
        enable: true,
        queueAuthorityPubkey: ctx.program.walletPubkey,
      });

    const quoteData = await attestationQuoteVerifierAccount.loadData();
    assert(
      quoteData.authority.equals(ctx.program.walletPubkey),
      "QuoteAuthorityMismatch"
    );

    await attestationQuoteVerifierAccount.rotate({
      enclaveSigner: quoteVerifierSigner,
      authority: ctx.payer,
      registryKey: new Uint8Array(Array(64).fill(1)),
    });

    const quoteData1 = await attestationQuoteVerifierAccount.loadData();
    assert(
      quoteData1.enclave.enclaveSigner.equals(quoteVerifierSigner.publicKey),
      "QuoteAuthorityMismatch"
    );
    assert(
      quoteData1.attestationQueue.equals(attestationQueueAccount.publicKey),
      "AttestationQueueMismatch"
    );

    // join the queue so we can verify other quotes
    await attestationQuoteVerifierAccount.heartbeat({
      enclaveSigner: quoteVerifierSigner,
    });
  });

  it("Creates a Function", async () => {
    try {
      [functionAccount] = await sbv2.FunctionAccount.create(
        ctx.program,
        {
          name: "FUNCTION_NAME",
          metadata: "FUNCTION_METADATA",
          container: "containerId",
          version: "1.0.0",
          mrEnclave,
          attestationQueue: attestationQueueAccount,
          // authority: authorityKeypair.publicKey,
        },
        undefined,
        { skipPreflight: true }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }

    const myFunction = await functionAccount.loadData();

    console.log(
      `function lookupTable: ${myFunction.addressLookupTable.toBase58()}`
    );

    await sleep(5000);

    const lookupTable = await ctx.program.connection
      .getAddressLookupTable(myFunction.addressLookupTable)
      .then((res) => res.value!);

    console.log(`Function: ${functionAccount.publicKey}`);
    console.log(`Sb State: ${ctx.program.attestationProgramState.publicKey}`);

    console.log(
      `Lookup Table\n${lookupTable.state.addresses
        .map((a) => "\t- " + a.toBase58())
        .join("\n")}`
    );
  });

  it("Fund the function", async () => {
    const initialBalance = await functionAccount.getBalance();
    assert(initialBalance === 0, "Function escrow should be unfunded");

    const [payerTokenWallet] = await ctx.program.mint.getOrCreateWrappedUser(
      ctx.payer.publicKey,
      { fundUpTo: 0.35 }
    );

    await functionAccount.fund({
      transferAmount: 0.25,
      funderTokenWallet: payerTokenWallet,
      funderAuthority: ctx.payer,
    });

    const finalBalance = await functionAccount.getBalance();
    assert(
      finalBalance === 0.25,
      `Function escrow should have 0.25 wSOL, escrow currently has ${finalBalance}`
    );
  });

  it("Withdraw from the function", async () => {
    const initialBalance = await functionAccount.getBalance();
    assert(
      initialBalance >= 0.1,
      "Function escrow should have at least 0.1 wSOL"
    );

    const [payerTokenWallet] = await ctx.program.mint.getOrCreateWrappedUser(
      ctx.payer.publicKey,
      { fundUpTo: 0 }
    );
    const initialPayerBalance = await ctx.program.mint.getAssociatedBalance(
      ctx.payer.publicKey
    );
    assert(
      initialPayerBalance !== null,
      "Payer token wallet should already be initialized"
    );

    await functionAccount.withdraw(0.1, payerTokenWallet);

    const finalBalance = await functionAccount.getBalance();
    assert(
      finalBalance === initialBalance - 0.1,
      `Function escrow should have 0.1 wSOL less than it started, expected ${
        initialBalance - 0.1
      }, found ${finalBalance}`
    );

    const finalPayerBalance = await ctx.program.mint.getAssociatedBalance(
      ctx.payer.publicKey
    );
    assert(
      finalPayerBalance === initialPayerBalance + 0.1,
      `Payer token wallet should have 0.1 wSOL more than it started, expected ${
        initialPayerBalance + 0.1
      }, found ${finalPayerBalance}`
    );
  });

  // it("Withdraw all funds from the function", async () => {
  //   const initialBalance = await functionAccount.getBalance();
  //   assert(initialBalance > 0, "Function escrow should have some funds");

  //   const [payerTokenWallet] = await ctx.program.mint.getOrCreateWrappedUser(
  //     ctx.payer.publicKey,
  //     { fundUpTo: 0 }
  //   );

  //   await functionAccount.withdraw({
  //     amount: "all",
  //     unwrap: false,
  //     withdrawWallet: payerTokenWallet,
  //   });

  //   const finalBalance = await functionAccount.getBalance();
  //   const roundedFinalBalance = ctx.round(finalBalance, 4);
  //   assert(
  //     roundedFinalBalance === 0,
  //     `Function escrow should have minimal funds remaining`
  //   );
  // });

  it("verifies the function", async () => {
    const trustedSigner = anchor.web3.Keypair.generate();

    const [receiver] = await ctx.program.mint.getOrCreateWrappedUser(
      ctx.payer.publicKey,
      { fundUpTo: 0 }
    );

    const timestamp = unixTimestamp();

    const nextAllowedTimestamp = timestamp + 1000;

    const txnSignature = await functionAccount.verify(
      {
        observedTime: new BN(timestamp),
        nextAllowedTimestamp: new BN(nextAllowedTimestamp),
        isFailure: false,
        mrEnclave: new Uint8Array(mrEnclave),
        verifier: attestationQuoteVerifierAccount,
        verifierEnclaveSigner: quoteVerifierSigner,
        functionEnclaveSigner: trustedSigner,
        receiver,
      },
      { skipPreflight: true }
    );

    // console.log(`functionVerify: ${txnSignature}`);

    // await printLogs(ctx.program.connection, txnSignature, true);

    await sleep(3000); // wait for rpc to catch up
    // await printLogs(functionAccount.program.connection, txnSignature, true);

    const functionState = await functionAccount.loadData();

    assert(
      functionState.enclave.verificationStatus ===
        sbv2.attestationTypes.VerificationStatus.VerificationSuccess
          .discriminator,
      "Function VerificationStatus mismatch"
    );

    assert(
      functionState.enclave.enclaveSigner.equals(trustedSigner.publicKey),
      "Function EnclaveSigner mismatch"
    );

    assert(
      functionState.nextAllowedTimestamp.toNumber() === nextAllowedTimestamp,
      "Next Allowed timestamp mismatch"
    );

    assert(functionState.status.kind === "Active", "Function status mismatch");
  });

  it("Sets a function config", async () => {
    const newName = "NEW_FUNCTION_NAME";
    const newMetadata = "NEW_FUNCTION_METADATA";
    const newContainer = "updatedContainerId";
    const newContainerRegistry = "dockerhub";

    await functionAccount.setConfig({
      name: newName,
      metadata: newMetadata,
      container: newContainer,
      containerRegistry: newContainerRegistry,
    });

    const myFunction = await functionAccount.loadData();

    const updatedName = toUtf8(myFunction.name);
    assert(
      updatedName === newName,
      `Function Name Mismatch: expected ${newName}, received ${updatedName}`
    );

    const updatedMetadata = toUtf8(myFunction.metadata);
    assert(
      updatedMetadata === newMetadata,
      `Function Metadata Mismatch: expected ${newMetadata}, received ${updatedMetadata}`
    );

    const updatedContainer = toUtf8(myFunction.container);
    assert(
      updatedContainer === newContainer,
      `Function Container Mismatch: expected ${newContainer}, received ${updatedContainer}`
    );

    const updatedContainerRegistry = toUtf8(myFunction.containerRegistry);
    assert(
      updatedContainerRegistry === newContainerRegistry,
      `Function Container Registry Mismatch: expected ${newContainerRegistry}, received ${updatedContainerRegistry}`
    );
  });

  it("Manually triggers a function", async () => {
    const preFunctionData = await functionAccount.loadData();

    assert(
      preFunctionData.isTriggered === 0,
      "Function should be originally untriggered"
    );

    await functionAccount.trigger();

    const postFunctionData = await functionAccount.loadData();
    assert(
      postFunctionData.isTriggered === 1,
      "Function should have been triggered"
    );
  });

  it("Transfers a function authority to a new keypair", async () => {
    const [myNewFunctionAccount] = await sbv2.FunctionAccount.create(
      ctx.program,
      {
        name: "FUNCTION_NAME",
        metadata: "FUNCTION_METADATA",
        container: "containerId",
        version: "1.0.0",
        mrEnclave,
        attestationQueue: attestationQueueAccount,
      },
      undefined,
      { skipPreflight: true }
    );
    const preFunctionData = await myNewFunctionAccount.loadData();
    const wallet = await myNewFunctionAccount.wallet;

    assert(
      preFunctionData.authority.equals(ctx.program.walletPubkey),
      "Function authority mismatch"
    );
    const newAuthority = Keypair.generate();

    const signature = await myNewFunctionAccount.setAuthority({
      newAuthority: newAuthority.publicKey,
    });

    await sleep(2000);

    const postFunctionData = await myNewFunctionAccount.loadData();
    const postWallet = await myNewFunctionAccount.wallet;

    assert(
      postFunctionData.authority.equals(newAuthority.publicKey),
      "Function authority mismatch"
    );
  });

  it("Tests functionVerify serialized size", async () => {
    const [myFunctionAccount] = await sbv2.FunctionAccount.create(
      ctx.program,
      {
        name: "FUNCTION_NAME",
        metadata: "FUNCTION_METADATA",
        container: "containerId",
        version: "1.0.0",
        mrEnclave,
        attestationQueue: attestationQueueAccount,
        // authority: authorityKeypair.publicKey,
      },
      undefined,
      { skipPreflight: true }
    );
    const attestationQueue = await attestationQueueAccount.loadData();
    const functionState = await myFunctionAccount.loadData();

    const escrowWallet = await myFunctionAccount.wallet;
    const trustedSigner = anchor.web3.Keypair.generate();

    const [receiver] = await ctx.program.mint.getOrCreateWrappedUser(
      ctx.payer.publicKey,
      { fundUpTo: 0 }
    );

    const timestamp = unixTimestamp();

    const nextAllowedTimestamp = timestamp + 1000;

    const getIxn = () => {
      return myFunctionAccount.verifyInstructionSync({
        observedTime: new BN(timestamp),
        nextAllowedTimestamp: new BN(nextAllowedTimestamp),
        isFailure: false,
        mrEnclave: new Uint8Array(mrEnclave),
        escrowWallet: escrowWallet.publicKey,
        functionEnclaveSigner: trustedSigner.publicKey,
        attestationQueue: attestationQueueAccount.publicKey,
        attestationQueueAuthority: attestationQueue.authority,

        quoteVerifier: attestationQuoteVerifierAccount.publicKey,
        quoteVerifierEnclaveSigner: quoteVerifierSigner.publicKey,

        receiver,
      });
    };

    // LEGACY
    const legacyTxn = new sbv2.TransactionObject(
      ctx.payer.publicKey,
      [getIxn()],
      [quoteVerifierSigner, trustedSigner]
    );
    const serializedLegacyTxn = legacyTxn
      .sign(await ctx.program.connection.getLatestBlockhash(), [
        quoteVerifierSigner,
        trustedSigner,
        ctx.payer,
      ])
      .serialize();
    console.log(
      `LEGACY: ${serializedLegacyTxn.byteLength} / 1232 (${
        1232 - serializedLegacyTxn.byteLength
      } bytes remaining)`
    );

    // V0
    const lookupTable = await ctx.program.connection
      .getAddressLookupTable(functionState.addressLookupTable)
      .then((res) => res.value!);

    const messageV0 = new anchor.web3.TransactionMessage({
      payerKey: ctx.program.walletPubkey,
      recentBlockhash: (await ctx.program.connection.getLatestBlockhash())
        .blockhash,
      instructions: [getIxn()], // note this is an array of instructions
    }).compileToV0Message([lookupTable]);
    const transactionV0 = new anchor.web3.VersionedTransaction(messageV0);
    transactionV0.sign([quoteVerifierSigner]);
    transactionV0.sign([trustedSigner]);
    transactionV0.sign([ctx.payer]);
    const serializedV0Txn = transactionV0.serialize();

    console.log(
      `V0 TXN: ${serializedV0Txn.byteLength} / 1232 (${
        1232 - serializedV0Txn.byteLength
      } bytes remaining)`
    );
  });
});
