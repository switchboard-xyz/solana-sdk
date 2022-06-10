import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface OracleQueueVrfConfigArgs {
  params: types.OracleQueueVrfConfigParamsFields
}

export interface OracleQueueVrfConfigAccounts {
  queue: PublicKey
  authority: PublicKey
}

export const layout = borsh.struct([
  types.OracleQueueVrfConfigParams.layout("params"),
])

export function oracleQueueVrfConfig(
  args: OracleQueueVrfConfigArgs,
  accounts: OracleQueueVrfConfigAccounts
) {
  const keys = [
    { pubkey: accounts.queue, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([87, 83, 181, 161, 149, 62, 131, 127])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.OracleQueueVrfConfigParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
