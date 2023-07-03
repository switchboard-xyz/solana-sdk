import "mocha";

import {
  AttestationProgramStateAccount,
  AttestationQueueAccount,
  type BootstrappedAttestationQueue,
  parseRawBuffer,
  SwitchboardWallet,
} from "../src/index.js";

import { printLogs, setupTest, TestContext } from "./utils.js";

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
      switchboard.attestationQueueAccount.publicKey,
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
        switchboard.attestationQueueAccount.publicKey
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
});