/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'
import { InitStateParams, initStateParamsBeet } from '../types/InitStateParams'

/**
 * @category Instructions
 * @category InitState
 * @category generated
 */
export type InitStateInstructionArgs = {
  params: InitStateParams
}
/**
 * @category Instructions
 * @category InitState
 * @category generated
 */
const initStateStruct = new beet.BeetArgsStruct<
  InitStateInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['params', initStateParamsBeet],
  ],
  'InitStateInstructionArgs'
)
/**
 * Accounts required by the _initState_ instruction
 * @category Instructions
 * @category InitState
 * @category generated
 */
export type InitStateInstructionAccounts = {
  state: web3.PublicKey
  authority: web3.PublicKey
  payer: web3.PublicKey
  vrf: web3.PublicKey
}

const initStateInstructionDiscriminator = [124, 213, 73, 136, 80, 37, 141, 54]

/**
 * Creates a _InitState_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category InitState
 * @category generated
 */
export function createInitStateInstruction(
  accounts: InitStateInstructionAccounts,
  args: InitStateInstructionArgs
) {
  const { state, authority, payer, vrf } = accounts

  const [data] = initStateStruct.serialize({
    instructionDiscriminator: initStateInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: state,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: authority,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: payer,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: vrf,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
  ]

  const ix = new web3.TransactionInstruction({
    programId: new web3.PublicKey(
      '7PoPs442NYqZwfrFhMuVDTzpWfaZi8dCtRFwqydnj5Gt'
    ),
    keys,
    data,
  })
  return ix
}