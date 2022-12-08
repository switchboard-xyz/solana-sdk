import { AccountInfo, Commitment, PublicKey } from '@solana/web3.js';
import * as errors from '../errors';
import * as types from '../generated';
import { SwitchboardProgram } from '../program';
import {
  Account,
  BUFFER_DISCRIMINATOR,
  OnAccountChangeCallback,
} from './account';

/**
 * Account holding a list of oracles actively heartbeating on the queue
 *
 * Data: Array<{@linkcode PublicKey}>
 */
export class QueueDataBuffer extends Account<Array<PublicKey>> {
  static accountName = 'QueueDataBuffer';

  public size = 32;

  /**
   * Invoke a callback each time a QueueAccount's oracle queue buffer has changed on-chain. The buffer stores a list of oracle's and their last heartbeat timestamp.
   * @param callback - the callback invoked when the queues buffer changes
   * @param commitment - optional, the desired transaction finality. defaults to 'confirmed'
   * @returns the websocket subscription id
   */
  onChange(
    callback: OnAccountChangeCallback<Array<PublicKey>>,
    commitment: Commitment = 'confirmed'
  ): number {
    if (this.publicKey.equals(PublicKey.default)) {
      throw new Error(
        `No queue dataBuffer provided. Call crankAccount.loadData() or pass it to this function in order to watch the account for changes`
      );
    }
    return this.program.connection.onAccountChange(
      this.publicKey,
      accountInfo => callback(QueueDataBuffer.decode(accountInfo)),
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
        'Oracle Queue Buffer',
        this.publicKey
      );
    const data = QueueDataBuffer.decode(accountInfo);
    return data;
  }

  public static decode(
    bufferAccountInfo: AccountInfo<Buffer>
  ): Array<PublicKey> {
    const buffer = bufferAccountInfo.data.slice(8) ?? Buffer.from('');

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

  public static getAccountSize(size: number): number {
    return 8 + size * 32;
  }

  public static default(size = 100): Buffer {
    const buffer = Buffer.alloc(QueueDataBuffer.getAccountSize(size), 0);
    BUFFER_DISCRIMINATOR.copy(buffer, 0);
    return buffer;
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
