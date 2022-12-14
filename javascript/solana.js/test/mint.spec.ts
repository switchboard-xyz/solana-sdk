import 'mocha';
import assert from 'assert';

import * as anchor from '@project-serum/anchor';
import { setupTest, TestContext } from './utilts';
import { Keypair, PublicKey } from '@solana/web3.js';
import Big from 'big.js';

describe('Mint Tests', () => {
  let ctx: TestContext;

  before(async () => {
    ctx = await setupTest();
  });

  const user = Keypair.generate();
  let userTokenAddress: PublicKey;

  it('Creates a user token account', async () => {
    const airdropTxn = await ctx.program.connection.requestAirdrop(
      user.publicKey,
      1 * anchor.web3.LAMPORTS_PER_SOL
    );
    await ctx.program.connection.confirmTransaction(airdropTxn);

    [userTokenAddress] = await ctx.program.mint.createAssocatedUser(
      ctx.payer.publicKey,
      user.publicKey
    );

    const userTokenBalance =
      (await ctx.program.mint.getAssociatedBalance(user.publicKey)) ?? 0;

    assert(
      userTokenBalance === 0,
      `Incorrect user token balance, expected 0, received ${userTokenBalance}`
    );
  });

  it('Wraps SOL', async () => {
    assert(userTokenAddress, `User token address does not exist`);

    const WRAP_AMOUNT = 0.25;

    await ctx.program.mint.wrap(
      ctx.payer.publicKey,
      { amount: WRAP_AMOUNT },
      user
    );

    const userTokenBalance =
      (await ctx.program.mint.getAssociatedBalance(user.publicKey)) ?? 0;

    assert(
      userTokenBalance === WRAP_AMOUNT,
      `Incorrect user token balance, expected ${WRAP_AMOUNT} wSOL, received ${userTokenBalance}`
    );
  });

  it('Unwraps SOL', async () => {
    assert(userTokenAddress, `User token address does not exist`);

    const UNWRAP_AMOUNT = 0.1;

    let initialUserTokenBalance =
      (await ctx.program.mint.getAssociatedBalance(user.publicKey)) ?? 0;
    // if previous test failed, wrap some funds
    if (initialUserTokenBalance <= 0) {
      await ctx.program.mint.wrap(
        ctx.payer.publicKey,
        { fundUpTo: 0.25 },
        user
      );
      initialUserTokenBalance =
        (await ctx.program.mint.getAssociatedBalance(user.publicKey)) ?? 0;
    }

    const expectedFinalBalance = initialUserTokenBalance - UNWRAP_AMOUNT;
    assert(
      expectedFinalBalance >= 0,
      `Final user token address would be negative`
    );

    await ctx.program.mint.unwrap(ctx.payer.publicKey, UNWRAP_AMOUNT, user);

    const userTokenBalance = await ctx.program.mint.getAssociatedBalance(
      user.publicKey
    );
    assert(
      userTokenBalance === expectedFinalBalance,
      `Incorrect user token balance, expected ${expectedFinalBalance}, received ${userTokenBalance}`
    );
  });

  it('Closes associated token account', async () => {
    assert(userTokenAddress, `User token address does not exist`);

    await ctx.program.mint.getAssociatedBalance(user.publicKey);

    await ctx.program.mint.unwrap(ctx.payer.publicKey, undefined, user);

    const userTokenAccount = await ctx.program.connection.getAccountInfo(
      userTokenAddress
    );
    assert(
      userTokenAccount === null,
      `Failed to close associated token account`
    );
  });
});
