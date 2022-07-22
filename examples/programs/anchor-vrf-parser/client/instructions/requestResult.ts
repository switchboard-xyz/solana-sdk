import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface RequestResultArgs {
  params: types.RequestResultParamsFields
}

export interface RequestResultAccounts {
  state: PublicKey
  authority: PublicKey
  switchboardProgram: PublicKey
  vrf: PublicKey
  oracleQueue: PublicKey
  queueAuthority: PublicKey
  dataBuffer: PublicKey
  permission: PublicKey
  escrow: PublicKey
  payerWallet: PublicKey
  payerAuthority: PublicKey
  recentBlockhashes: PublicKey
  programState: PublicKey
  tokenProgram: PublicKey
}

export const layout = borsh.struct([types.RequestResultParams.layout("params")])

export function requestResult(
  args: RequestResultArgs,
  accounts: RequestResultAccounts
) {
  const keys = [
    { pubkey: accounts.state, isSigner: false, isWritable: true },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.switchboardProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.vrf, isSigner: false, isWritable: true },
    { pubkey: accounts.oracleQueue, isSigner: false, isWritable: true },
    { pubkey: accounts.queueAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.dataBuffer, isSigner: false, isWritable: false },
    { pubkey: accounts.permission, isSigner: false, isWritable: true },
    { pubkey: accounts.escrow, isSigner: false, isWritable: true },
    { pubkey: accounts.payerWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.payerAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.recentBlockhashes, isSigner: false, isWritable: false },
    { pubkey: accounts.programState, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([52, 47, 170, 99, 27, 80, 113, 141])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.RequestResultParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
