import * as spl from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionSignature,
} from '@solana/web3.js';
import { InsufficientFundsError, NativeMintOnlyError } from './errors';
import { SwitchboardDecimal } from './generated';
import Big from 'big.js';
import BN from 'bn.js';
import { TransactionObject } from './transaction';

/**
 * load - load the given mint and metadata
 *
 */

export class Mint {
  public static native = new PublicKey(
    'So11111111111111111111111111111111111111112'
  );

  constructor(
    readonly provider: anchor.AnchorProvider,
    readonly mint: spl.Mint
  ) {}

  get address() {
    return this.mint.address;
  }

  get connection() {
    return this.provider.connection;
  }

  public static async load(provider: anchor.AnchorProvider): Promise<Mint> {
    const splMint = await spl.getMint(provider.connection, Mint.native);
    return new Mint(provider, splMint);
  }

  toTokenAmount(amount: number): bigint {
    const big = new Big(amount);
    const tokenAmount = big.mul(new Big(10).pow(this.mint.decimals));
    return BigInt(tokenAmount.toString());
  }

  fromTokenAmount(amount: bigint): number {
    const swbDecimal = new SwitchboardDecimal({
      mantissa: new BN(amount.toString()),
      scale: this.mint.decimals,
    });
    return swbDecimal.toBig().toNumber();
  }

  public async getAccount(user: PublicKey): Promise<spl.Account> {
    const userTokenAddress = Mint.getAssociatedAddress(user);
    const account = await spl.getAccount(this.connection, userTokenAddress);
    return account;
  }

  public async getBalance(user: PublicKey): Promise<number> {
    const userAccount = await this.getAccount(user);
    return this.fromTokenAmount(userAccount.amount);
  }

  public getAssociatedAddress(
    user: anchor.web3.PublicKey
  ): anchor.web3.PublicKey {
    return Mint.getAssociatedAddress(user);
  }

  public static getAssociatedAddress(
    user: anchor.web3.PublicKey
  ): anchor.web3.PublicKey {
    const [associatedToken] = anchor.utils.publicKey.findProgramAddressSync(
      [
        user.toBuffer(),
        spl.TOKEN_PROGRAM_ID.toBuffer(),
        Mint.native.toBuffer(),
      ],
      spl.ASSOCIATED_TOKEN_PROGRAM_ID
    );
    return associatedToken;
  }

  public async getOrCreateAssociatedUser(
    payer: PublicKey,
    user?: Keypair
  ): Promise<anchor.web3.PublicKey> {
    const owner = user ? user.publicKey : payer;
    const associatedToken = Mint.getAssociatedAddress(owner);
    const accountInfo = await this.connection.getAccountInfo(associatedToken);
    if (accountInfo === null) {
      await this.createAssocatedUser(payer, user);
      return associatedToken;
    } else {
      return associatedToken;
    }
  }

  public async createAssocatedUser(
    payer: anchor.web3.PublicKey,
    user?: Keypair
  ): Promise<[anchor.web3.PublicKey, string]> {
    const [txn, associatedToken] = this.createAssocatedUserInstruction(
      payer,
      user
    );
    const sig = await this.signAndSend(txn);

    return [associatedToken, sig];
  }

  public static createAssocatedUserInstruction(
    payer: anchor.web3.PublicKey,
    user?: Keypair
  ): [TransactionObject, PublicKey] {
    const owner = user ? user.publicKey : payer;
    const associatedToken = Mint.getAssociatedAddress(owner);
    const ixn = spl.createAssociatedTokenAccountInstruction(
      payer,
      associatedToken,
      owner,
      Mint.native
    );
    return [new TransactionObject(payer, [ixn], []), associatedToken];
  }

  public createAssocatedUserInstruction(
    payer: PublicKey,
    user?: Keypair
  ): [TransactionObject, PublicKey] {
    return Mint.createAssocatedUserInstruction(payer, user);
  }

  public static createUserInstruction(
    payer: PublicKey,
    user?: Keypair
  ): [PublicKey, TransactionObject] {
    const owner = user ? user.publicKey : payer;
    const account = Mint.getAssociatedAddress(owner);
    const ixn = spl.createInitializeAccountInstruction(
      account,
      Mint.native,
      owner
    );
    return [account, new TransactionObject(payer, [ixn], user ? [user] : [])];
  }

  public createUserInstruction(
    payer: PublicKey,
    user?: Keypair
  ): [PublicKey, TransactionObject] {
    return Mint.createUserInstruction(payer, user);
  }

  public async createUser(
    payer: PublicKey,
    user?: Keypair
  ): Promise<[PublicKey, string]> {
    const [account, txn] = this.createUserInstruction(payer, user);
    const sig = await this.signAndSend(txn);
    return [account, sig];
  }

