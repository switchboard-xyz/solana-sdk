import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateResultAccounts {
  state: PublicKey
  vrf: PublicKey
}

export function updateResult(accounts: UpdateResultAccounts) {
  const keys = [
    { pubkey: accounts.state, isSigner: false, isWritable: true },
    { pubkey: accounts.vrf, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([145, 72, 9, 94, 61, 97, 126, 106])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
