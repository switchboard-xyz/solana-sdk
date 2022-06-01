import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VrfProveArgs {
  params: types.VrfProveParamsFields
}

export interface VrfProveAccounts {
  vrf: PublicKey
  oracle: PublicKey
  randomnessProducer: PublicKey
}

export const layout = borsh.struct([types.VrfProveParams.layout("params")])

export function vrfProve(args: VrfProveArgs, accounts: VrfProveAccounts) {
  const keys = [
    { pubkey: accounts.vrf, isSigner: false, isWritable: true },
    { pubkey: accounts.oracle, isSigner: false, isWritable: false },
    { pubkey: accounts.randomnessProducer, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([131, 94, 202, 191, 207, 121, 41, 234])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.VrfProveParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
