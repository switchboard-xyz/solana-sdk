import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface AggregatorSetHistoryBufferAccounts {
  aggregator: PublicKey
  authority: PublicKey
  buffer: PublicKey
}

export function aggregatorSetHistoryBuffer(
  accounts: AggregatorSetHistoryBufferAccounts
) {
  const keys = [
    { pubkey: accounts.aggregator, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.buffer, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([88, 49, 214, 242, 229, 44, 171, 52])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
