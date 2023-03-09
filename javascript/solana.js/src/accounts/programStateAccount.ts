import * as errors from '../errors';
import * as types from '../generated';
import { Mint } from '../mint';
import { SwitchboardProgram } from '../SwitchboardProgram';
import { TransactionObject } from '../TransactionObject';

import { Account } from './account';

import * as anchor from '@coral-xyz/anchor';
import * as spl from '@solana/spl-token';
import {
  AccountInfo,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionSignature,
} from '@solana/web3.js';

/**
 * Account type representing Switchboard global program state.
 *
 * Data: {@linkcode types.SbState}
 */
export class ProgramStateAccount extends Account<types.SbState> {
  static accountName = 'SbState';

  public static size = 1128;

  /**
   * @return account size of the global {@linkcode ProgramStateAccount}.
   */
  public readonly size = this.program.account.sbState.size;

  /**
   * Return a program state account state initialized to the default values.
   */
  public static default(): types.SbState {
    const buffer = Buffer.alloc(ProgramStateAccount.size, 0);
    types.SbState.discriminator.copy(buffer, 0);
    return types.SbState.decode(buffer);
  }

  /**
   * Create a mock account info for a given program state config. Useful for test integrations.
   */
  public static createMock(
    programId: PublicKey,
    data: Partial<types.SbState>,
    options?: {
      lamports?: number;
      rentEpoch?: number;
    }
  ): AccountInfo<Buffer> {
    const fields: types.SbStateFields = {
      ...ProgramStateAccount.default(),
      ...data,
      // any cleanup actions here
    };
    const state = new types.SbState(fields);

    const buffer = Buffer.alloc(ProgramStateAccount.size, 0);
    types.SbState.discriminator.copy(buffer, 0);
    types.SbState.layout.encode(state, buffer, 8);

    return {
      executable: false,
      owner: programId,
      lamports: options?.lamports ?? 1 * LAMPORTS_PER_SOL,
      data: buffer,
      rentEpoch: options?.rentEpoch ?? 0,
    };
  }

  /** Load the ProgramStateAccount with its current on-chain state */
  public static async load(
    program: SwitchboardProgram,
    publicKey: PublicKey | string
  ): Promise<[ProgramStateAccount, types.SbState]> {
    const account = new ProgramStateAccount(
      program,
      typeof publicKey === 'string' ? new PublicKey(publicKey) : publicKey
    );
    const state = await account.loadData();
    return [account, state];
  }

  /**
   * Retrieve and decode the {@linkcode types.SbState} stored in this account.
   */
  public async loadData(): Promise<types.SbState> {
    const data = await types.SbState.fetch(this.program, this.publicKey);
    if (data === null)
      throw new errors.AccountNotFoundError('Program State', this.publicKey);
    return data;
  }

  /**
   * Retrieves the {@linkcode ProgramStateAccount}, creates it if it doesn't exist;
   */
  static async getOrCreate(
    program: SwitchboardProgram,
    params: ProgramInitParams = {
      mint: Mint.native,
      daoMint: Mint.native,
    }
  ): Promise<[ProgramStateAccount, number, TransactionSignature | undefined]> {
    const [account, bump, txn] =
      await ProgramStateAccount.getOrCreateInstructions(
        program,
        program.walletPubkey,
        params
      );

    if (txn) {
      const txnSignature = await program.signAndSend(txn);
      return [account, bump, txnSignature];
    }

    return [account, bump, undefined];
  }

