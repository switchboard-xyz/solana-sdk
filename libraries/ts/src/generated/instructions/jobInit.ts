import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface JobInitArgs {
  params: types.JobInitParamsFields
}

export interface JobInitAccounts {
  job: PublicKey
  authorWallet: PublicKey
  programState: PublicKey
}

export const layout = borsh.struct([types.JobInitParams.layout("params")])

export function jobInit(args: JobInitArgs, accounts: JobInitAccounts) {
  const keys = [
    { pubkey: accounts.job, isSigner: false, isWritable: true },
    { pubkey: accounts.authorWallet, isSigner: false, isWritable: false },
    { pubkey: accounts.programState, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([101, 86, 105, 192, 34, 201, 147, 159])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.JobInitParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
