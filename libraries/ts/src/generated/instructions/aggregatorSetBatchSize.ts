import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AggregatorSetBatchSizeArgs {
  params: types.AggregatorSetBatchSizeParamsFields
}

export interface AggregatorSetBatchSizeAccounts {
  aggregator: PublicKey
  authority: PublicKey
}

export const layout = borsh.struct([
  types.AggregatorSetBatchSizeParams.layout("params"),
])

export function aggregatorSetBatchSize(
  args: AggregatorSetBatchSizeArgs,
  accounts: AggregatorSetBatchSizeAccounts
) {
  const keys = [
    { pubkey: accounts.aggregator, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([170, 87, 187, 247, 181, 156, 143, 86])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.AggregatorSetBatchSizeParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
