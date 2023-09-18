import "mocha";

import type {
  BootstrappedAttestationQueue,
  SwitchboardProgram,
} from "../src/index.js";
import {
  SwitchboardWallet,
  TransactionMissingSignerError,
} from "../src/index.js";
import { FunctionAccount } from "../src/index.js";
import {
  AttestationProgramStateAccount,
  AttestationQueueAccount,
  TransactionObject,
} from "../src/index.js";

import type { TestContext } from "./utils.js";
import { printLogs, setupTest } from "./utils.js";

import { Keypair, LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import { sleep } from "@switchboard-xyz/common";
import assert from "assert";

const defaulWalletSeed = "DefaultSeed";

async function createNewPayer(
  ctx: TestContext
): Promise<[SwitchboardProgram, Keypair]> {
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
  return [program, newPayer];
}

describe("NEW Switchboard Wallet Tests", () => {
  let ctx: TestContext;

  let switchboard: BootstrappedAttestationQueue;

  let switchboardWallet: SwitchboardWallet;

  before(async () => {
    ctx = await setupTest();

    switchboard = await AttestationQueueAccount.bootstrapNewQueue(ctx.program, {
      // reward > 0 so we can ensure function initializes to OutOfFunds since
      // reward is less than starting balance
      reward: 1,
      allowAuthorityOverrideAfter: 3600,
      maxQuoteVerificationAge: 7200,
      requireAuthorityHeartbeatPermission: false,
      requireUsagePermissions: false,
      verifierEnclave: "MadeUpEnclave",
    });

    await AttestationProgramStateAccount.getOrCreate(ctx.program);
  });

  it("Test", async () => {
    // create new payer
    const [program, newPayer] = await createNewPayer(ctx);

    const [functionAccount, tx] = await FunctionAccount.create(
      program,
      {
        container: "",
        schedule: "* * * * * *",
        attestationQueue: switchboard.attestationQueue.account,
      },
      undefined,
      { skipPreflight: true }
    );
    await printLogs(ctx.program.provider.connection, tx, false);

    let functionState = await functionAccount.loadData();
    assert(functionState.status.kind === "OutOfFunds");
    assert(functionState.authority.equals(newPayer.publicKey));

    const wallet = await functionAccount.wallet;
    let walletState = await wallet.loadData();
    let walletBalance = await wallet.getBalance();
    assert(walletBalance === 0);
    assert(walletState.mint.equals(ctx.program.mint.address));
    assert(
      walletState.attestationQueue.equals(
        switchboard.attestationQueue.publicKey
      )
    );
    assert(walletState.resourceCount === 1);

    // fund function
    const wrapAmount = 0.005;
    const fundTx = await wallet.fund({ wrapAmount });
    await printLogs(ctx.program.provider.connection, fundTx, false);

    walletState = await wallet.loadData();
    walletBalance = await wallet.getBalance();
    console.log(`Wallet Balance: ${walletBalance}`);
    assert(walletBalance === wrapAmount);

    // check function stare was updated
    functionState = await functionAccount.loadData();
    console.log(`Function Status: ${functionState.status.kind}`);
    assert(functionState.status.kind === "Active");

    // try to withdraw if im the authority
    const withdrawAmount = 0.001;
    const withdrawTx = await wallet.withdraw(withdrawAmount);
    await printLogs(ctx.program.provider.connection, withdrawTx, false);
    walletBalance = await wallet.getBalance();
    console.log(`Wallet Balance: ${walletBalance}`);
    assert(walletBalance === wrapAmount - withdrawAmount);

    // try to withdraw if im not the authority
    const [programWithWrongAuthority, newPayer2] = await createNewPayer(ctx);
    const walletWithWrongAuthority = new SwitchboardWallet(
      programWithWrongAuthority,
      wallet.publicKey
    );
    try {
      await walletWithWrongAuthority.withdraw(withdrawAmount);
      walletBalance = await wallet.getBalance();
      console.log(`Wallet Balance: ${walletBalance}`);
      assert(walletBalance === wrapAmount - withdrawAmount);
    } catch (error) {
      if (!(error instanceof TransactionMissingSignerError)) {
        throw error;
      }
    }
  });
});
