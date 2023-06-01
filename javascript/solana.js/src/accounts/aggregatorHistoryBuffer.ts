import * as errors from "../errors.js";
import * as types from "../generated/index.js";
import { SwitchboardProgram } from "../SwitchboardProgram.js";
import {
  SendTransactionObjectOptions,
  TransactionObject,
  TransactionObjectOptions,
} from "../TransactionObject.js";

import {
  Account,
  BUFFER_DISCRIMINATOR,
  OnAccountChangeCallback,
} from "./account.js";
import { AggregatorAccount } from "./aggregatorAccount.js";

import {
  Commitment,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionSignature,
} from "@solana/web3.js";
import { Big, BN } from "@switchboard-xyz/common";

export interface AggregatorHistoryInit {
  /** Aggregator account to add a history buffer for. */
  aggregatorAccount: AggregatorAccount;
  /** Maximum number of samples to store in a round robin history buffer. */
  maxSamples: number;
  /** Alternative keypair that is the authority for the aggregatorAccount and authorized to add a historyBuffer. */
  aggregatorAuthority?: Keypair;
  /** Existing keypair to create the history buffer for. Must be a fresh keypair not tied to an existing on-chain account. */
  keypair?: Keypair;
}

/**
 * Account type representing a round robin buffer of historical samples.
 *
 * Data: Array<{@linkcode types.AggregatorHistoryRow}>
 */
export class AggregatorHistoryBuffer extends Account<
  Array<types.AggregatorHistoryRow>
