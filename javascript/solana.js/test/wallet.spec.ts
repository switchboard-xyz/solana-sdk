import "mocha";

import type { BootstrappedAttestationQueue } from "../src/index.js";
import {
  AttestationProgramStateAccount,
  AttestationQueueAccount,
  SwitchboardWallet,
  TransactionObject,
} from "../src/index.js";

import type { TestContext } from "./utils.js";
import { printLogs, setupTest } from "./utils.js";

import { Keypair, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import { sleep } from "@switchboard-xyz/common";
import assert from "assert";

const defaulWalletSeed = "DefaultSeed";

describe("Switchboard Wallet Tests", () => {
  let ctx: TestContext;

  let switchboard: BootstrappedAttestationQueue;

  let switchboardWallet: SwitchboardWallet;

  before(async () => {
    ctx = await setupTest();

    switchboard = await AttestationQueueAccount.bootstrapNewQueue(ctx.program);

    await AttestationProgramStateAccount.getOrCreate(ctx.program);
  });

  it("Creates a SwitchboardWallet", async () => {
    let walletInitSignature: string;
    [switchboardWallet, walletInitSignature] = await SwitchboardWallet.create(
      ctx.program,
      switchboard.attestationQueue.account.publicKey,
      ctx.payer.publicKey,
      defaulWalletSeed
    );

    const name = SwitchboardWallet.parseName(defaulWalletSeed);

    await printLogs(ctx.program.connection, walletInitSignature);

    const walletState = await switchboardWallet.loadData();

    assert(
      walletState.mint.equals(ctx.program.mint.address),
      "MintPubkeyMismatch"
    );
    assert(
      walletState.attestationQueue.equals(
        switchboard.attestationQueue.account.publicKey
      ),
      "QueuePubkeyMismatch"
    );
    assert(
      walletState.authority.equals(ctx.payer.publicKey),
      "AuthorityPubkeyMismatch"
    );
    assert(
      Buffer.compare(Buffer.from(name), Buffer.from(walletState.name)) === 0,
      "WalletNameMismatch"
    );
  });

  it("Deposits into a Switchboard Wallet", async () => {
    const payerTokenWallet = (
      await ctx.program.mint.getOrCreateWrappedUser(ctx.program.walletPubkey, {
        fundUpTo: 0.5,
      })
    )[0];
    const depositTxnSignature = await switchboardWallet.fund({
      transferAmount: 0.15,
      funderTokenWallet: payerTokenWallet,
    });
    // await printLogs(switchboardProgram.connection, depositTxnSignature);

    const balance = await switchboardWallet.getBalance();
    assert(balance === 0.15, "WalletBalanceMismatch");
  });

  it("Withdraws from a Switchboard Wallet", async () => {
    const initialBalance = await switchboardWallet.getBalance();

    const withdrawTxnSignature = await switchboardWallet.withdraw(0.05);
    await printLogs(ctx.program.connection, withdrawTxnSignature);

    const balance = await switchboardWallet.getBalance();
    const diff = ctx.round(initialBalance - balance, 4);
    assert(diff === 0.05, "WalletBalanceMismatch");
  });

  it("Wraps SOL into a Switchboard Wallet", async () => {
    const initialBalance = await switchboardWallet.getBalance();

    const wrapTxnSignature = await switchboardWallet.wrap(0.25);
    // await printLogs(switchboardProgram.connection, wrapTxnSignature);

    const balance = await switchboardWallet.getBalance();
    const diff = ctx.round(balance - initialBalance, 4);
    assert(diff === 0.25, "WalletBalanceMismatch");
  });

  it("Withdraws all remaining balance when amount is Number.MAX_SAFE_INTEGER", async () => {
    const initialBalance = await switchboardWallet.getBalance();

    const withdrawTxnSignature = await switchboardWallet.withdraw(
      Number.MAX_SAFE_INTEGER
    );
    await printLogs(ctx.program.connection, withdrawTxnSignature);

    const balance = await switchboardWallet.getBalance();
    assert(balance === 0, "WalletBalanceMismatch");
  });

  it("Funds a wallet with no existing token wallet", async () => {
    // create new payer
    const newPayer = Keypair.generate();
    await ctx.program.signAndSend(
      new TransactionObject(
        ctx.payer.publicKey,
        [
          SystemProgram.transfer({
            fromPubkey: ctx.payer.publicKey,
            toPubkey: newPayer.publicKey,
            lamports: 2 * LAMPORTS_PER_SOL,
          }),
        ],
        []
      )
    );
    const program = ctx.program.newWithPayer(newPayer);

    // create wallet
    const [newWallet, newWalletInit] =
      await SwitchboardWallet.createInstruction(
        program,
        newPayer.publicKey,
        switchboard.attestationQueue.publicKey,
        newPayer.publicKey,
        defaulWalletSeed,
        8
      );
    await program.signAndSend(newWalletInit);

    // assert token account is not created
    const newPayerTokenWallet = program.mint.getAssociatedAddress(
      newPayer.publicKey
    );
    const newPayerTokenAccount = await program.mint.getAccount(
      newPayerTokenWallet
    );
    assert(
      newPayerTokenAccount === null,
      "New payer token wallet should not be initialized yet"
    );

    // fund the wallet
    const txnSignature = await newWallet.fund({
      wrapAmount: 0.1,
      // transferAmount: 0.1,
    });
    // const txnSignature = await newWallet.wrap(0.1);
    await sleep(2000);
    const balance = await newWallet.getBalance();
    assert(balance === 0.1, "WalletBalanceMismatch");
  });
});
