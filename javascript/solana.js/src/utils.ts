import * as anchor from '@project-serum/anchor';
import { InstructionsPackingError } from './errors';

export function packInstructions(
  instructions: (
    | anchor.web3.TransactionInstruction
    | anchor.web3.TransactionInstruction[]
  )[],
  latestBlockhash: anchor.web3.BlockhashWithExpiryBlockHeight,
  feePayer = anchor.web3.PublicKey.default
): anchor.web3.Transaction[] {
  // Constructs a new Transaction.
  function buildNewTransaction(
    ixns: anchor.web3.TransactionInstruction[]
  ): anchor.web3.Transaction {
    return new anchor.web3.Transaction({
      ...latestBlockhash,
      feePayer,
    }).add(...ixns);
  }

  function getTxnSize(transaction: anchor.web3.Transaction) {
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

    try {
      return (
        transaction.serializeMessage().length +
        transaction.signatures.length * 64 +
        encodeLength(transaction.signatures.length).length
      );
    } catch (err) {
      return Number.MAX_SAFE_INTEGER;
    }
  }

  const packed: anchor.web3.Transaction[] = [];
  let currentTransaction = buildNewTransaction([]);
  const emptyTxSize = getTxnSize(currentTransaction);
  instructions
    .map(ixGroup => (Array.isArray(ixGroup) ? ixGroup : [ixGroup]))
    .forEach(ixGroup => {
      // Build a new transaction with this ixGroup for comparison.
      const newTransaction = buildNewTransaction(ixGroup);
      // Size of the new TXN - size of an empty TXN should ~= size of the ixGroup data.
      const newIxGroupSize = getTxnSize(newTransaction) - emptyTxSize;
      if (
        anchor.web3.PACKET_DATA_SIZE >=
        getTxnSize(currentTransaction) + newIxGroupSize
      ) {
        // If `newTransaction` can be added to current transaction, do so.
        currentTransaction.add(...newTransaction.instructions);
      } else if (anchor.web3.PACKET_DATA_SIZE <= getTxnSize(newTransaction)) {
        // If `newTransaction` is too large to fit in a transaction, throw an error.
        throw new InstructionsPackingError();
      } else {
        // If `newTransaction` cannot be added to `currentTransaction`, push `currentTransaction` and move forward.
        packed.push(currentTransaction);
        currentTransaction = newTransaction;
      }
    });
  // If the final transaction has at least 1 instruction, add it to the pack.
  if (currentTransaction.instructions.length) packed.push(currentTransaction);
  return packed;
}
