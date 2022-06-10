import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface LeaseSetAuthorityAccounts {
  lease: PublicKey
  authority: PublicKey
  newAuthority: PublicKey
}

export function leaseSetAuthority(accounts: LeaseSetAuthorityAccounts) {
  const keys = [
    { pubkey: accounts.lease, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.newAuthority, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([255, 4, 88, 2, 213, 175, 87, 22])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
