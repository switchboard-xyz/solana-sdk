import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface CrankInitArgs {
  params: types.CrankInitParamsFields
}

export interface CrankInitAccounts {
  crank: PublicKey
  queue: PublicKey
  buffer: PublicKey
  payer: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([types.CrankInitParams.layout("params")])

export function crankInit(args: CrankInitArgs, accounts: CrankInitAccounts) {
  const keys = [
    { pubkey: accounts.crank, isSigner: true, isWritable: true },
    { pubkey: accounts.queue, isSigner: false, isWritable: false },
    { pubkey: accounts.buffer, isSigner: false, isWritable: true },
    { pubkey: accounts.payer, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([57, 179, 94, 136, 82, 79, 25, 185])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.CrankInitParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
