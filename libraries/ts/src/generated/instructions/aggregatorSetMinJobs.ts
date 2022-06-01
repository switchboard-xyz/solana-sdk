import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AggregatorSetMinJobsArgs {
  params: types.AggregatorSetMinJobsParamsFields
}

export interface AggregatorSetMinJobsAccounts {
  aggregator: PublicKey
  authority: PublicKey
}

export const layout = borsh.struct([
  types.AggregatorSetMinJobsParams.layout("params"),
])

export function aggregatorSetMinJobs(
  args: AggregatorSetMinJobsArgs,
  accounts: AggregatorSetMinJobsAccounts
) {
  const keys = [
    { pubkey: accounts.aggregator, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([158, 77, 149, 156, 157, 42, 25, 16])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.AggregatorSetMinJobsParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
