import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface InitStateArgs {
  params: types.InitStateParamsFields
}

export interface InitStateAccounts {
  state: PublicKey
  authority: PublicKey
  payer: PublicKey
  vrf: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([types.InitStateParams.layout("params")])

export function initState(args: InitStateArgs, accounts: InitStateAccounts) {
  const keys = [
    { pubkey: accounts.state, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: false, isWritable: false },
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.vrf, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([124, 213, 73, 136, 80, 37, 141, 54])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.InitStateParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
