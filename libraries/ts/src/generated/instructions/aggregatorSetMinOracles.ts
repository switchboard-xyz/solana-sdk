import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AggregatorSetMinOraclesArgs {
  params: types.AggregatorSetMinOraclesParamsFields
}

export interface AggregatorSetMinOraclesAccounts {
  aggregator: PublicKey
  authority: PublicKey
}

export const layout = borsh.struct([
  types.AggregatorSetMinOraclesParams.layout("params"),
])

export function aggregatorSetMinOracles(
  args: AggregatorSetMinOraclesArgs,
  accounts: AggregatorSetMinOraclesAccounts
) {
  const keys = [
    { pubkey: accounts.aggregator, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([178, 35, 71, 65, 153, 193, 145, 28])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.AggregatorSetMinOraclesParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
