import 'mocha';
import assert from 'assert';

import { DEFAULT_KEYPAIR_PATH } from './utilts';
import { SwitchboardTestContext } from '../src/test';
import fs from 'fs';
import path from 'path';
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

describe('SwitchboardTestContext Tests', () => {
  let payerKeypair: Keypair;
  let payerKeypairPath: string;

  before(async () => {
    payerKeypairPath = fs.existsSync(DEFAULT_KEYPAIR_PATH)
      ? DEFAULT_KEYPAIR_PATH
      : path.join(__dirname, 'data', 'payer-keypair.json');

    if (!fs.existsSync(payerKeypairPath)) {
      payerKeypair = Keypair.generate();
      fs.writeFileSync(payerKeypairPath, `[${payerKeypair.secretKey}]`);
    } else {
      payerKeypair = Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(fs.readFileSync(payerKeypairPath, 'utf-8')))
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
      payerKeypairPath
    );
  });
});
