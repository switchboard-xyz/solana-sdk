import * as anchor from '@project-serum/anchor';
import * as spl from '@solana/spl-token';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import * as errors from '../errors';
import * as types from '../generated';
import { SwitchboardProgram } from '../program';
import { Account, OnAccountChangeCallback } from './account';
import { QueueAccount } from './queueAccount';

/**
 * Interface for a VRF callback.
 */
export interface Callback {
  programId: PublicKey;
  accounts: Array<anchor.web3.AccountMeta>;
  ixData: Buffer;
}

/**
 * Parameters for a VrfInit request.
 */
export interface VrfInitParams {
  /**
   *  Keypair to use for the vrf account. If not provided, one will be generated.
   */
  vrfKeypair: anchor.web3.Keypair;
  /**
   *  Optional authority for the resulting {@linkcode VrfAccount}. If not provided,
   *  {@linkcode vrfKeypair} will be used.
   */
  authority?: PublicKey;
  queue: QueueAccount;
  callback: Callback;
}

/**
 * @class VrfAccount
 */
export class VrfAccount extends Account<types.VrfAccountData> {
  static accountName = 'VrfAccountData';

  /**
   *  Produces a Switchboard {@linkcode VrfAccount}.
   *
   *  _NOTE_: {@linkcode program.wallet} is used to sign the transaction.
   */
  public static async create(
    program: SwitchboardProgram,
    params: VrfInitParams
  ): Promise<[string, VrfAccount]> {
    return this.createInstructions(program, {
      ...params,
      payerKeypair: program.wallet.payer,
    }).then(async ([instructions, account]) => {
      const txSignature = await program.signAndSendTransaction(instructions, [
        params.vrfKeypair,
      ]);
      return [txSignature, account];
    });
  }

  /**
   *  Creates a list of instructions that will produce a {@linkcode VrfAccount}.
   *
   *  _NOTE_: The transaction that includes these instructions should be signed by both
   *  {@linkcode params.payerKeypair} and {@linkcode params.vrfKeypair}.
   */
  public static async createInstructions(
    program: SwitchboardProgram,
    params: VrfInitParams & { payerKeypair: anchor.web3.Keypair },
    payer: PublicKey = program.walletPubkey
  ): Promise<[anchor.web3.TransactionInstruction[], VrfAccount]> {
    const vrfAccount = new VrfAccount(program, params.vrfKeypair.publicKey);
    const size = program.account.vrfAccountData.size;
    const switchTokenMint = await params.queue.loadMint();
    const escrow = await spl.getAssociatedTokenAddress(
      switchTokenMint.address,
      params.vrfKeypair.publicKey,
      true
    );
    return [
      [
        spl.createAssociatedTokenAccountInstruction(
          program.wallet.payer.publicKey,
          escrow,
          params.vrfKeypair.publicKey,
          switchTokenMint.address
        ),
        spl.createSetAuthorityInstruction(
          escrow,
          params.vrfKeypair.publicKey,
          spl.AuthorityType.AccountOwner,
          program.programState.publicKey,
          [program.wallet.payer, params.vrfKeypair]
        ),
        SystemProgram.createAccount({
          fromPubkey: program.wallet.payer.publicKey,
          newAccountPubkey: params.vrfKeypair.publicKey,
          space: size,
          lamports: await program.connection.getMinimumBalanceForRentExemption(
            size
          ),
          programId: program.programId,
        }),
        types.vrfInit(
          program,
          {
            params: {
              stateBump: program.programState.bump,
              callback: params.callback,
            },
          },
          {
            vrf: params.vrfKeypair.publicKey,
            authority: params.authority ?? params.vrfKeypair.publicKey,
            escrow,
            oracleQueue: params.queue.publicKey,
            programState: program.programState.publicKey,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
          }
        ),
      ],
      vrfAccount,
    ];
  }

  /**
   * Returns the size of an on-chain {@linkcode VrfAccount}.
   */
  public readonly size = this.program.account.vrfAccountData.size;

  /**
   * Retrieve and decode the {@linkcode types.VrfAccountData} stored in this account.
   */
  async loadData(): Promise<types.VrfAccountData> {
    const data = await types.VrfAccountData.fetch(this.program, this.publicKey);
    if (data === null) throw new errors.AccountNotFoundError(this.publicKey);
    return data;
  }

  onChange(callback: OnAccountChangeCallback<types.VrfAccountData>): number {
    return this.program.connection.onAccountChange(
      this.publicKey,
      accountInfo => callback(types.VrfAccountData.decode(accountInfo.data))
    );
  }

  // TODO: requestRandomness

  // TODO: prove

  // TODO: verify

  // TODO: proveAndVerify
}
