import * as anchor from '@project-serum/anchor';
import * as errors from './errors';
import * as sbv2 from './accounts';
import {
  Cluster,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionSignature,
} from '@solana/web3.js';
import { Mint } from './mint';
import { TransactionObject } from './transaction';
import { SwitchboardEvents } from './switchboardEvents';

/**
 * Switchboard Devnet Program ID
 */
export const SBV2_DEVNET_PID = new PublicKey(
  '2TfB33aLaneQb5TNVwyDz3jSZXS6jdW2ARw1Dgf84XCG'
);
/**
 * Switchboard Mainnet Program ID
 */
export const SBV2_MAINNET_PID = new PublicKey(
  'SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f'
);
/**
 *  A generated keypair that is assigned as the _payerKeypair_ when in read-only mode.
 */
export const READ_ONLY_KEYPAIR = Keypair.generate();
/**
 * Returns the Switchboard Program ID for the specified Cluster.
 */
export const getSwitchboardProgramId = (
  cluster: Cluster | 'localnet'
): PublicKey => {
  switch (cluster) {
    case 'devnet':
      return SBV2_DEVNET_PID;
    case 'mainnet-beta':
      return SBV2_MAINNET_PID;
    case 'testnet':
    default:
      throw new Error(`Switchboard PID not found for cluster (${cluster})`);
  }
};
/**
 * Returns true if being run inside a web browser, false if in a Node process or electron app.
 *
 * Taken from @project-serum/anchor implementation.
 */
const isBrowser =
  process.env.ANCHOR_BROWSER ||
  (typeof window !== 'undefined' && !window.process?.hasOwnProperty('type')); // eslint-disable-line no-prototype-builtins

/**
 * Wrapper class for the Switchboard anchor Program.
 */
export class SwitchboardProgram {
  private static readonly _readOnlyKeypair = READ_ONLY_KEYPAIR;
  private readonly _program: anchor.Program;
  readonly cluster: Cluster | 'localnet';
  readonly programState: {
    publicKey: PublicKey;
    bump: number;
  };
  readonly mint: Mint;

  /**
   * Constructor.
   */
  constructor(
    program: anchor.Program,
    cluster: Cluster | 'localnet',
    mint: Mint
  ) {
    this._program = program;
    this.cluster = cluster;

    const stateAccount = sbv2.ProgramStateAccount.fromSeed(this);
    this.programState = {
      publicKey: stateAccount[0].publicKey,
      bump: stateAccount[1],
    };
    this.mint = mint;
  }

  static async loadAnchorProgram(
    cluster: Cluster | 'localnet',
    connection: Connection,
    payerKeypair: Keypair = READ_ONLY_KEYPAIR,
    programId: PublicKey = getSwitchboardProgramId(cluster)
  ): Promise<anchor.Program> {
    const provider = new anchor.AnchorProvider(
      connection,
      // If no keypair is provided, default to dummy keypair
      new AnchorWallet(payerKeypair ?? SwitchboardProgram._readOnlyKeypair),
      { commitment: 'confirmed' }
    );
    const anchorIdl = await anchor.Program.fetchIdl(programId, provider);
    if (!anchorIdl) {
      throw new Error(`Failed to find IDL for ${programId.toBase58()}`);
    }
    const program = new anchor.Program(anchorIdl, programId, provider);

    return program;
  }

  /**
   * Create and initialize a {@linkcode SwitchboardProgram} connection object.
   */
  static load = async (
    cluster: Cluster | 'localnet',
    connection: Connection,
    payerKeypair: Keypair = READ_ONLY_KEYPAIR,
    programId: PublicKey = getSwitchboardProgramId(cluster)
  ): Promise<SwitchboardProgram> => {
    const program = await SwitchboardProgram.loadAnchorProgram(
      cluster,
      connection,
      payerKeypair,
      programId
    );
    const mint = await Mint.load(program.provider as anchor.AnchorProvider);
    return new SwitchboardProgram(program, cluster, mint);
  };

