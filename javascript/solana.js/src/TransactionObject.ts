import * as errors from './errors';
import _ from 'lodash';
import {
  ComputeBudgetProgram,
  Keypair,
  NonceInformation,
  PACKET_DATA_SIZE,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';

export interface ITransactionObject extends Required<TransactionObjectOptions> {
  /** The public key of the account that will pay the transaction fees */
  payer: PublicKey;
  /** An array of TransactionInstructions that will be added to the transaction */
  ixns: Array<TransactionInstruction>;
  /** An array of signers used to sign the transaction before sending. This may not include the payer keypair for web wallet support */
  signers: Array<Keypair>;
}

export interface TransactionObjectOptions {
  enableDurableNonce?: boolean;
  computeUnitPrice?: number;
  computeUnitLimit?: number;
}

export type TransactionPackOptions = TransactionObjectOptions & {
  // instructions to be added first in all txns
  preIxns?: Array<TransactionInstruction>;
  // instructions to be added last in all txns
  postIxns?: Array<TransactionInstruction>;
};

/**
 Compare two instructions to see if a transaction already includes a given type of instruction. Does not compare if the ixn has the same data.
 */
export const ixnsEqual = (
  a: TransactionInstruction,
  b: TransactionInstruction
): boolean => {
  return (
    a.programId.equals(b.programId) &&
    a.keys.length === b.keys.length &&
    JSON.stringify(a) === JSON.stringify(b) &&
    a.data.length === b.data.length
  );
};

/**
 Compare two instructions to see if a transaction already includes a given type of instruction. Returns false if the ixn data is different.
 */
export const ixnsDeepEqual = (
  a: TransactionInstruction,
  b: TransactionInstruction
): boolean => {
  return ixnsEqual(a, b) && Buffer.compare(a.data, b.data) === 0;
};

export type TransactionOptions =
  | {
      blockhash: string;
      lastValidBlockHeight: number;
    }
  | {
      nonceInfo: NonceInformation;
      minContextSlot: number;
    };

export class TransactionObject implements ITransactionObject {
  enableDurableNonce: boolean;
  computeUnitPrice: number;
  computeUnitLimit: number;

  payer: PublicKey;
  ixns: Array<TransactionInstruction>;
  signers: Array<Keypair>;

  /** Return the number of instructions, including the durable nonce placeholder if enabled */
  get length(): number {
    return this.enableDurableNonce ? this.ixns.length + 1 : this.ixns.length;
  }

  constructor(
    payer: PublicKey,
    ixns: Array<TransactionInstruction>,
    signers: Array<Keypair>,
    options?: TransactionObjectOptions
  ) {
    this.payer = payer;

    this.signers = signers;

    this.enableDurableNonce = options?.enableDurableNonce ?? false;
    this.computeUnitPrice = options?.computeUnitPrice ?? 0;
    this.computeUnitLimit = options?.computeUnitLimit ?? 0;

    const instructions = [...ixns];

    const computeLimitIxn = TransactionObject.getComputeUnitLimitIxn(
      options?.computeUnitLimit
    );
    if (
      computeLimitIxn !== undefined &&
      instructions.findIndex(ixn => ixnsEqual(ixn, computeLimitIxn)) === -1
    ) {
      instructions.unshift(computeLimitIxn);
    }

    const priorityTxn = TransactionObject.getComputeUnitPriceIxn(
      options?.computeUnitPrice
    );
    if (
      priorityTxn !== undefined &&
      instructions.findIndex(ixn => ixnsEqual(ixn, priorityTxn)) === -1
    ) {
      instructions.unshift(priorityTxn);
    }

    this.ixns = instructions;

    this.verify();
  }

  /** Build a new transaction with options */
  private static new(
    payer: PublicKey,
    options?: TransactionObjectOptions & {
      // instructions to be added first in the new txn
      preIxns?: Array<TransactionInstruction>;
      // instructions to be added last in the new txn
      postIxns?: Array<TransactionInstruction>;
    }
  ): TransactionObject {
    const preIxns = options?.preIxns ?? [];
    const postIxns = options?.postIxns ?? [];
    return new TransactionObject(payer, [...preIxns, ...postIxns], [], options);
  }

  verify() {
    return TransactionObject.verify(
      this.payer,
      this.ixns,
      this.signers,
      this.enableDurableNonce
    );
  }

  static getComputeUnitLimitIxn(
    computeUnitLimit?: number
  ): TransactionInstruction | undefined {
    if (computeUnitLimit && computeUnitLimit > 0) {
      return ComputeBudgetProgram.setComputeUnitLimit({
        units: computeUnitLimit,
      });
    }

    return undefined;
  }

  static getComputeUnitPriceIxn(
    computeUnitPrice?: number
  ): TransactionInstruction | undefined {
    if (computeUnitPrice && computeUnitPrice > 0) {
      return ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: computeUnitPrice,
      });
    }

    return undefined;
  }

  /**
   * Append instructions to the beginning of a TransactionObject
   */
  public unshift(
    ixn: TransactionInstruction | Array<TransactionInstruction>,
    signers?: Array<Keypair>
  ): TransactionObject {
    const newIxns = [...this.ixns];
    if (Array.isArray(ixn)) {
      newIxns.unshift(...ixn);
    } else {
      newIxns.unshift(ixn);
    }
    const newSigners = [...this.signers];
    if (signers) {
      signers.forEach(s => {
        if (
          newSigners.findIndex(signer =>
            signer.publicKey.equals(s.publicKey)
          ) === -1
        ) {
          newSigners.push(s);
        }
      });
    }
    TransactionObject.verify(
      this.payer,
      newIxns,
      newSigners,
      this.enableDurableNonce
    );
    this.ixns = newIxns;
    this.signers = newSigners;
    return this;
  }

  public insert(
    ixn: TransactionInstruction,
    index: number,
    signers?: Array<Keypair>
  ) {
    const newIxns: Array<TransactionInstruction> = [...this.ixns];
    newIxns.splice(index, 0, ixn);
    const newSigners = [...this.signers];
    if (signers) {
      signers.forEach(s => {
        if (
          newSigners.findIndex(signer =>
            signer.publicKey.equals(s.publicKey)
          ) === -1
        ) {
          newSigners.push(s);
        }
      });
    }
    TransactionObject.verify(
      this.payer,
      newIxns,
      newSigners,
      this.enableDurableNonce
    );
    this.ixns = newIxns;
    this.signers = newSigners;
    return this;
  }

  /**
   * Append instructions to the end of a TransactionObject
   */
  public add(
    ixn: TransactionInstruction | Array<TransactionInstruction>,
    signers?: Array<Keypair>
  ): TransactionObject {
    const newIxns = [...this.ixns];
    if (Array.isArray(ixn)) {
      newIxns.push(...ixn);
    } else {
      newIxns.push(ixn);
    }
    const newSigners = [...this.signers];
    if (signers) {
      signers.forEach(s => {
        if (
          newSigners.findIndex(signer =>
            signer.publicKey.equals(s.publicKey)
          ) === -1
        ) {
          newSigners.push(s);
        }
      });
    }
    TransactionObject.verify(
      this.payer,
      newIxns,
      newSigners,
      this.enableDurableNonce
    );
    this.ixns = newIxns;
    this.signers = newSigners;
    return this;
  }

  /**
   * Verify a transaction object has less than 10 instructions, less than 1232 bytes, and contains all required signers minus the payer
   * @throws if more than 10 instructions, serialized size is greater than 1232 bytes, or if object is missing a required signer minus the payer
   */
  public static verify(
    payer: PublicKey,
    ixns: Array<TransactionInstruction>,
    signers: Array<Keypair>,
    enableDurableNonce: boolean
  ) {
    // verify payer is not default pubkey
    if (payer.equals(PublicKey.default)) {
      throw new errors.SwitchboardProgramReadOnlyError();
    }

    const ixnLength = enableDurableNonce ? ixns.length + 1 : ixns.length;

    // if empty object, return
    if (ixnLength === 0) {
      return;
    }

    // verify num ixns
    if (ixnLength > 10) {
      throw new errors.TransactionInstructionOverflowError(ixnLength);
    }

    const padding: number = enableDurableNonce ? 96 : 0;

    // verify serialized size
    const size = TransactionObject.size(ixns);
    if (size > PACKET_DATA_SIZE - padding) {
      throw new errors.TransactionSerializationOverflowError(size);
    }

    // verify signers
    TransactionObject.verifySigners(payer, ixns, signers);
  }

  /**
   * Return the serialized size of an array of TransactionInstructions
   */
  public static size(ixns: Array<TransactionInstruction>) {
    const encodeLength = (len: number) => {
      const bytes = new Array<number>();
      let remLen = len;
      for (;;) {
        let elem = remLen & 0x7f;
        remLen >>= 7;
        if (remLen === 0) {
          bytes.push(elem);
          break;
        } else {
          elem |= 0x80;
          bytes.push(elem);
        }
      }
      return bytes;
    };

    const reqSigners = ixns.reduce((signers, ixn) => {
      ixn.keys.map(a => {
        if (a.isSigner) {
          signers.add(a.pubkey.toBase58());
        }
      });
      return signers;
    }, new Set<string>());

    const txn = new Transaction({
      feePayer: PublicKey.default,
      blockhash: '1'.repeat(32),
      lastValidBlockHeight: 200000000,
    }).add(...ixns);

    const txnSize =
      txn.serializeMessage().length +
      reqSigners.size * 64 +
      encodeLength(reqSigners.size).length;

    return txnSize;
  }

  get size(): number {
    return TransactionObject.size(this.ixns);
  }

  /**
   * Try to combine two {@linkcode TransactionObject}'s
   * @throws if verification fails. See TransactionObject.verify
   */
  public combine(otherObject: TransactionObject): TransactionObject {
    if (!this.payer.equals(otherObject.payer)) {
      throw new Error(`Cannot combine transactions with different payers`);
    }
    return this.add(otherObject.ixns, otherObject.signers);
  }

  private static verifySigners(
    payer: PublicKey,
    ixns: Array<TransactionInstruction>,
    signers: Array<Keypair>
  ) {
    // get all required signers
    const reqSigners = ixns.reduce((signers, ixn) => {
      ixn.keys.map(a => {
        if (a.isSigner) {
          signers.add(a.pubkey.toBase58());
        }
      });
      return signers;
    }, new Set<string>());

    if (reqSigners.has(payer.toBase58())) {
      reqSigners.delete(payer.toBase58());
    }

    signers.forEach(s => {
      if (reqSigners.has(s.publicKey.toBase58())) {
        reqSigners.delete(s.publicKey.toBase58());
      }
    });

    if (reqSigners.size > 0) {
      throw new errors.TransactionMissingSignerError(Array.from(reqSigners));
    }
  }

  /**
   * Convert the TransactionObject into a Solana Transaction
   */
  public toTxn(options: TransactionOptions): Transaction {
    if ('nonceInfo' in options) {
      const txn = new Transaction({
        feePayer: this.payer,
        nonceInfo: options.nonceInfo,
        minContextSlot: options.minContextSlot,
      }).add(...this.ixns);
      return txn;
    }

    const txn = new Transaction({
      feePayer: this.payer,
      blockhash: options.blockhash,
      lastValidBlockHeight: options.lastValidBlockHeight,
    }).add(...this.ixns);
    return txn;
  }

  /**
   * Return a Transaction signed by the provided signers
   */
  public sign(
    options: TransactionOptions,
    signers?: Array<Keypair>
  ): Transaction {
    const txn = this.toTxn(options);
    const allSigners = [...this.signers];

    if (signers) {
      allSigners.push(...signers);
    }

    if (allSigners.length) {
      txn.sign(...allSigners);
    }

    return txn;
  }

  /**
   * Pack an array of TransactionObject's into as few transactions as possible.
   */
  public static pack(
    _txns: Array<TransactionObject>,
    options?: TransactionPackOptions
  ): Array<TransactionObject> {
    const txns = [..._txns];
    if (txns.length === 0) {
      throw new Error(`No transactions to pack`);
    }

    const payers = Array.from(
      txns
        .reduce((payers, txn) => {
          payers.add(txn.payer.toBase58());
          return payers;
        }, new Set<string>())
        .values()
    );

    if (payers.length > 1) {
      throw new Error(`Packed transactions should have the same payer`);
    }
    const payer = new PublicKey(payers.shift()!);

    const signers: Array<Keypair> = _.flatten(txns.map(t => t.signers));
    const ixns: Array<TransactionInstruction> = _.flatten(
      txns.map(t => t.ixns)
    );

    return TransactionObject.packIxns(payer, ixns, signers, options);
  }

  /**
   * Pack an array of TransactionInstructions into as few transactions as possible. Assumes only a single signer
   */
  public static packIxns(
    payer: PublicKey,
    _ixns: Array<TransactionInstruction>,
    signers?: Array<Keypair>,
    options?: TransactionPackOptions
  ): Array<TransactionObject> {
    const ixns = [..._ixns];
    const txns: Array<TransactionObject> = [];

    let txn = TransactionObject.new(payer, options);
    while (ixns.length) {
      const ixn = ixns.shift()!;
      const reqSigners = filterSigners(payer, ixn, signers ?? []);
      try {
        txn.insert(
          ixn,
          txn.ixns.length - (options?.postIxns?.length ?? 0),
          reqSigners
        );
      } catch {
        txns.push(txn);
        txn = TransactionObject.new(payer, options);
        txn.insert(
          ixn,
          txn.ixns.length - (options?.postIxns?.length ?? 0),
          reqSigners
        );
      }
    }

    txns.push(txn);
    return txns;
  }
}

function filterSigners(
  payer: PublicKey,
  ixn: TransactionInstruction,
  signers: Array<Keypair>
) {
  const filteredSigners: Array<Keypair> = [];

  const reqSigners = ixn.keys.reduce((signers, accountMeta) => {
    if (accountMeta.isSigner && !accountMeta.pubkey.equals(payer)) {
      signers.add(accountMeta.pubkey.toBase58());
    }
    return signers;
  }, new Set<string>());

  for (const reqSigner of reqSigners) {
    const filteredKeypairs = signers.filter(
      s => s.publicKey.toBase58() === reqSigner
    );
    if (filteredKeypairs.length === 0) {
      throw new errors.TransactionMissingSignerError(Array.from(reqSigner));
    }
    filteredSigners.push(filteredKeypairs.shift()!);
  }

  return filteredSigners;
}
