import 'mocha';
import assert from 'assert';

import { setupTest, TestContext } from './utilts';
import { SwitchboardTestContext } from '../src/test';
import fs from 'fs';
import path from 'path';
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

const PAYER_KEYPAIR_PATH = path.join(__dirname, 'data', 'payer-keypair.json');

describe('SwitchboardTestContext Tests', () => {
  //   let ctx: TestContext;

  before(async () => {
    // ctx = await setupTest();

    let payerKeypair: Keypair;

    if (!fs.existsSync(PAYER_KEYPAIR_PATH)) {
      payerKeypair = Keypair.generate();
      fs.writeFileSync(PAYER_KEYPAIR_PATH, `[${payerKeypair.secretKey}]`);
    } else {
      payerKeypair = Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(fs.readFileSync(PAYER_KEYPAIR_PATH, 'utf-8')))
      );
    }

    const connection = new Connection(clusterApiUrl('devnet'));
    const payerBalance = await connection.getBalance(payerKeypair.publicKey);
    // 0.5 SOL
    if (payerBalance < 500000000) {
      const airdropTxn = await connection.requestAirdrop(
        payerKeypair.publicKey,
        1 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(airdropTxn);
    }
  });

  it('Creates a test context', async () => {
    const testEnvironment = await SwitchboardTestContext.createEnvironment(
      PAYER_KEYPAIR_PATH
    );
  });
});
