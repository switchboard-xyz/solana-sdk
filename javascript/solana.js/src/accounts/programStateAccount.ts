import * as anchor from '@project-serum/anchor';
import { SwitchboardProgram } from '../program';
import * as types from '../generated';
import { Account } from './account';
import * as spl from '@solana/spl-token';
import * as errors from '../errors';
import { Mint } from '../mint';
import {
  Keypair,
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

  public static default(): types.SbState {
    const buffer = Buffer.alloc(1128, 0);
    types.SbState.discriminator.copy(buffer, 0);
    return types.SbState.decode(buffer);
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
   * Retrieves the {@linkcode ProgramStateAccount}, creates it if it doesn't exist;
   */
  static async getOrCreate(
    program: SwitchboardProgram,
    mint: PublicKey = Mint.native
  ): Promise<[ProgramStateAccount, number, TransactionSignature | undefined]> {
    const [account, bump, txn] =
      await ProgramStateAccount.getOrCreateInstructions(
        program,
        program.walletPubkey,
        mint
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
    mint: PublicKey = Mint.native
  ): Promise<[ProgramStateAccount, number, TransactionObject | undefined]> {
    const [account, bump] = ProgramStateAccount.fromSeed(program);

    try {
      await account.loadData();
    } catch (e) {
      const vaultKeypair = Keypair.generate();
      const ixns: TransactionInstruction[] = [];

      // load the mint
      let splMint: spl.Mint;
      try {
        // try to load mint if it exists
        splMint = await spl.getMint(program.connection, mint);
      } catch {
        // create new mint
        const mintIxn = spl.createInitializeMintInstruction(
          mint,
          9,
          payer,
          payer
        );
        ixns.push(mintIxn);
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
      const vaultInitIxn = spl.createInitializeAccountInstruction(
        vaultKeypair.publicKey,
        splMint.address,
        payer
      );
      ixns.push(vaultInitIxn);

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
            daoMint: splMint.address,
          }
        )
      );

      const programInit = new TransactionObject(payer, ixns, []);

      return [account, bump, programInit];
    }
    return [account, bump, undefined];
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
    if (data === null)
      throw new errors.AccountNotFoundError('Program State', this.publicKey);
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
