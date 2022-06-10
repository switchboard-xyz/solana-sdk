import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface AggregatorSetAuthorityAccounts {
  aggregator: PublicKey
  authority: PublicKey
  newAuthority: PublicKey
}

export function aggregatorSetAuthority(
  accounts: AggregatorSetAuthorityAccounts
) {
  const keys = [
    { pubkey: accounts.aggregator, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.newAuthority, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([140, 176, 3, 173, 23, 2, 4, 81])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
