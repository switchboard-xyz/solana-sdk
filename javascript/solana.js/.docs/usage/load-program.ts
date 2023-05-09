import { Connection } from '@solana/web3.js';
import {
  SwitchboardProgram,
  TransactionObject,
} from '@switchboard-xyz/solana.js';

const program = await SwitchboardProgram.load(
  'mainnet-beta',
  new Connection('https://api.mainnet-beta.solana.com'),
  payerKeypair /** Optional, READ-ONLY if not provided */
);