  /**
   * The Switchboard Program ID for the currently connected cluster.
   */
  public get programId(): PublicKey {
    return this._program.programId;
  }
  /**
   * The Switchboard Program ID for the currently connected cluster.
   */
  public get idl(): anchor.Idl {
    return this._program.idl;
  }
  /**
   * The Switchboard Program ID for the currently connected cluster.
   */
  public get coder(): anchor.BorshAccountsCoder {
    return new anchor.BorshAccountsCoder(this._program.idl);
  }
  /**
   * The anchor Provider used by this program to connect with Solana cluster.
   */
  public get provider(): anchor.AnchorProvider {
    return this._program.provider as anchor.AnchorProvider;
  }
  /**
   * The Connection used by this program to connect with Solana cluster.
   */
  public get connection(): Connection {
    return this._program.provider.connection;
  }
  /**
   * The Connection used by this program to connect with Solana cluster.
   */
  public get wallet(): AnchorWallet {
    return this.provider.wallet as AnchorWallet;
  }

  public get walletPubkey(): PublicKey {
    return this.wallet.payer.publicKey;
  }
  /**
   * Some actions exposed by this SDK require that a payer Keypair has been
   * provided to {@linkcode SwitchboardProgram} in order to send transactions.
   */
  public get isReadOnly(): boolean {
    return (
      this.provider.publicKey.toBase58() ===
      SwitchboardProgram._readOnlyKeypair.publicKey.toBase58()
    );
  }

  public verifyPayer(): void {
    if (this.isReadOnly) {
      throw new errors.SwitchboardProgramReadOnlyError();
    }
  }

  public get account(): anchor.AccountNamespace {
    return this._program.account;
  }

  public addEventListener<EventName extends keyof SwitchboardEvents>(
    eventName: EventName,
    callback: (
      data: SwitchboardEvents[EventName],
      slot: number,
      signature: string
    ) => void
  ): number {
    return this._program.addEventListener(eventName, callback);
  }

  public async removeEventListener(listenerId: number) {
    return await this._program.removeEventListener(listenerId);
  }

  public async signAndSendAll(
    txns: Array<TransactionObject>,
    opts: anchor.web3.ConfirmOptions = {
      skipPreflight: false,
      maxRetries: 10,
    },
    blockhash?: { blockhash: string; lastValidBlockHeight: number }
  ): Promise<Array<TransactionSignature>> {
    if (isBrowser) throw new errors.SwitchboardProgramIsBrowserError();
    if (this.isReadOnly) throw new errors.SwitchboardProgramReadOnlyError();

    const packed = TransactionObject.pack(txns);

    const txnSignatures: Array<TransactionSignature> = [];
    for await (const txn of packed) {
      txnSignatures.push(await this.signAndSend(txn, opts, blockhash));
    }

    return txnSignatures;
  }

  public async signAndSend(
    txn: TransactionObject,
    opts: anchor.web3.ConfirmOptions = {
      skipPreflight: false,
      maxRetries: 10,
    },
    blockhash?: { blockhash: string; lastValidBlockHeight: number }
  ): Promise<TransactionSignature> {
    if (isBrowser) throw new errors.SwitchboardProgramIsBrowserError();
    if (this.isReadOnly) throw new errors.SwitchboardProgramReadOnlyError();

    // filter extra signers
    const signers = [this.wallet.payer, ...txn.signers];
    const reqSigners = txn.ixns.reduce((signers, ixn) => {
      ixn.keys.map(a => {
        if (a.isSigner) {
          signers.add(a.pubkey.toBase58());
        }
      });
      return signers;
    }, new Set<string>());
    const filteredSigners = signers.filter(
      s =>
        s.publicKey.equals(txn.payer) || reqSigners.has(s.publicKey.toBase58())
    );

    const txnSignature = await this.provider.sendAndConfirm(
      txn.toTxn(blockhash ?? (await this.connection.getLatestBlockhash())),
      filteredSigners,
      {
        skipPreflight: false,
        maxRetries: 10,
        ...opts,
      }
    );

    return txnSignature;
  }
}

export class AnchorWallet implements anchor.Wallet {
  constructor(readonly payer: Keypair) {
    this.payer = payer;
  }
  get publicKey(): PublicKey {
    return this.payer.publicKey;
  }
  private sign = (txn: Transaction): Transaction => {
    txn.partialSign(this.payer);
    return txn;
  };
  async signTransaction(txn: Transaction) {
    return this.sign(txn);
  }
  async signAllTransactions(txns: Transaction[]) {
    return txns.map(this.sign);
  }
}
