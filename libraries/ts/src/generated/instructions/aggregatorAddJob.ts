import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface AggregatorAddJobAccounts {
  aggregator: PublicKey
  authority: PublicKey
  job: PublicKey
}

export function aggregatorAddJob(accounts: AggregatorAddJobAccounts) {
  const keys = [
    { pubkey: accounts.aggregator, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.job, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([132, 30, 35, 51, 115, 142, 186, 10])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
