import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
  TransactionSignature,
} from '@solana/web3.js';
import * as errors from '../errors';
import * as types from '../generated';
import { SwitchboardProgram } from '../program';
import { TransactionObject } from '../transaction';
import { Account, OnAccountChangeCallback } from './account';
import { JobAccount } from './jobAccount';
import { QueueAccount } from './queueAccount';

export class BufferRelayerAccount extends Account<types.BufferRelayerAccountData> {
  static accountName = 'BufferRelayerAccountData';

  /**
   * Returns the size of an on-chain {@linkcode BufferRelayerAccount}.
   */
  public get size(): number {
    return this.program.account.bufferRelayerAccountData.size;
  }

  public decode(data: Buffer): types.BufferRelayerAccountData {
    try {
      return types.BufferRelayerAccountData.decode(data);
    } catch {
      return this.program.coder.decode<types.BufferRelayerAccountData>(
        BufferRelayerAccount.accountName,
        data
      );
    }
  }

  public onChange(
    callback: OnAccountChangeCallback<types.BufferRelayerAccountData>
  ): number {
    return this.program.connection.onAccountChange(
      this.publicKey,
      accountInfo => {
        callback(this.decode(accountInfo.data));
      }
    );
  }

  /**
   * Load and parse {@linkcode BufferRelayerAccount} data based on the program IDL.
   */
  public async loadData(): Promise<types.BufferRelayerAccountData> {
    const data = await types.BufferRelayerAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data === null) throw new errors.AccountNotFoundError(this.publicKey);
    return data;
  }

  public static async createInstructions(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: {
      name?: string;
      minUpdateDelaySeconds: number;
      queueAccount: QueueAccount;
      authority?: PublicKey;
      jobAccount: JobAccount;
      keypair?: Keypair;
    }
  ): Promise<[TransactionObject, BufferRelayerAccount]> {
    const keypair = params.keypair ?? Keypair.generate();
    const size = 2048;

    const ixns: TransactionInstruction[] = [];

    const escrow = program.mint.getAssociatedAddress(keypair.publicKey);

    ixns.push(
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: keypair.publicKey,
        space: size,
        lamports:
          await program.provider.connection.getMinimumBalanceForRentExemption(
            size
          ),
        programId: program.programId,
      })
    );

    ixns.push(
      types.bufferRelayerInit(
        program,
        {
          params: {
            name: [...Buffer.from(params.name ?? '', 'utf8').slice(0, 32)],
            minUpdateDelaySeconds: params.minUpdateDelaySeconds ?? 30,
            stateBump: program.programState.bump,
          },
        },
        {
          bufferRelayer: keypair.publicKey,
          escrow: escrow,
          authority: params.authority ?? payer,
          queue: params.queueAccount.publicKey,
          job: params.jobAccount.publicKey,
          programState: program.programState.publicKey,
          mint: program.mint.address,
          payer: payer,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        }
      )
    );

    return [
      new TransactionObject(payer, ixns, [keypair]),
      new BufferRelayerAccount(program, keypair.publicKey),
    ];
  }

  public static async create(
    program: SwitchboardProgram,
    params: {
      name?: string;
      minUpdateDelaySeconds: number;
      queueAccount: QueueAccount;
      authority?: PublicKey;
      jobAccount: JobAccount;
      keypair?: Keypair;
    }
  ): Promise<[TransactionSignature, BufferRelayerAccount]> {
    const [bufferInit, bufferAccount] =
      await BufferRelayerAccount.createInstructions(
        program,
        program.walletPubkey,
        params
      );
    const txnSignature = await program.signAndSend(bufferInit);
    return [txnSignature, bufferAccount];
  }
}

export interface BufferRelayerInit {
  name?: string;
  minUpdateDelaySeconds: number;
  queueAccount: QueueAccount;
  authority?: PublicKey;
  jobAccount: JobAccount;
  keypair?: Keypair;
}
