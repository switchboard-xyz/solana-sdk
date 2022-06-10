import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AggregatorRemoveJobArgs {
  params: types.AggregatorRemoveJobParamsFields
}

export interface AggregatorRemoveJobAccounts {
  aggregator: PublicKey
  authority: PublicKey
  job: PublicKey
}

export const layout = borsh.struct([
  types.AggregatorRemoveJobParams.layout("params"),
])

export function aggregatorRemoveJob(
  args: AggregatorRemoveJobArgs,
  accounts: AggregatorRemoveJobAccounts
) {
  const keys = [
    { pubkey: accounts.aggregator, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.job, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([158, 221, 231, 65, 41, 151, 155, 172])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.AggregatorRemoveJobParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
