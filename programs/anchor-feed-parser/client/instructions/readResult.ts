import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ReadResultAccounts {
  aggregator: PublicKey
}

export function readResult(accounts: ReadResultAccounts) {
  const keys = [
    { pubkey: accounts.aggregator, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([130, 229, 115, 203, 180, 191, 240, 90])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
