/* eslint-disable no-unused-vars */
import "mocha";

import type { TransactionObjectOptions } from "../src/index.js";
import { ixnsDeepEqual, ixnsEqual, TransactionObject } from "../src/index.js";

import type { TestContext } from "./utils.js";
import { setupTest } from "./utils.js";

import type {
  AccountMeta,
  Connection,
  NonceAccount,
  NonceInformation,
  RpcResponseAndContext,
} from "@solana/web3.js";
import {
  Keypair,
  NONCE_ACCOUNT_LENGTH,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import assert from "assert";

const getNonceAccount = async (
  connection: Connection,
  pubkey: PublicKey
): Promise<RpcResponseAndContext<NonceAccount>> => {
  const nonceInfoResponse = await connection.getNonceAndContext(pubkey);

  if (nonceInfoResponse.value === null) {
    throw new Error(`NonceAccount not found`);
  }

  return nonceInfoResponse as RpcResponseAndContext<NonceAccount>;
};

const getNonceIxn = (
  connection: Connection,
  payer: PublicKey,
  pubkey: PublicKey
): TransactionInstruction => {
  return SystemProgram.nonceAdvance({
    noncePubkey: pubkey,
    authorizedPubkey: payer,
  });
};

const getNonceInfo = async (
  connection: Connection,
  payer: PublicKey,
  pubkey: PublicKey
): Promise<NonceInformation> => {
  const advanceNonce = getNonceIxn(connection, payer, pubkey);
  const nonceAccount = await getNonceAccount(connection, pubkey);
  return {
    nonce: nonceAccount.value.nonce,
    nonceInstruction: advanceNonce,
  };
};

const createDummyIxn = (
  numKeys: number,
  dataLen = 0
): TransactionInstruction => {
  return new TransactionInstruction({
    keys: Array.from(new Array(numKeys)).map((): AccountMeta => {
      return {
        isSigner: false,
        isWritable: false,
        pubkey: PublicKey.default,
      };
    }),
    programId: PublicKey.default,
    data: Buffer.from(new Array(dataLen + 1).join("X")),
  });
};

describe("TransactionObject Tests", () => {
  let ctx: TestContext;

  const nonceAccountKeypair = Keypair.generate();
  let nonceAccount: NonceAccount;
  let nonceInfo: NonceInformation;

  before(async () => {
    ctx = await setupTest();

    const nonceInitTxn = SystemProgram.createNonceAccount({
      fromPubkey: ctx.payer.publicKey,
      noncePubkey: nonceAccountKeypair.publicKey,
      authorizedPubkey: ctx.payer.publicKey,
      lamports: await ctx.program.connection.getMinimumBalanceForRentExemption(
        NONCE_ACCOUNT_LENGTH
      ),
    });

    const nonceInit = new TransactionObject(
      ctx.payer.publicKey,
      nonceInitTxn.instructions,
      [nonceAccountKeypair]
    );
    await ctx.program.signAndSend(nonceInit);

    const nonceAccountResponse = await getNonceAccount(
      ctx.program.connection,
      nonceAccountKeypair.publicKey
    );
    nonceAccount = nonceAccountResponse.value;
    nonceInfo = await getNonceInfo(
      ctx.program.connection,
      ctx.payer.publicKey,
      nonceAccountKeypair.publicKey
    );
  });

  it("Compares two instructions for equality", async () => {
    const setComputeIxn1 = TransactionObject.getComputeUnitLimitIxn(100000)!;
    const setComputeIxn2 = TransactionObject.getComputeUnitLimitIxn(100000)!;
    assert(
      ixnsEqual(setComputeIxn1, setComputeIxn2),
      `Expected instructions to be equal`
    );

    const advanceNonce = getNonceIxn(
      ctx.program.connection,
      ctx.payer.publicKey,
      nonceAccountKeypair.publicKey
    );
    const nonceInfo = await getNonceInfo(
      ctx.program.connection,
      ctx.payer.publicKey,
      nonceAccountKeypair.publicKey
    );

    assert(
      ixnsEqual(advanceNonce, nonceInfo.nonceInstruction),
      `Expected instructions to be equal`
    );
  });

  it("Fails to add a duplicate nonce ixn", async () => {
    const advanceNonce = getNonceIxn(
      ctx.program.connection,
      ctx.payer.publicKey,
      nonceAccountKeypair.publicKey
    );

    const txn = new TransactionObject(ctx.payer.publicKey, [advanceNonce], [], {
      enableDurableNonce: true,
    });
    assert(
      txn.ixns.length === 1,
      `Transaction Object length mismatch, expected ${1}, received ${
        txn.ixns.length
      }`
    );
  });

  it("Creates a txn object with options", async () => {
    const ixns = [
      createDummyIxn(5),
      createDummyIxn(3, 64),
      createDummyIxn(8, 32),
      createDummyIxn(2),
    ];

    const txn = new TransactionObject(ctx.payer.publicKey, ixns, [], {
      enableDurableNonce: true,
      computeUnitLimit: 200000,
      computeUnitPrice: 10000,
    });
    assert(
      txn.length === ixns.length + 3,
      `Transaction Object length mismatch, expected ${
        ixns.length + 3
      }, received ${txn.length}`
    );
  });

  // it('Creates a transaction object with signers', async () => {
  //   // const ixn =
  // });

  it("Fails to create a txn object with options if too big", async () => {
    const ixns = [
      createDummyIxn(5),
      createDummyIxn(3, 64),
      createDummyIxn(8, 32),
      createDummyIxn(2),
      createDummyIxn(5),
      createDummyIxn(3, 64),
      createDummyIxn(8, 32),
      createDummyIxn(2),
      createDummyIxn(5),
      createDummyIxn(3, 64),
      createDummyIxn(8, 32),
      createDummyIxn(2),
    ];

    assert.throws(() => {
      new TransactionObject(ctx.payer.publicKey, ixns, [], {
        enableDurableNonce: true,
        computeUnitLimit: 200000,
        computeUnitPrice: 10000,
      });
    }, `Did not throw`);
  });

  it("Packs transactions with options", async () => {
    const options: TransactionObjectOptions = {
      computeUnitLimit: 200000,
      computeUnitPrice: 10000,
    };

    const computeUnitLimitIxn = TransactionObject.getComputeUnitLimitIxn(
      options.computeUnitLimit!
    )!;
    const priorityIxn = TransactionObject.getComputeUnitPriceIxn(
      options.computeUnitPrice!
    )!;

    const txns = [
      new TransactionObject(
        ctx.payer.publicKey,
        [
          createDummyIxn(5),
          createDummyIxn(3, 64),
          createDummyIxn(8, 32),
          createDummyIxn(2),
          createDummyIxn(8, 32),
          createDummyIxn(2),
        ],
        []
      ),
      new TransactionObject(ctx.payer.publicKey, [createDummyIxn(5)], []),
      new TransactionObject(ctx.payer.publicKey, [createDummyIxn(5)], []),
      new TransactionObject(
        ctx.payer.publicKey,
        [createDummyIxn(3, 64), createDummyIxn(5)],
        []
      ),
      new TransactionObject(
        ctx.payer.publicKey,
        [
          createDummyIxn(5),
          createDummyIxn(3, 64),
          createDummyIxn(8, 32),
          createDummyIxn(2),
          createDummyIxn(8, 32),
          createDummyIxn(2),
        ],
        []
      ),
      new TransactionObject(ctx.payer.publicKey, [createDummyIxn(5)], []),
      new TransactionObject(ctx.payer.publicKey, [createDummyIxn(5)], []),
      new TransactionObject(
        ctx.payer.publicKey,
        [
          createDummyIxn(3, 64),
          createDummyIxn(5),
          createDummyIxn(3, 64),
          createDummyIxn(8, 32),
        ],
        []
      ),
      new TransactionObject(
        ctx.payer.publicKey,
        [
          createDummyIxn(5),
          createDummyIxn(3, 64),
          createDummyIxn(8, 32),
          createDummyIxn(2),
          createDummyIxn(8, 32),
          createDummyIxn(2),
        ],
        []
      ),
      new TransactionObject(
        ctx.payer.publicKey,
        [createDummyIxn(5), createDummyIxn(3, 64), createDummyIxn(8, 32)],
        []
      ),
      new TransactionObject(ctx.payer.publicKey, [createDummyIxn(5)], []),
      new TransactionObject(
        ctx.payer.publicKey,
        [
          createDummyIxn(3, 64),
          createDummyIxn(5),
          createDummyIxn(3, 64),
          createDummyIxn(8, 32),
        ],
        []
      ),
      new TransactionObject(
        ctx.payer.publicKey,
        [
          createDummyIxn(3, 64),
          createDummyIxn(5),
          createDummyIxn(3, 64),
          createDummyIxn(8, 32),
          createDummyIxn(5),
          createDummyIxn(3, 64),
          createDummyIxn(8, 32),
        ],
        []
      ),
      new TransactionObject(
        ctx.payer.publicKey,
        [
          createDummyIxn(3, 64),
          createDummyIxn(5),
          createDummyIxn(5),
          createDummyIxn(3, 64),
          createDummyIxn(8, 32),
        ],
        []
      ),
    ];

    const packed = TransactionObject.pack(txns, options);
    assert(
      packed.length > 0,
      `Failed to pack transactions, received empty array`
    );

    for (const txn of packed) {
      assert(
        ixnsDeepEqual(txn.ixns[0], priorityIxn),
        `Expected the first instruction to be setComputeUnitPrice`
      );
      assert(
        ixnsDeepEqual(txn.ixns[1], computeUnitLimitIxn),
        `Expected the second instruction to be setComputeUnitLimit`
      );
    }
  });

  it("Packs transactions and adds a preIxn and postIxn to each new transaction", async () => {
    const preIxn = createDummyIxn(6, 96);
    const postIxn1 = createDummyIxn(4, 48);
    const postIxn2 = createDummyIxn(3, 24);
    const ixns = [
      createDummyIxn(5),
      createDummyIxn(3, 64),
      createDummyIxn(8, 32),
      createDummyIxn(2),
    ];

    const packed = TransactionObject.packIxns(
      ctx.payer.publicKey,
      [
        createDummyIxn(5),
        createDummyIxn(3, 64),
        createDummyIxn(8, 32),
        createDummyIxn(2),
        createDummyIxn(5),
        createDummyIxn(3, 64),
        createDummyIxn(8, 32),
        createDummyIxn(2),
        createDummyIxn(5),
        createDummyIxn(3, 64),
        createDummyIxn(8, 32),
        createDummyIxn(2),
      ],
      undefined,
      {
        preIxns: [preIxn],
        postIxns: [postIxn1, postIxn2],
      }
    );
    for (const tx of packed) {
      assert(
        tx.ixns.length > 3,
        `Expected packed ixn to be greater than 3 ixns`
      );

      const firstIxn = tx.ixns.shift()!;
      assert(
        ixnsDeepEqual(preIxn, firstIxn),
        `Expected preIxn to be first instruction in txn`
      );

      const expectedPostIxn2 = tx.ixns.pop()!;
      assert(
        ixnsDeepEqual(postIxn2, expectedPostIxn2),
        `Expected postIxn2 to be last instruction in txn`
      );

      const expectedPostIxn1 = tx.ixns.pop()!;
      assert(
        ixnsDeepEqual(postIxn1, expectedPostIxn1),
        `Expected postIxn1 to be second to last instruction in txn`
      );
    }
  });
});
