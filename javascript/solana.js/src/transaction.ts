import * as errors from './errors';
import {
  Keypair,
  PACKET_DATA_SIZE,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';

export interface ITransactionObject {
  ixns: Array<TransactionInstruction>;
  signers: Array<Keypair>;
}

export class TransactionObject implements ITransactionObject {
  payer: PublicKey;
  ixns: Array<TransactionInstruction>;
  signers: Array<Keypair>;

  constructor(
    payer: PublicKey,
    ixns: Array<TransactionInstruction>,
    signers: Array<Keypair>
  ) {
    this.payer = payer;
    this.ixns = ixns;
    this.signers = signers;

    TransactionObject.verify(payer, ixns, signers);
  }

  add(
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
    TransactionObject.verify(this.payer, newIxns, newSigners);
    this.ixns = newIxns;
    this.signers = newSigners;
    return this;
  }

  static verify(
    payer: PublicKey,
    ixns: Array<TransactionInstruction>,
    signers: Array<Keypair>
  ) {
    // verify num ixns
    if (ixns.length > 10) {
      throw new errors.TransactionInstructionOverflowError(ixns.length);
    }

    // verify serialized size
    const size = TransactionObject.size(ixns);
    if (size > PACKET_DATA_SIZE) {
      throw new errors.TransactionSerializationOverflowError(size);
    }

    // verify signers
    TransactionObject.verifySigners(payer, ixns, signers);
  }

  static size(ixns: Array<TransactionInstruction>) {
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

    // console.log(`txnSize: ${txnSize}`);
    return txnSize;
  }

  size(): number {
    return TransactionObject.size(this.ixns);
  }

  combine(otherObject: TransactionObject): TransactionObject {
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

  public toTxn(blockhash: {
    blockhash: string;
    lastValidBlockHeight: number;
  }): Transaction {
    const txn = new Transaction({
      feePayer: this.payer,
      blockhash: blockhash.blockhash,
      lastValidBlockHeight: blockhash.lastValidBlockHeight,
    }).add(...this.ixns);
    return txn;
  }

  public sign(
    blockhash: { blockhash: string; lastValidBlockHeight: number },
    signers?: Array<Keypair>
  ): Transaction {
    const txn = this.toTxn(blockhash);
    const allSigners = [...this.signers];
    if (signers) {
      allSigners.push(...signers);
    }
    txn.sign(...allSigners);
    return txn;
  }

  public static pack(
    _txns: Array<TransactionObject>
  ): Array<TransactionObject> {
    const txns = [..._txns];
    if (txns.length === 0) {
      throw new Error(`No transactions to pack`);
    }

    const packed: Array<TransactionObject> = [];

    let txn = txns.shift()!;
    while (txns.length) {
      const otherTxn = txns.shift()!;
      try {
        txn = txn.combine(otherTxn);
      } catch (error) {
        packed.push(txn);
        txn = otherTxn;
      }
    }
    packed.push(txn);
    return packed;
  }
}