  public async wrapInstruction(
    payer: anchor.web3.PublicKey,
    params:
      | {
          amount: number;
        }
      | { fundUpTo: Big },
    user?: Keypair
  ): Promise<TransactionObject> {
    if (!this.address.equals(Mint.native)) {
      throw new NativeMintOnlyError();
    }

    const owner = user ? user.publicKey : payer;

    const ownerBalance = new Big(await this.connection.getBalance(owner));

    const userAddress = this.getAssociatedAddress(owner);
    const userAccountInfo = await this.connection.getAccountInfo(userAddress);
    const userAccount =
      userAccountInfo === null
        ? null
        : spl.unpackAccount(userAddress, userAccountInfo);

    const balance = userAccount
      ? new Big(this.fromTokenAmount(userAccount.amount))
      : new Big(0);

    let wrapAmount: Big;
    if ('fundUpTo' in params) {
      if (balance.gte(params.fundUpTo)) {
        return new TransactionObject(payer, [], []);
      }
      wrapAmount = params.fundUpTo.sub(balance);
    } else if ('amount' in params) {
      wrapAmount = balance.add(params.amount);
    } else {
      throw new Error(
        `Must specify fundUpTo or amount to perform this actions`
      );
    }

    if (ownerBalance.lte(wrapAmount)) {
      throw new InsufficientFundsError();
    }

    const ephemeralAccount = Keypair.generate();
    const ephemeralWallet = this.getAssociatedAddress(
      ephemeralAccount.publicKey
    );

    const wrapAmountLamports = this.toTokenAmount(wrapAmount.toNumber());

    const ixns = [
      spl.createAssociatedTokenAccountInstruction(
        payer,
        ephemeralWallet,
        ephemeralAccount.publicKey,
        spl.NATIVE_MINT
      ),
      SystemProgram.transfer({
        fromPubkey: owner,
        toPubkey: ephemeralWallet,
        lamports: wrapAmountLamports,
      }),
      spl.createSyncNativeInstruction(ephemeralWallet),
      spl.createTransferInstruction(
        ephemeralWallet,
        userAddress,
        ephemeralAccount.publicKey,
        wrapAmountLamports
      ),
      spl.createCloseAccountInstruction(
        ephemeralWallet,
        owner,
        ephemeralAccount.publicKey
      ),
    ];

    return new TransactionObject(
      payer,
      ixns,
      user ? [user, ephemeralAccount] : [ephemeralAccount]
    );
  }

  public async wrap(
    payer: anchor.web3.PublicKey,
    params:
      | {
          amount: number;
        }
      | { fundUpTo: Big },
    user?: Keypair
  ) {
    if (!this.address.equals(Mint.native)) {
      throw new NativeMintOnlyError();
    }

    const wrapIxns = await this.wrapInstruction(payer, params, user);
    const txSignature = await this.signAndSend(wrapIxns);

    return txSignature;
  }

  public async unwrapInstruction(
    payer: anchor.web3.PublicKey,
    amount?: number,
    user?: Keypair
  ): Promise<TransactionObject> {
    if (!this.address.equals(Mint.native)) {
      throw new NativeMintOnlyError();
    }

    const owner = user ? user.publicKey : payer;

    const ixns: TransactionInstruction[] = [];
    const signers: Keypair[] = user ? [user] : [];

    const userAddress = this.getAssociatedAddress(owner);
    const userBalance = await this.getBalance(owner);

    if (amount) {
      if (amount >= userBalance) {
        ixns.push(spl.createCloseAccountInstruction(userAddress, owner, owner));
      } else {
        const ephemeralAccount = Keypair.generate();
        const ephemeralWallet = this.getAssociatedAddress(
          ephemeralAccount.publicKey
        );

        const unwrapAmountLamports = this.toTokenAmount(amount);

        signers.push(ephemeralAccount);

        ixns.push(
          spl.createAssociatedTokenAccountInstruction(
            payer,
            ephemeralWallet,
            ephemeralAccount.publicKey,
            Mint.native
          ),
          spl.createTransferInstruction(
            userAddress,
            ephemeralWallet,
            owner,
            unwrapAmountLamports
          ),
          spl.createCloseAccountInstruction(
            ephemeralWallet,
            owner,
            ephemeralAccount.publicKey
          )
        );
      }
    } else {
      ixns.push(spl.createCloseAccountInstruction(userAddress, owner, owner));
    }

    return new TransactionObject(payer, ixns, signers);
  }

  public async unwrap(
    payer: anchor.web3.PublicKey,
    amount?: number,
    user?: Keypair
  ): Promise<TransactionSignature> {
    if (!this.address.equals(Mint.native)) {
      throw new NativeMintOnlyError();
    }

    const unwrapTxn = await this.unwrapInstruction(payer, amount, user);
    const txSignature = await this.signAndSend(unwrapTxn);
    return txSignature;
  }

  private async signAndSend(
    txn: TransactionObject,
    opts: anchor.web3.ConfirmOptions = {
      skipPreflight: false,
      maxRetries: 10,
    }
  ): Promise<TransactionSignature> {
    const blockhash = await this.connection.getLatestBlockhash();
    const txnSignature = await this.provider.sendAndConfirm(
      await this.provider.wallet.signTransaction(txn.toTxn(blockhash)),
      txn.signers,
      opts
    );
    return txnSignature;
  }
}
