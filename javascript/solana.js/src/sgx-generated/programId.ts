import { PublicKey } from '@solana/web3.js';

// Program ID passed with the cli --program-id flag when running the code generator. Do not edit, it will get overwritten.
export const PROGRAM_ID_CLI = new PublicKey(
  '9x1FRtphkEPigGzxPAFfRshaBuxQX6s1qwSr37iLrkX5'
);

// This constant will not get overwritten on subsequent code generations and it's safe to modify it's value.
export const PROGRAM_ID: PublicKey = PROGRAM_ID_CLI;
