import {
  AccountInfo,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionSignature,
} from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { OracleJob, toUtf8 } from '@switchboard-xyz/common';
import * as errors from '../errors';
import * as types from '../generated';
import { SwitchboardProgram } from '../program';
import { Account } from './account';
import { TransactionObject } from '../transaction';

/**
 * Account type storing a list of SwitchboardTasks {@linkcode OracleJob.ITask} dictating how to source data off-chain.
 *
 * Data: {@linkcode types.JobAccountData}
 */
export class JobAccount extends Account<types.JobAccountData> {
  static accountName = 'JobAccountData';

  /**
   * Returns the job's name buffer in a stringified format.
   */
  public static getName = (job: types.JobAccountData) => toUtf8(job.name);
  /**
   * Returns the job's metadata buffer in a stringified format.
   */
  public static getMetadata = (job: types.JobAccountData) =>
    toUtf8(job.metadata);
  /**
   * Get the size of an {@linkcode JobAccount} on-chain.
   */
  public size = this.program.account.jobAccountData.size;

  /**
   * Retrieve and decode the {@linkcode types.JobAccountData} stored in this account.
   */
  public async loadData(): Promise<types.JobAccountData> {
    const data = await types.JobAccountData.fetch(this.program, this.publicKey);
    if (data === null) throw new errors.AccountNotFoundError(this.publicKey);
    return data;
  }

  public static createInstructions(
    program: SwitchboardProgram,
    payer: PublicKey,
    params: JobInitParams
  ): [JobAccount, Array<TransactionObject>] {
    if (params.data.byteLength > 6400) {
      throw new Error('Switchboard jobs need to be less than 6400 bytes');
    }

    const jobKeypair = params.keypair ?? Keypair.generate();
    program.verifyNewKeypair(jobKeypair);

    const authority = params.authority ?? payer;

    const CHUNK_SIZE = 800;

    const txns: Array<TransactionObject> = [];

    if (params.data.byteLength <= CHUNK_SIZE) {
      const jobInitIxn = types.jobInit(
        program,
        {
          params: {
            name: [...Buffer.from(params.name ?? '', 'utf8').slice(0, 32)],
            expiration: new anchor.BN(params.expiration ?? 0),
            stateBump: program.programState.bump,
            data: params.data,
            size: params.data.byteLength,
          },
        },
        {
          job: jobKeypair.publicKey,
          authority: authority,
          programState: program.programState.publicKey,
          payer,
          systemProgram: SystemProgram.programId,
        }
      );
      txns.push(new TransactionObject(payer, [jobInitIxn], [jobKeypair]));
    } else {
      const chunks: Uint8Array[] = [];

      for (let i = 0; i < params.data.byteLength; ) {
        const end =
          i + CHUNK_SIZE >= params.data.byteLength
            ? params.data.byteLength
            : i + CHUNK_SIZE;
        chunks.push(params.data.slice(i, end));
        i = end;
      }

      const jobInitIxn = types.jobInit(
        program,
        {
          params: {
            name: [...Buffer.from(params.name ?? '', 'utf8').slice(0, 32)],
            expiration: new anchor.BN(params.expiration ?? 0),
            stateBump: program.programState.bump,
            data: new Uint8Array(),
            size: params.data.byteLength,
          },
        },
        {
          job: jobKeypair.publicKey,
          authority: authority,
          programState: program.programState.publicKey,
          payer,
          systemProgram: SystemProgram.programId,
        }
      );

      txns.push(new TransactionObject(payer, [jobInitIxn], [jobKeypair]));

      for (const [n, chunk] of chunks.entries()) {
        const jobSetDataIxn = types.jobSetData(
          program,
          {
            params: {
              data: chunk,
              chunkIdx: n,
            },
          },
          {
            job: jobKeypair.publicKey,
            authority: authority,
          }
        );
        txns.push(new TransactionObject(payer, [jobSetDataIxn], []));
      }
    }

    return [new JobAccount(program, jobKeypair.publicKey), txns];
  }

  public static async create(
    program: SwitchboardProgram,
    params: JobInitParams
  ): Promise<[JobAccount, Array<TransactionSignature>]> {
    const [account, transactions] = JobAccount.createInstructions(
      program,
      program.walletPubkey,
      params
    );
    const txSignature = await program.signAndSendAll(transactions);
    return [account, txSignature];
  }

  decode(data: Buffer): types.JobAccountData {
    try {
      return types.JobAccountData.decode(data);
    } catch {
      return this.program.coder.decode<types.JobAccountData>(
        JobAccount.accountName,
        data
      );
    }
  }

  static decode(
    program: SwitchboardProgram,
    accountInfo: AccountInfo<Buffer>
  ): types.JobAccountData {
    if (!accountInfo || accountInfo.data === null) {
      throw new Error('Cannot decode empty JobAccountData');
    }
    return program.coder.decode(JobAccount.accountName, accountInfo?.data);
  }

  static decodeJob(
    program: SwitchboardProgram,
    accountInfo: AccountInfo<Buffer>
  ): OracleJob {
    return OracleJob.decodeDelimited(
      JobAccount.decode(program, accountInfo).data!
    );
  }
}

export interface JobInitParams {
  data: Uint8Array;
  weight?: number;
  name?: string;
  authority?: PublicKey;
  expiration?: number;
  variables?: Array<string>;
  keypair?: Keypair;
}
