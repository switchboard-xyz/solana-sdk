import * as anchor from '@project-serum/anchor';
import { SwitchboardProgram } from '../program';
import * as types from '../generated';
import { Account } from './account';
import * as spl from '@solana/spl-token';
import * as errors from '../errors';
import { Mint } from '../mint';
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionSignature,
} from '@solana/web3.js';
import { TransactionObject } from '../transaction';

/**
 * Account type representing Switchboard global program state.
 *
 * Data: {@linkcode types.SbState}
 */
export class ProgramStateAccount extends Account<types.SbState> {
  static accountName = 'SbState';

  /**
   * Retrieves the {@linkcode ProgramStateAccount}, creates it if it doesn't exist;
   */
  static async getOrCreate(
    program: SwitchboardProgram,
    params: {
      mint?: PublicKey;
      daoMint?: PublicKey;
    }
  ): Promise<[ProgramStateAccount, number]> {
    const payer = program.wallet.payer;
    const [account, bump] = ProgramStateAccount.fromSeed(program);
    try {
      await account.loadData();
    } catch (e) {
      try {
        const [mint, vault]: [PublicKey, PublicKey] = await (async () => {
          if (params.mint === undefined) {
            const mint = await spl.createMint(
              program.connection,
              payer,
              payer.publicKey,
              null,
              9
            );
            const vault = await spl.createAccount(
              program.connection,
              payer,
              mint,
              anchor.web3.Keypair.generate().publicKey
            );
            await spl.mintTo(
              program.connection,
              payer,
              mint,
              vault,
              payer,
              100_000_000
            );
            return [mint, vault];
          } else {
            return [
              params.mint,
              await spl.createAccount(
                program.connection,
                payer,
                params.mint,
                payer.publicKey
              ),
            ];
          }
        })();

        const programInit = new TransactionObject(
          program.walletPubkey,
          [
            types.programInit(
              program,
              { params: { stateBump: bump } },
              {
                state: account.publicKey,
                authority: program.wallet.publicKey,
                payer: program.wallet.publicKey,
                tokenMint: mint,
                vault: vault,
                systemProgram: SystemProgram.programId,
                tokenProgram: spl.TOKEN_PROGRAM_ID,
                daoMint: params.daoMint ?? mint,
              }
            ),
          ],
          []
        );
        await program.signAndSend(programInit);
      } catch {} // eslint-disable-line no-empty
    }
    return [account, bump];
  }

  static createAccountInstruction(
    program: SwitchboardProgram,
    mint = Mint.native,
    daoMint = Mint.native
  ): [ProgramStateAccount, TransactionInstruction] {
    const [programStateAccount, stateBump] =
      ProgramStateAccount.fromSeed(program);

    const vault = anchor.web3.Keypair.generate();

    const ixn = types.programInit(
      program,
      { params: { stateBump: stateBump } },
      {
        state: programStateAccount.publicKey,
        authority: program.wallet.publicKey,
        payer: program.wallet.publicKey,
        tokenMint: mint,
        vault: vault.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
        daoMint: daoMint ?? mint,
      }
    );
    return [programStateAccount, ixn];
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
  /**
   * @return account size of the global {@linkcode ProgramStateAccount}.
   */
  public readonly size = this.program.account.sbState.size;
  /**
   * Retrieve and decode the {@linkcode types.SbState} stored in this account.
   */
  public async loadData(): Promise<types.SbState> {
    const data = await types.SbState.fetch(this.program, this.publicKey);
    if (data === null) throw new errors.AccountNotFoundError(this.publicKey);
    return data;
  }
  /**
   * Fetch the Switchboard token mint specified in the program state account.
   */
  public async getTokenMint(): Promise<spl.Mint> {
    const state = await this.loadData();
    const switchTokenMint = spl.getMint(
      this.program.connection,
      state.tokenMint
    );
    return switchTokenMint;
  }
}
