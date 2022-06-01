import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AggregatorSetUpdateIntervalArgs {
  params: types.AggregatorSetUpdateIntervalParamsFields
}

export interface AggregatorSetUpdateIntervalAccounts {
  aggregator: PublicKey
  authority: PublicKey
}

export const layout = borsh.struct([
  types.AggregatorSetUpdateIntervalParams.layout("params"),
])

export function aggregatorSetUpdateInterval(
  args: AggregatorSetUpdateIntervalArgs,
  accounts: AggregatorSetUpdateIntervalAccounts
) {
  const keys = [
    { pubkey: accounts.aggregator, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([179, 12, 13, 144, 219, 88, 81, 104])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.AggregatorSetUpdateIntervalParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