> {
  static accountName = "AggregatorHistoryBuffer";

  public size = 28;

  public static getAccountSize(size: number): number {
    return 12 + size * 28;
  }

  /** Return a history buffer account initialized to the default values. */
  public static default(size = 1000): Buffer {
    const buffer = Buffer.alloc(
      AggregatorHistoryBuffer.getAccountSize(size),
      0
    );
    BUFFER_DISCRIMINATOR.copy(buffer, 0);
    return buffer;
  }

  /**
   * Decode an aggregators history buffer and return an array of historical samples in ascending order by timestamp.
   * @params historyBuffer the historyBuffer AccountInfo stored on-chain
   * @return the array of {@linkcode types.AggregatorHistoryRow} samples
   */
  public static decode(
    historyBuffer: Buffer,
    startTimestamp?: number,
    endTimestamp?: number
  ): Array<types.AggregatorHistoryRow> {
    const ROW_SIZE = 28;

    if (historyBuffer.length < 12) {
      return [];
    }

    const insertIdx = historyBuffer.readUInt32LE(8) * ROW_SIZE;

    const front: Array<types.AggregatorHistoryRow> = [];
    const tail: Array<types.AggregatorHistoryRow> = [];

    const buffer = historyBuffer.slice(12);

    for (let i = 0; i < buffer.length; i += ROW_SIZE) {
      if (i + ROW_SIZE > buffer.length) {
        break;
      }

      const row = types.AggregatorHistoryRow.fromDecoded(
        types.AggregatorHistoryRow.layout().decode(buffer, i)
      );

      if (row.timestamp.eq(new BN(0))) {
        break;
      }

      if (startTimestamp && startTimestamp > row.timestamp.toNumber()) {
        continue;
      }

      if (endTimestamp && endTimestamp < row.timestamp.toNumber()) {
        continue;
      }

      if (i <= insertIdx) {
        tail.push(row);
      } else {
        front.push(row);
      }
    }

    return front.concat(tail);
  }

  /**
   * Return an aggregator's assigned history buffer or undefined if it doesn't exist.
   */
  static fromAggregator(
    program: SwitchboardProgram,
    aggregator: types.AggregatorAccountData
  ): AggregatorHistoryBuffer | undefined {
    if (aggregator.historyBuffer.equals(PublicKey.default)) {
      return undefined;
    }

    return new AggregatorHistoryBuffer(program, aggregator.historyBuffer);
  }

  /**
   * Decode an aggregators history buffer and return an array of historical samples
   * @params historyBuffer the historyBuffer AccountInfo stored on-chain
   * @return the array of {@linkcode types.AggregatorHistoryRow} samples
   */
  public decode(
    historyBuffer: Buffer,
    startTimestamp?: number,
    endTimestamp?: number
  ): Array<types.AggregatorHistoryRow> {
    return AggregatorHistoryBuffer.decode(
      historyBuffer,
      startTimestamp,
      endTimestamp
    );
  }

  /**
   * Fetch an aggregator's history with the max size of the buffer.
   *
   * Does not throw, will return an empty array and a maxSize of 0 if a buffer is not set.
   *
   * @param program The SwitchboardProgram.
   * @param historyBufferPubkey The pubkey of the history buffer
   * @return an object containing the maxSize of the buffer and the array of {@linkcode types.AggregatorHistoryRow} samples
   */
  public static async loadHistoryWithSize(
    program: SwitchboardProgram,
    historyBufferPubkey: PublicKey
  ): Promise<{ maxSize: number; history: Array<types.AggregatorHistoryRow> }> {
    if (historyBufferPubkey.equals(PublicKey.default)) {
      return { history: [], maxSize: 0 };
    }

    const accountInfo = await program.connection.getAccountInfo(
      historyBufferPubkey
    );
    if (!accountInfo?.data.byteLength) {
      return { history: [], maxSize: 0 };
    }
    const maxSize = Math.floor((accountInfo.data.byteLength - 12) / 28);
    const history = AggregatorHistoryBuffer.decode(accountInfo.data);
    return { history, maxSize };
  }

  /**
   * Fetch an aggregators history buffer and return an array of historical samples
   * @params aggregator the pre-loaded aggregator state
   * @return the array of {@linkcode types.AggregatorHistoryRow} samples
   */
  public async loadData(
    startTimestamp?: number,
    endTimestamp?: number
  ): Promise<Array<types.AggregatorHistoryRow>> {
    if (PublicKey.default.equals(this.publicKey)) {
      return [];
    }
    const bufferAccountInfo = await this.program.connection.getAccountInfo(
      this.publicKey
    );
    if (bufferAccountInfo === null) {
      throw new errors.AccountNotFoundError(
        "Aggregator History",
        this.publicKey
      );
    }
    return AggregatorHistoryBuffer.decode(
      bufferAccountInfo.data,
      startTimestamp,
      endTimestamp
    );
  }

  /**
   * Invoke a callback each time an AggregatorAccount's data has changed on-chain.
   * @param callback - the callback invoked when the aggregator state changes
   * @param commitment - optional, the desired transaction finality. defaults to 'confirmed'
   * @returns the websocket subscription id
   */
  public onChange(
    callback: OnAccountChangeCallback<Array<types.AggregatorHistoryRow>>,
    commitment: Commitment = "confirmed"
  ): number {
    return this.program.connection.onAccountChange(
      this.publicKey,
      (accountInfo) => {
        callback(this.decode(accountInfo.data));
      },
      commitment
    );
  }

  /**
   * Create a history buffer for an aggregator and store the last N samples in a round robin history buffer.
   * @param program The SwitchboardProgram.
   * @param payer The account that will pay for the new account.
   * @param params history buffer configuration parameters.
   * @return {@linkcode TransactionObject} that will create the AggregatorHistoryBuffer.
   *
   * Basic usage example:
   *
   * ```ts
   * import { AggregatorAccount,AggregatorHistoryBuffer } from '@switchboard-xyz/solana.js';
   * const aggregatorAccount = new AggregatorAccount(program, aggregatorKey);
   * const aggregator = await aggregatorAccount.loadData();
   * const [historyBuffer, addHistoryTxn] = await AggregatorHistoryBuffer.createInstructions(program, payer, {
   *    aggregatorAccount,
   *    maxSamples: 10000,
   * });
   * const aggregatorHistorySignature = await program.signAndSendAll(aggregatorHistoryTxn);
   * const history = await historyBuffer.loadData();
   * ```
   */
  public static async createInstructions(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: AggregatorHistoryInit,
    options?: TransactionObjectOptions
  ): Promise<[AggregatorHistoryBuffer, TransactionObject]> {
    const buffer = params.keypair ?? Keypair.generate();
    program.verifyNewKeypair(buffer);

    const ixns: TransactionInstruction[] = [];
    const signers: Keypair[] = params.aggregatorAuthority
      ? [params.aggregatorAuthority, buffer]
      : [buffer];

    const size = AggregatorHistoryBuffer.getAccountSize(params.maxSamples);

    ixns.push(
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: buffer.publicKey,
        space: size,
        lamports: await program.connection.getMinimumBalanceForRentExemption(
          size
        ),
        programId: program.programId,
      }),
      types.aggregatorSetHistoryBuffer(
        program,
        { params: {} },
        {
          aggregator: params.aggregatorAccount.publicKey,
          authority: params.aggregatorAuthority
            ? params.aggregatorAuthority.publicKey
            : payer,
          buffer: buffer.publicKey,
        }
      )
    );

    return [
      new AggregatorHistoryBuffer(program, buffer.publicKey),
      new TransactionObject(payer, ixns, signers, options),
    ];
  }

  /**
   * Create a history buffer for an aggregator and store the last N samples in a round robin history buffer.
   * @param program The SwitchboardProgram.
   * @param payer The account that will pay for the new account.
   * @param params history buffer configuration parameters.
   * @return {@linkcode TransactionObject} that will create the AggregatorHistoryBuffer.
   *
   * Basic usage example:
   *
   * ```ts
   * import { AggregatorAccount,AggregatorHistoryBuffer } from '@switchboard-xyz/solana.js';
   * const aggregatorAccount = new AggregatorAccount(program, aggregatorKey);
   * const aggregator = await aggregatorAccount.loadData();
   * const [historyBuffer, addHistorySignature] = await AggregatorHistoryBuffer.create(program, {
   *    aggregatorAccount,
   *    maxSamples: 10000,
   * });
   * const history = await historyBuffer.loadData();
   * ```
   */
  public static async create(
    program: SwitchboardProgram,
    params: AggregatorHistoryInit,
    options?: SendTransactionObjectOptions
  ): Promise<[AggregatorHistoryBuffer, TransactionSignature]> {
    const [account, transaction] =
      await AggregatorHistoryBuffer.createInstructions(
        program,
        program.walletPubkey,
        params,
        options
      );
    const txnSignature = await program.signAndSend(transaction, options);
    return [account, txnSignature];
  }

  public static collectMetrics(
    history: Array<types.AggregatorHistoryRow>,
    minUpdateDelaySeconds: number,
    period?: number
  ): AggregatorHistoryMetrics {
    const endTimestamp = history
      .map((row) => row.timestamp)
      .reduce((max, ts) => (ts.gt(max) ? ts : max), new BN(0));

    const startTimestamp = period
      ? history.reduce((val, row) => {
          const expectedStartTimestamp = endTimestamp.sub(new BN(period));
          return row.timestamp.gte(expectedStartTimestamp) &&
            val
              .sub(expectedStartTimestamp)
              .abs()
              .gt(row.timestamp.sub(expectedStartTimestamp).abs())
            ? row.timestamp
            : val;
        }, new BN(0))
      : history
          .map((row) => row.timestamp)
          .reduce((min, ts) => (ts.lt(min) ? ts : min), history[0].timestamp);

    const parsedHistory = history.filter(
      (row) =>
        row.timestamp.gte(startTimestamp) && row.timestamp.lte(endTimestamp)
    );

    const start = parsedHistory.slice(0)[0];
    const end = parsedHistory.slice(-1)[0];

    const timestamps = parsedHistory.map((r) => r.timestamp);
    const bigValues = parsedHistory.map((r) => r.value.toBig());

    const values = bigValues.map((val) => Number.parseFloat(val.toString()));

    const minValue = Math.min(...values);
    const min = parsedHistory.find((r) => Number(r.value) === minValue);

    const maxValue = Math.max(...values);
    const max = parsedHistory.find((r) => Number(r.value) === maxValue);

    const actualPeriod = endTimestamp.sub(startTimestamp).toNumber();
    const numSamples = parsedHistory.length;

    const maxUpdateIntervalWithJitter =
      minUpdateDelaySeconds + (15 % minUpdateDelaySeconds);

    const averageUpdateDelay =
      Math.round((actualPeriod / numSamples) * 10000) / 10000;
    const updateCoefficient =
      Math.round((averageUpdateDelay / minUpdateDelaySeconds) * 10000) / 10000;

    const averageValue = bigValues
      .reduce((sum, val) => sum.add(val))
      .div(numSamples);

    const standardDeviation = bigValues
      .reduce((sum, val) => sum.add(val.sub(averageValue).pow(2)), new Big(0))
      .div(numSamples)
      .sqrt();

    return {
      history: parsedHistory,
      period: actualPeriod,
      numSamples,
      minUpdateDelaySeconds: minUpdateDelaySeconds,
      maxUpdateIntervalWithJitter,
      averageUpdateDelay,
      updateCoefficient,
      averageValue: averageValue.toNumber(),
      standardDeviation: standardDeviation.toNumber(),
      start,
      end,
      min: min!,
      max: max!,
    };
  }
}

export type AggregatorHistoryMetrics = {
  history: Array<types.AggregatorHistoryRow>;
  period: number;
  numSamples: number;
  minUpdateDelaySeconds: number;
  maxUpdateIntervalWithJitter: number;
  averageUpdateDelay: number;
  updateCoefficient: number;
  averageValue: number;
  standardDeviation: number;
  start: types.AggregatorHistoryRow;
  end: types.AggregatorHistoryRow;
  min: types.AggregatorHistoryRow;
  max: types.AggregatorHistoryRow;
};
