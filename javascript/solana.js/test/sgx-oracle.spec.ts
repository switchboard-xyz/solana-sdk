import 'mocha';

import * as sbv2 from '../src';
import { PermissionAccount, TransactionMissingSignerError } from '../src';
import { programConfig } from '../src/generated';

import { setupTest, TestContext } from './utils';

import { Keypair, PublicKey } from '@solana/web3.js';
import assert from 'assert';

describe('Quote Tests', () => {
  let ctx: TestContext;

  let queueAccount: sbv2.QueueAccount;
  let oracleAccount: sbv2.OracleAccount;

  const mrEnclave = Array.from(Buffer.from('Mr. Enclave'))
    .concat(Array(64).fill(0))
    .slice(0, 64);

  before(async () => {
    ctx = await setupTest();
    const programStateData = await new sbv2.ProgramStateAccount(
      ctx.program,
      ctx.program.programState.publicKey
    ).loadData();

    [queueAccount] = await sbv2.QueueAccount.create(ctx.program, {
      reward: 0,
      minStake: 0,
      enableTeeOnly: true,
    });
    [oracleAccount] = await queueAccount.createOracle({});

    ctx.program.signAndSend(
      new sbv2.TransactionObject(
        ctx.program.walletPubkey,
        [
          programConfig(
            ctx.program,
            {
              params: {
                token: PublicKey.default,
                bump: ctx.program.programState.bump,
                daoMint: PublicKey.default,
                addEnclaves: [mrEnclave],
                rmEnclaves: [],
              },
            },
            {
              authority: programStateData.authority,
              programState: ctx.program.programState.publicKey,
              daoMint: PublicKey.default,
            }
          ),
        ],
        []
      )
    );
  });

  it('Creates a TEE oracle', async () => {
    const cid = new Uint8Array([1, 2, 3]);
    [quoteAccount] = await sbv2.QuoteAccount.create(ctx.program, {
      queueAccount,
      cid,
    });
    const expected = Array.from(cid).concat(Array(64).fill(0)).slice(0, 64);
    const data = await quoteAccount.loadData();
    assert(data.isOnQueue === true);
    console.log(data);
  });

  // it('addMrEnclave', async () => {
  //   const mrEnclave = new Uint8Array([1, 2, 3]);
  //   await queueAccount.addMrEnclave({ mrEnclave, authority: queueAuthority });

  //   const expected = Array.from(mrEnclave)
  //     .concat(Array(32).fill(0))
  //     .slice(0, 32);
  //   const data = await queueAccount.loadData();
  //   assert(data.mrEnclavesLen === 1);
  //   assert(JSON.stringify(data.mrEnclaves[0]) === JSON.stringify(expected));

  //   await queueAccount.removeMrEnclave({
  //     mrEnclave,
  //     authority: queueAuthority,
  //   });
  //   const data2 = await queueAccount.loadData();
  //   assert(data2.mrEnclavesLen === 0);
  // });
});
