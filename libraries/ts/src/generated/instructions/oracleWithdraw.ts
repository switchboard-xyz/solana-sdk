import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface OracleWithdrawArgs {
  params: types.OracleWithdrawParamsFields
}

export interface OracleWithdrawAccounts {
  oracle: PublicKey
  oracleAuthority: PublicKey
  tokenAccount: PublicKey
  withdrawAccount: PublicKey
  oracleQueue: PublicKey
  permission: PublicKey
  tokenProgram: PublicKey
  programState: PublicKey
  payer: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  types.OracleWithdrawParams.layout("params"),
])

export function oracleWithdraw(
  args: OracleWithdrawArgs,
  accounts: OracleWithdrawAccounts
) {
  const keys = [
    { pubkey: accounts.oracle, isSigner: false, isWritable: true },
    { pubkey: accounts.oracleAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.tokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.withdrawAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.oracleQueue, isSigner: false, isWritable: true },
    { pubkey: accounts.permission, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.programState, isSigner: false, isWritable: false },
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([43, 4, 200, 132, 96, 150, 124, 48])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.OracleWithdrawParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
