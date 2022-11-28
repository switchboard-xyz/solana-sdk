import { SwitchboardProgram } from '../program';
import * as anchor from '@project-serum/anchor';

export abstract class Account<T> {
  /**
   * Account constructor
   * @param program SwitchboardProgram
   * @param publicKey PublicKey of the on-chain resource
   */
  public constructor(
    public readonly program: SwitchboardProgram,
    public readonly publicKey: anchor.web3.PublicKey
  ) {}

  /**
   * @return on-chain account size.
   */
  public abstract get size(): number;

  /**
   * Retrieve and decode the data in this account.
   */
  public abstract loadData(): Promise<T>;
}

/** Callback to pass deserialized account data when updated on-chain */
export type OnAccountChangeCallback<T> = (accountData: T) => void;
