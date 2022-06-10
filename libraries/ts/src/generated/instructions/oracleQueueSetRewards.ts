import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface OracleQueueSetRewardsArgs {
  params: types.OracleQueueSetRewardsParamsFields
}

export interface OracleQueueSetRewardsAccounts {
  queue: PublicKey
  authority: PublicKey
}

export const layout = borsh.struct([
  types.OracleQueueSetRewardsParams.layout("params"),
])

export function oracleQueueSetRewards(
  args: OracleQueueSetRewardsArgs,
  accounts: OracleQueueSetRewardsAccounts
) {
  const keys = [
    { pubkey: accounts.queue, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([171, 200, 233, 23, 131, 160, 227, 117])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.OracleQueueSetRewardsParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
