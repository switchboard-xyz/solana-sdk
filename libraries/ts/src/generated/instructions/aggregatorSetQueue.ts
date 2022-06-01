import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface AggregatorSetQueueAccounts {
  aggregator: PublicKey
  authority: PublicKey
  queue: PublicKey
}

export function aggregatorSetQueue(accounts: AggregatorSetQueueAccounts) {
  const keys = [
    { pubkey: accounts.aggregator, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.queue, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([111, 152, 142, 153, 206, 39, 22, 148])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
