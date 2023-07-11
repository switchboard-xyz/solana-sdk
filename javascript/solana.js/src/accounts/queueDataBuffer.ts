import * as errors from "../errors.js";
import type * as types from "../generated/oracle-program/index.js";
import type { SwitchboardProgram } from "../SwitchboardProgram.js";

import type { OnAccountChangeCallback } from "./account.js";
import { Account, BUFFER_DISCRIMINATOR } from "./account.js";

import type { AccountInfo, Commitment } from "@solana/web3.js";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import assert from "assert";

/**
 * Account holding a list of oracles actively heartbeating on the queue
 *
 * Data: Array<{@linkcode PublicKey}>
 */
export class QueueDataBuffer extends Account<Array<PublicKey>> {
  static accountName = "QueueDataBuffer";

  public size = 32;

  public static getAccountSize(size: number): number {
    return 8 + size * 32;
  }

  /**
   * Return an oracle queue buffer initialized to the default values.
   *
   * @param size - the number of oracles the buffer should support
   */
  public static default(size = 100): Buffer {
    const buffer = Buffer.alloc(QueueDataBuffer.getAccountSize(size), 0);
    BUFFER_DISCRIMINATOR.copy(buffer, 0);
    return buffer;
  }

  /**
   * Create a mock account info for a given vrf config. Useful for test integrations.
   */
  public static createMock(
    programId: PublicKey,
    data: { size?: number; oracles?: Array<PublicKey> },
    options?: {
      lamports?: number;
      rentEpoch?: number;
    }
  ): AccountInfo<Buffer> {
    const size = data.size ?? 100;

    const oracles: Array<PublicKey> = Array(size).fill(PublicKey.default);
    for (const [n, oracle] of (data.oracles ?? []).entries()) {
      oracles[n] = oracle;
    }

    const buffer = Buffer.alloc(QueueDataBuffer.getAccountSize(size), 0);
    BUFFER_DISCRIMINATOR.copy(buffer, 0);
    for (const [n, oracle] of oracles.entries()) {
      const oracleBuffer = oracle.toBuffer();
      assert(oracleBuffer.byteLength === 32);
      oracleBuffer.copy(buffer, 8 + n * 32);
    }

    return {
      executable: false,
      owner: programId,
      lamports: options?.lamports ?? 1 * LAMPORTS_PER_SOL,
      data: buffer,
      rentEpoch: options?.rentEpoch ?? 0,
    };
  }

  /**
   * Invoke a callback each time a QueueAccount's oracle queue buffer has changed on-chain. The buffer stores a list of oracle's and their last heartbeat timestamp.
   * @param callback - the callback invoked when the queues buffer changes
   * @param commitment - optional, the desired transaction finality. defaults to 'confirmed'
   * @returns the websocket subscription id
   */
  onChange(
    callback: OnAccountChangeCallback<Array<PublicKey>>,
    commitment: Commitment = "confirmed"
  ): number {
    if (this.publicKey.equals(PublicKey.default)) {
      throw new Error(
        `No queue dataBuffer provided. Call crankAccount.loadData() or pass it to this function in order to watch the account for changes`
      );
    }
    return this.program.connection.onAccountChange(
      this.publicKey,
      (accountInfo) => callback(QueueDataBuffer.decode(accountInfo)),
      commitment
    );
  }

  /**
   * Retrieve and decode the {@linkcode types.CrankAccountData} stored in this account.
   */
  public async loadData(): Promise<Array<PublicKey>> {
    if (this.publicKey.equals(PublicKey.default)) {
      return [];
    }
    const accountInfo = await this.program.connection.getAccountInfo(
      this.publicKey
    );
    if (accountInfo === null)
      throw new errors.AccountNotFoundError(
        "Oracle Queue Buffer",
        this.publicKey
      );
    const data = QueueDataBuffer.decode(accountInfo);
    return data;
  }

  public static decode(
    bufferAccountInfo: AccountInfo<Buffer>
  ): Array<PublicKey> {
    const buffer = bufferAccountInfo.data.slice(8) ?? Buffer.from("");

    const oracles: PublicKey[] = [];

    for (let i = 0; i < buffer.byteLength * 32; i += 32) {
      if (buffer.byteLength - i < 32) {
        break;
      }

      const pubkeyBuf = buffer.slice(i, i + 32);
      const pubkey = new PublicKey(pubkeyBuf);
      if (PublicKey.default.equals(pubkey)) {
        break;
      }
      oracles.push(pubkey);
    }

    return oracles;
  }

  /**
   * Return a queues dataBuffer
   *
   * @throws {string} if dataBuffer is equal to default publicKey
   */
  static fromQueue(
    program: SwitchboardProgram,
    queue: types.OracleQueueAccountData
  ): QueueDataBuffer {
    if (queue.dataBuffer.equals(PublicKey.default)) {
      throw new Error(`Failed to find queue data buffer`);
    }

    return new QueueDataBuffer(program, queue.dataBuffer);
  }
}
