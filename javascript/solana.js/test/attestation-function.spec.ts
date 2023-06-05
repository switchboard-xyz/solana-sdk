import "mocha";

import { functionVerify } from "../src/generated/index.js";
import * as sbv2 from "../src/index.js";
import { QuoteAccount } from "../src/index.js";

import { setupTest, TestContext } from "./utils.js";

import * as anchor from "@coral-xyz/anchor";
import { NATIVE_MINT } from "@solana/spl-token";
import { Keypair, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { BN, sleep } from "@switchboard-xyz/common";
import assert from "assert";

const unixTimestamp = () => Math.floor(Date.now() / 1000);

describe("Function Tests", () => {
  let ctx: TestContext;

  let attestationQueueAccount: sbv2.AttestationQueueAccount;
  let attestationQuoteVerifierAccount: sbv2.QuoteAccount;
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

    await attestationQuoteVerifierAccount.rotate({
      securedSigner: quoteVerifierSigner,
      registryKey: new Uint8Array(Array(64).fill(1)),
    });

    // join the queue so we can verify other quotes
    await attestationQuoteVerifierAccount.heartbeat({
      keypair: quoteVerifierKeypair,
    });
  });

  it("Creates a Function", async () => {
    const functionKeypair = Keypair.generate();

    try {
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

  it("verifies the function", async () => {
    const trustedSigner = anchor.web3.Keypair.generate();

    const myFunction = await functionAccount.loadData();

    const lookupTable = await ctx.program.connection
      .getAddressLookupTable(myFunction.addressLookupTable)
      .then((res) => res.value!);

    const {
      statePubkey,
      attestationQueuePubkey,
      functionPubkey,
      escrowPubkey,
      fnPermission,
      fnQuote,
    } = sbv2.FunctionAccount.decodeAddressLookup(lookupTable);

    const getIxn = (): TransactionInstruction => {
      return functionVerify(
        ctx.program,
        {
          params: {
            observedTime: new BN(unixTimestamp()),
            nextAllowedTimestamp: new BN(unixTimestamp() + 100),
            isFailure: false,
            mrEnclave: Array.from(mrEnclave),
          },
        },
        {
          function: functionAccount.publicKey,
          fnSigner: trustedSigner.publicKey,
          securedSigner: PublicKey.default, // TODO: update with correct account
          verifierQuote: attestationQuoteVerifierAccount.publicKey,
          attestationQueue: attestationQueuePubkey,
          escrow: escrowPubkey,
          receiver: anchor.utils.token.associatedAddress({
            mint: NATIVE_MINT,
            owner: ctx.payer.publicKey,
          }),
          verifierPermission:
            attestationQuoteVerifierAccount.getPermissionAccount(
              attestationQueuePubkey,
              ctx.payer.publicKey,
              ctx.payer.publicKey
            )[0].publicKey,
          fnPermission: fnPermission,
          state: statePubkey,
          payer: ctx.payer.publicKey,
          fnQuote: fnQuote,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        }
      );
    };

    const blockhash = await ctx.program.connection.getLatestBlockhash();

    // legacy
    const transactionLegacy = new sbv2.TransactionObject(
      ctx.payer.publicKey,
      [getIxn()],
      [quoteVerifierKeypair, trustedSigner]
    ).toVersionedTxn(blockhash);
    const legacyByteLength = transactionLegacy.serialize().byteLength;
    console.log(`functionVerify (legacy): ${legacyByteLength}`);

    // build txn
    const messageV0 = new anchor.web3.TransactionMessage({
      payerKey: ctx.payer.publicKey,
      recentBlockhash: blockhash.blockhash,
      instructions: [getIxn()], // note this is an array of instructions
    }).compileToV0Message([lookupTable]);
    const transactionV0 = new anchor.web3.VersionedTransaction(messageV0);
    transactionV0.sign([quoteVerifierKeypair]);
    transactionV0.sign([trustedSigner]);
    transactionV0.sign([ctx.payer]);

    const lookupTableByteLength = transactionV0.serialize().byteLength;

    console.log(`functionVerify (lookup): ${lookupTableByteLength}`);

    console.log(`SAVES = ${legacyByteLength - lookupTableByteLength} bytes`);
  });
});
