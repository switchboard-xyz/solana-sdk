import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface ProgramConfigArgs {
  params: types.ProgramConfigParamsFields
}

export interface ProgramConfigAccounts {
  authority: PublicKey
  programState: PublicKey
}

export const layout = borsh.struct([types.ProgramConfigParams.layout("params")])

export function programConfig(
  args: ProgramConfigArgs,
  accounts: ProgramConfigAccounts
) {
  const keys = [
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.programState, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([62, 123, 20, 150, 56, 109, 209, 145])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.ProgramConfigParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
