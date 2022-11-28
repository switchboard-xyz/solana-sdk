import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import * as errors from '../errors';
import * as types from '../generated';
import { Account } from './account';

/**
 * Parameters for popping an element from a CrankAccount.
 */
export interface CrankPopParams {
  /**
   * Specifies the wallet to reward for turning the crank.
   */
  payoutWallet: PublicKey;
  /**
   * The pubkey of the linked oracle queue.
   */
  queuePubkey: PublicKey;
  /**
   * The pubkey of the linked oracle queue authority.
   */
  queueAuthority: PublicKey;
  /**
   * Array of pubkeys to attempt to pop. If discluded, this will be loaded
   * from the crank upon calling.
   */
  readyPubkeys?: PublicKey[];
  /**
   * Nonce to allow consecutive crank pops with the same blockhash.
   */
  nonce?: number;
  crank: types.CrankAccountData;
  queue: types.OracleQueueAccountData;
  tokenMint: PublicKey;
  failOpenOnMismatch?: boolean;
  popIdx?: number;
}

/**
 * A Switchboard account representing a crank of aggregators ordered by next update time.
 */
export class CrankAccount extends Account<types.CrankAccountData> {
  static accountName = 'CrankAccountData';

  /**
   * Get the size of an {@linkcode CrankAccount} on-chain.
   */
  public size = this.program.account.crankAccountData.size;

  /**
   * Retrieve and decode the {@linkcode types.CrankAccountData} stored in this account.
   */
  public async loadData(): Promise<types.CrankAccountData> {
    const data = await types.CrankAccountData.fetch(
      this.program,
      this.publicKey
    );
    if (data === null) throw new errors.AccountNotFoundError(this.publicKey);
    return data;
  }

  // public async popInstruction(
  //   authority: PublicKey,
  //   params: CrankPopParams
  // ): Promise<anchor.web3.TransactionInstruction> {
  //   const next = params.readyPubkeys ?? (await this.peakNextReady(5));
  //   if (next.length === 0) throw new Error('Crank is not ready to be turned.');

  //   const remainingAccounts: PublicKey[] = [];
  //   const leaseBumpsMap: Record<string, number> = {};
  //   const permissionBumpsMap: Record<string, number> = {};
  //   const queueAccount = new OracleQueueAccount(
  //     /* program= */ this.program,
  //     /* queuePubkey= */ params.queuePubkey
  //   );
  //   for (const row of next) {
  //     const aggregatorAccount = new AggregatorAccount({
  //       program: this.program,
  //       publicKey: row,
  //     });
  //     const [leaseAccount, leaseBump] = LeaseAccount.fromSeed(
  //       this.program,
  //       queueAccount,
  //       aggregatorAccount
  //     );
  //     const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
  //       this.program,
  //       params.queueAuthority,
  //       params.queuePubkey,
  //       row
  //     );
  //     const escrow = await spl.getAssociatedTokenAddress(
  //       params.tokenMint,
  //       leaseAccount.publicKey,
  //       true
  //     );
  //     remainingAccounts.push(aggregatorAccount.publicKey);
  //     remainingAccounts.push(leaseAccount.publicKey);
  //     remainingAccounts.push(escrow);
  //     remainingAccounts.push(permissionAccount.publicKey);
  //     leaseBumpsMap.set(row.toBase58(), leaseBump);
  //     permissionBumpsMap.set(row.toBase58(), permissionBump);
  //   }
  //   remainingAccounts.sort((a: PublicKey, b: PublicKey) =>
  //     a.toBuffer().compare(b.toBuffer())
  //   );

  //   return types.crankPop(
  //     this.program.programId,
  //     {
  //       params: {
  //         stateBump,
  //         leaseBumps: Buffer.from(leaseBumps),
  //         permissionBumps: Buffer.from(permissionBumps),
  //         nonce: params.nonce ?? null,
  //         failOpenOnAccountMismatch,
  //         popIdx: params.popIdx ?? 0,
  //       },
  //     },
  //     { authority, queue: this.publicKey }
  //   );
  // }

  /**
   * Get an array of the next aggregator pubkeys to be popped from the crank, limited by n
   * @param num The limit of pubkeys to return.
   * @return List of {@linkcode types.CrankRow}, ordered by timestamp.
   */
  async peakNextWithTime(num?: number): Promise<types.CrankRow[]> {
    const crankData = await this.loadData();
    const buffer = await this.program.connection
      .getAccountInfo(crankData.dataBuffer)
      .then(accountInfo => accountInfo?.data.subarray(8) ?? Buffer.from(''));
    const rowSize = 40;
    const crankRows: types.CrankRow[] = [];
    for (let i = 0; i < crankData.pqSize * rowSize; i += rowSize) {
      if (buffer.length - i < rowSize) break;
      const rowBuf = buffer.subarray(i, i + rowSize);
      const pubkey = new PublicKey(rowBuf.slice(0, 32));
      const nextTimestamp = new anchor.BN(rowBuf.slice(32, rowSize), 'le');
      crankRows.push(new types.CrankRow({ pubkey, nextTimestamp }));
    }
    return crankRows
      .slice(0, crankData.pqSize)
      .sort((a, b) => a.nextTimestamp.cmp(b.nextTimestamp))
      .slice(0, num);
  }

  /**
   * Get an array of the next readily updateable aggregator pubkeys to be popped
   * from the crank, limited by n
   * @param num The limit of pubkeys to return.
   * @return Pubkey list of Aggregator pubkeys.
   */
  async peakNextReady(num?: number): Promise<PublicKey[]> {
    const now = Math.floor(Date.now() / 1000);
    return this.peakNextWithTime(num).then(crankRows => {
      return crankRows
        .filter(row => now >= row.nextTimestamp.toNumber())
        .map(row => row.pubkey);
    });
  }

  /**
   * Get an array of the next aggregator pubkeys to be popped from the crank, limited by n
   * @param num The limit of pubkeys to return.
   * @return Pubkey list of Aggregators next up to be popped.
   */
  async peakNext(num?: number): Promise<PublicKey[]> {
    return this.peakNextWithTime(num).then(crankRows => {
      return crankRows.map(row => row.pubkey);
    });
  }
}