  static async getOrCreateInstructions(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: ProgramInitParams = {
      mint: Mint.native,
      daoMint: Mint.native,
    }
  ): Promise<[ProgramStateAccount, number, TransactionObject | undefined]> {
    const [account, bump] = ProgramStateAccount.fromSeed(program);

    try {
      await account.loadData();
      return [account, bump, undefined];
    } catch (e) {
      const ixns: TransactionInstruction[] = [];
      const signers: Keypair[] = [];

      let mint = params.mint;
      if (!mint) {
        const mintKeypair = Keypair.generate();
        mint = mintKeypair.publicKey;
        signers.push(mintKeypair);
      }
      const daoMint = params.daoMint ?? mint;
      const vaultKeypair = params.vaultKeypair ?? Keypair.generate();
      signers.push(vaultKeypair);

      // load the mint
      let splMint: spl.Mint;
      try {
        // try to load mint if it exists
        splMint = await spl.getMint(program.connection, mint);
      } catch {
        // create new mint
        ixns.push(
          SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: vaultKeypair.publicKey,
            space: spl.MintLayout.span,
            lamports:
              await program.connection.getMinimumBalanceForRentExemption(
                spl.MintLayout.span
              ),
            programId: spl.TOKEN_PROGRAM_ID,
          }),
          spl.createInitializeMintInstruction(mint, 9, payer, payer)
        );
        splMint = {
          address: mint,
          mintAuthority: payer,
          supply: BigInt('100000000000000000'),
          decimals: 9,
          isInitialized: true,
          freezeAuthority: payer,
          tlvData: Buffer.from(''),
        };
      }

      // create the vault
      ixns.push(
        SystemProgram.createAccount({
          fromPubkey: payer,
          newAccountPubkey: vaultKeypair.publicKey,
          space: spl.AccountLayout.span,
          lamports: await program.connection.getMinimumBalanceForRentExemption(
            spl.AccountLayout.span
          ),
          programId: spl.TOKEN_PROGRAM_ID,
        }),
        spl.createInitializeAccountInstruction(
          vaultKeypair.publicKey,
          splMint.address,
          payer
        )
      );

      // if authorized, mint tokens to vault
      if (splMint.mintAuthority?.equals(payer)) {
        ixns.push(
          spl.createMintToInstruction(
            splMint.address,
            vaultKeypair.publicKey,
            payer,
            BigInt('100000000000000000')
          )
        );
      }

      ixns.push(
        types.programInit(
          program,
          { params: { stateBump: bump } },
          {
            state: account.publicKey,
            authority: program.wallet.publicKey,
            payer: program.wallet.publicKey,
            tokenMint: splMint.address,
            vault: vaultKeypair.publicKey,
            systemProgram: SystemProgram.programId,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            daoMint: daoMint,
          }
        )
      );

      const programInit = new TransactionObject(payer, ixns, signers);

      return [account, bump, programInit];
    }
  }

  /**
   * Finds the {@linkcode ProgramStateAccount} from the static seed from which it was generated.
   * @return ProgramStateAccount and PDA bump tuple.
   */
  public static fromSeed(
    program: SwitchboardProgram
  ): [ProgramStateAccount, number] {
    const [publicKey, bump] = anchor.utils.publicKey.findProgramAddressSync(
      [Buffer.from('STATE')],
      program.programId
    );
    return [new ProgramStateAccount(program, publicKey), bump];
  }

  /**
   * Transfer N tokens from the program vault to a specified account.
   * @param to The recipient of the vault tokens.
   * @param authority The vault authority required to sign the transfer tx.
   * @param params specifies the amount to transfer.
   * @return TransactionSignature
   */
  public static async vaultTransfer(
    program: SwitchboardProgram,
    to: PublicKey,
    authority: anchor.web3.Keypair,
    params: { stateBump: number; amount: anchor.BN }
  ): Promise<TransactionSignature> {
    const [account, bump] = ProgramStateAccount.fromSeed(program);
    const vault = (await account.loadData()).tokenVault;

    const vaultTransfer = new TransactionObject(
      program.walletPubkey,
      [
        types.vaultTransfer(
          program,
          { params: { stateBump: bump, amount: params.amount } },
          {
            state: account.publicKey,
            to,
            vault,
            authority: authority.publicKey,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
          }
        ),
      ],
      []
    );
    const txnSignature = await program.signAndSend(vaultTransfer);
    return txnSignature;
  }
}

export interface ProgramInitParams {
  mint?: PublicKey;
  daoMint?: PublicKey;
  vaultKeypair?: Keypair;
}
