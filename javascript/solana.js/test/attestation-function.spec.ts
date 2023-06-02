import "mocha";

import * as sbv2 from "../src/index.js";
import { QuoteAccount } from "../src/index.js";

import { setupTest, TestContext } from "./utils.js";

import { Keypair } from "@solana/web3.js";
import { BN, sleep } from "@switchboard-xyz/common";
import assert from "assert";

describe("Function Tests", () => {
  let ctx: TestContext;

  let attestationQueueAccount: sbv2.AttestationQueueAccount;
  let attestationQuoteVerifierAccount: sbv2.QuoteAccount;
  const quoteVerifierKeypair = Keypair.generate();

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

    // join the queue so we can verify other quotes
    await attestationQuoteVerifierAccount.heartbeat({
      keypair: quoteVerifierKeypair,
    });
  });

  it("Creates a Function", async () => {
    const functionKeypair = Keypair.generate();

    [functionAccount] = await sbv2.FunctionAccount.create(ctx.program, {
      name: "FUNCTION_NAME",
      metadata: "FUNCTION_METADATA",
      schedule: "* * * * *",
      container: "containerId",
      version: "1.0.0",
      mrEnclave,
      attestationQueue: attestationQueueAccount,
      keypair: functionKeypair,
    });

    const myFunction = await functionAccount.loadData();
  });

  it("Verifies the function's quote", async () => {
    const [functionQuoteAccount] = functionAccount.getQuoteAccount();

    const initialQuoteState = await functionQuoteAccount.loadData();
    const initialVerificationStatus =
      QuoteAccount.getVerificationStatus(initialQuoteState);

    assert(
      initialVerificationStatus.kind === "None",
      `Quote account should not be verified yet`
    );

    await functionQuoteAccount.verify({
      timestamp: new BN(Math.floor(Date.now() / 1000)),
      mrEnclave: new Uint8Array(mrEnclave),
      verifierKeypair: quoteVerifierKeypair,
    });

    const finalQuoteState = await functionQuoteAccount.loadData();
    const finalVerificationStatus =
      QuoteAccount.getVerificationStatus(finalQuoteState);

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
      fundAmount: 0.25,
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

    await functionAccount.withdraw({
      amount: 0.1,
      unwrap: false,
      withdrawWallet: payerTokenWallet,
    });

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

  it("Withdraw all funds from the function", async () => {
    const initialBalance = await functionAccount.getBalance();
    assert(initialBalance > 0, "Function escrow should have some funds");

    const [payerTokenWallet] = await ctx.program.mint.getOrCreateWrappedUser(
      ctx.payer.publicKey,
      { fundUpTo: 0 }
    );

    await functionAccount.withdraw({
      amount: "all",
      unwrap: false,
      withdrawWallet: payerTokenWallet,
    });

    const finalBalance = await functionAccount.getBalance();
    const roundedFinalBalance = ctx.round(finalBalance, 4);
    assert(
      roundedFinalBalance === 0,
      `Function escrow should have minimal funds remaining`
    );
  });
});
