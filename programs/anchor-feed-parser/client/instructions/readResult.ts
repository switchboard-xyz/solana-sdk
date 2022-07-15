import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface ReadResultArgs {
  params: types.ReadResultParamsFields
}

export interface ReadResultAccounts {
  aggregator: PublicKey
}

export const layout = borsh.struct([types.ReadResultParams.layout("params")])

export function readResult(args: ReadResultArgs, accounts: ReadResultAccounts) {
  const keys = [
    { pubkey: accounts.aggregator, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([130, 229, 115, 203, 180, 191, 240, 90])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.ReadResultParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
