import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PublicKey, TransactionInstruction } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VaultTransferArgs {
  params: types.VaultTransferParamsFields
}

export interface VaultTransferAccounts {
  state: PublicKey
  authority: PublicKey
  to: PublicKey
  vault: PublicKey
  tokenProgram: PublicKey
}

export const layout = borsh.struct([types.VaultTransferParams.layout("params")])

export function vaultTransfer(
  args: VaultTransferArgs,
  accounts: VaultTransferAccounts
) {
  const keys = [
    { pubkey: accounts.state, isSigner: false, isWritable: false },
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.to, isSigner: false, isWritable: true },
    { pubkey: accounts.vault, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([211, 125, 3, 105, 45, 33, 227, 214])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.VaultTransferParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
