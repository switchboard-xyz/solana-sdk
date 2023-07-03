import "mocha";

import { functionVerify } from "../src/generated/index.js";
import * as sbv2 from "../src/index.js";
import { AttestationQueueAccount, EnclaveAccount } from "../src/index.js";

import { printLogs, setupTest, TestContext } from "./utils.js";

import * as anchor from "@coral-xyz/anchor";
import { NATIVE_MINT } from "@solana/spl-token";
import { Keypair, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { BN, sleep, toUtf8 } from "@switchboard-xyz/common";
import assert from "assert";

const unixTimestamp = () => Math.floor(Date.now() / 1000);

describe("Function Tests", () => {
  let ctx: TestContext;

  let attestationQueueAccount: AttestationQueueAccount;
  let attestationQuoteVerifierAccount: EnclaveAccount;
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
      await attestationQueueAccount.createQuote({
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
      quoteData1.enclaveSigner.equals(quoteVerifierSigner.publicKey),
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
    // const authorityKeypair = Keypair.generate();

    // console.log(`authorityKeypair: ${authorityKeypair.publicKey}`);

    try {
      [functionAccount] = await sbv2.FunctionAccount.create(
        ctx.program,
        {
          name: "FUNCTION_NAME",
          metadata: "FUNCTION_METADATA",
          schedule: "* * * * *",
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

  it("Verifies the function's quote", async () => {
    const functionQuoteAccount = functionAccount.getEnclaveAccount();

    const initialQuoteState = await functionQuoteAccount.loadData();
    const initialVerificationStatus =
      EnclaveAccount.getVerificationStatus(initialQuoteState);

    assert(
      initialVerificationStatus.kind === "None",
      `Quote account should not be verified yet`
    );

    await functionQuoteAccount.verify({
      timestamp: new BN(Math.floor(Date.now() / 1000)),
      mrEnclave: new Uint8Array(mrEnclave),
      verifierSecuredSigner: quoteVerifierSigner,
      verifier: attestationQuoteVerifierAccount.publicKey,
    });

    const finalQuoteState = await functionQuoteAccount.loadData();
    const finalVerificationStatus =
      EnclaveAccount.getVerificationStatus(finalQuoteState);

    assert(
      finalVerificationStatus.kind === "VerificationSuccess",
      `Quote account should be verified`
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
    const fnQuoteAccount = functionAccount.getEnclaveAccount();

    const trustedSigner = anchor.web3.Keypair.generate();

    const [receiver] = await ctx.program.mint.getOrCreateWrappedUser(
      ctx.payer.publicKey,
      { fundUpTo: 0 }
    );

    const timestamp = unixTimestamp();

    const nextAllowedTimestamp = timestamp + 100;

    const txnSignature = await functionAccount.verify(
      {
        observedTime: new BN(timestamp),
        nextAllowedTimestamp: new BN(nextAllowedTimestamp),
        isFailure: false,
        mrEnclave: new Uint8Array(mrEnclave),
        verifier: attestationQuoteVerifierAccount,
        verifierEnclaveSigner: quoteVerifierSigner.publicKey,
        functionEnclaveSigner: trustedSigner.publicKey,
        receiver,
      },
      {
        quoteVerifier: quoteVerifierSigner,
        fnEnclaveSigner: trustedSigner,
      }
    );

    console.log(`functionVerify: ${txnSignature}`);

    // await printLogs(ctx.program.connection, txnSignature, true);

    const functionState = await functionAccount.loadData();
    const quoteState = await fnQuoteAccount.loadData();

    assert(
      quoteState.enclaveSigner.equals(trustedSigner.publicKey),
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
    const newContainerRegistry = "updated_container_registry.com";

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
});
