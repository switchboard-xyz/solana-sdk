import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AggregatorSaveResultArgs {
  params: types.AggregatorSaveResultParamsFields
}

export interface AggregatorSaveResultAccounts {
  aggregator: PublicKey
  oracle: PublicKey
  oracleAuthority: PublicKey
  oracleQueue: PublicKey
  queueAuthority: PublicKey
  feedPermission: PublicKey
  oraclePermission: PublicKey
  lease: PublicKey
  escrow: PublicKey
  tokenProgram: PublicKey
  programState: PublicKey
  historyBuffer: PublicKey
}

export const layout = borsh.struct([
  types.AggregatorSaveResultParams.layout("params"),
])

export function aggregatorSaveResult(
  args: AggregatorSaveResultArgs,
  accounts: AggregatorSaveResultAccounts
) {
  const keys = [
    { pubkey: accounts.aggregator, isSigner: false, isWritable: true },
    { pubkey: accounts.oracle, isSigner: false, isWritable: true },
    { pubkey: accounts.oracleAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.oracleQueue, isSigner: false, isWritable: false },
    { pubkey: accounts.queueAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.feedPermission, isSigner: false, isWritable: true },
    { pubkey: accounts.oraclePermission, isSigner: false, isWritable: false },
    { pubkey: accounts.lease, isSigner: false, isWritable: true },
    { pubkey: accounts.escrow, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.programState, isSigner: false, isWritable: false },
    { pubkey: accounts.historyBuffer, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([21, 67, 5, 0, 74, 168, 51, 192])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.AggregatorSaveResultParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
