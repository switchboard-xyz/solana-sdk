import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface OracleQueueInitArgs {
  params: types.OracleQueueInitParamsFields
}

export interface OracleQueueInitAccounts {
  oracleQueue: PublicKey
  authority: PublicKey
  buffer: PublicKey
  payer: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  types.OracleQueueInitParams.layout("params"),
])

export function oracleQueueInit(
  args: OracleQueueInitArgs,
  accounts: OracleQueueInitAccounts
) {
  const keys = [
    { pubkey: accounts.oracleQueue, isSigner: true, isWritable: true },
    { pubkey: accounts.authority, isSigner: false, isWritable: false },
    { pubkey: accounts.buffer, isSigner: false, isWritable: true },
    { pubkey: accounts.payer, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([250, 226, 231, 111, 158, 164, 27, 136])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.OracleQueueInitParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
