import * as errors from '../errors';
import * as types from '../generated';
import { Account } from './account';

export class BufferRelayerAccount extends Account<types.BufferRelayerAccountData> {
  static accountName = 'BufferRelayerAccountData';

  /**
   * Returns the size of an on-chain {@linkcode BufferRelayerAccount}.
   */
  public get size(): number {
    return this.program.account.bufferRelayerAccountData.size;
  }

  /**
   * Load and parse {@linkcode BufferRelayerAccount} data based on the program IDL.
   */
  public async loadData(): Promise<types.BufferRelayerAccountData> {
    const data = await types.BufferRelayerAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data === null) throw new errors.AccountNotFoundError(this.publicKey);
    return data;
  }
}
