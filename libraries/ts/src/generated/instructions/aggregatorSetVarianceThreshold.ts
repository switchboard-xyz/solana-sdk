import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AggregatorSetVarianceThresholdArgs {
  params: types.AggregatorSetVarianceThresholdParamsFields
}

export interface AggregatorSetVarianceThresholdAccounts {
  aggregator: PublicKey
  authority: PublicKey
}

export const layout = borsh.struct([
  types.AggregatorSetVarianceThresholdParams.layout("params"),
])

export function aggregatorSetVarianceThreshold(
  args: AggregatorSetVarianceThresholdArgs,
  accounts: AggregatorSetVarianceThresholdAccounts
) {
  const keys = [
    { pubkey: accounts.aggregator, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([212, 41, 238, 231, 119, 125, 150, 6])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.AggregatorSetVarianceThresholdParams.toEncodable(
        args.params
      ),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
