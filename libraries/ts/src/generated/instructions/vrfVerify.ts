import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VrfVerifyArgs {
  params: types.VrfVerifyParamsFields
}

export interface VrfVerifyAccounts {
  vrf: PublicKey
  callbackPid: PublicKey
  tokenProgram: PublicKey
  escrow: PublicKey
  programState: PublicKey
  oracle: PublicKey
  oracleAuthority: PublicKey
  oracleWallet: PublicKey
  instructionsSysvar: PublicKey
}

export const layout = borsh.struct([types.VrfVerifyParams.layout("params")])

export function vrfVerify(args: VrfVerifyArgs, accounts: VrfVerifyAccounts) {
  const keys = [
    { pubkey: accounts.vrf, isSigner: false, isWritable: true },
    { pubkey: accounts.callbackPid, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.escrow, isSigner: false, isWritable: true },
    { pubkey: accounts.programState, isSigner: false, isWritable: false },
    { pubkey: accounts.oracle, isSigner: false, isWritable: false },
    { pubkey: accounts.oracleAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.oracleWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.instructionsSysvar, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([53, 101, 13, 30, 245, 213, 102, 150])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.VrfVerifyParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
