import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Connection, PublicKey } from '@solana/web3.js';
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuoteAccountDataFields {
  /** TODO: Add description */
  delegatedSecuredSigner: PublicKey;
  bump: number;
  /** TODO: Add description */
  quoteRegistry: Array<number>;
  /** Key to lookup the buffer data on IPFS or an alternative decentralized storage solution. */
  registryKey: Array<number>;
  /** Queue used for attestation to verify a MRENCLAVE measurement. */
  attestationQueue: PublicKey;
  /** The quotes MRENCLAVE measurement dictating the contents of the secure enclave. */
  mrEnclave: Array<number>;
  verificationStatus: number;
  verificationTimestamp: BN;
  validUntil: BN;
  isOnQueue: boolean;
  /** The last time the quote heartbeated. */
  lastHeartbeat: BN;
  owner: PublicKey;
  ebuf: Array<number>;
}

export interface QuoteAccountDataJSON {
  /** TODO: Add description */
  delegatedSecuredSigner: string;
  bump: number;
  /** TODO: Add description */
  quoteRegistry: Array<number>;
  /** Key to lookup the buffer data on IPFS or an alternative decentralized storage solution. */
  registryKey: Array<number>;
  /** Queue used for attestation to verify a MRENCLAVE measurement. */
  attestationQueue: string;
  /** The quotes MRENCLAVE measurement dictating the contents of the secure enclave. */
  mrEnclave: Array<number>;
  verificationStatus: number;
  verificationTimestamp: string;
  validUntil: string;
  isOnQueue: boolean;
  /** The last time the quote heartbeated. */
  lastHeartbeat: string;
  owner: string;
  ebuf: Array<number>;
}

export class QuoteAccountData {
  /** TODO: Add description */
  readonly delegatedSecuredSigner: PublicKey;
  readonly bump: number;
  /** TODO: Add description */
  readonly quoteRegistry: Array<number>;
  /** Key to lookup the buffer data on IPFS or an alternative decentralized storage solution. */
  readonly registryKey: Array<number>;
  /** Queue used for attestation to verify a MRENCLAVE measurement. */
  readonly attestationQueue: PublicKey;
  /** The quotes MRENCLAVE measurement dictating the contents of the secure enclave. */
  readonly mrEnclave: Array<number>;
  readonly verificationStatus: number;
  readonly verificationTimestamp: BN;
  readonly validUntil: BN;
  readonly isOnQueue: boolean;
  /** The last time the quote heartbeated. */
  readonly lastHeartbeat: BN;
  readonly owner: PublicKey;
  readonly ebuf: Array<number>;

  static readonly discriminator = Buffer.from([
    205, 205, 167, 232, 0, 74, 44, 160,
  ]);

  static readonly layout = borsh.struct([
    borsh.publicKey('delegatedSecuredSigner'),
    borsh.u8('bump'),
    borsh.array(borsh.u8(), 32, 'quoteRegistry'),
    borsh.array(borsh.u8(), 64, 'registryKey'),
    borsh.publicKey('attestationQueue'),
    borsh.array(borsh.u8(), 32, 'mrEnclave'),
    borsh.u8('verificationStatus'),
    borsh.i64('verificationTimestamp'),
    borsh.i64('validUntil'),
    borsh.bool('isOnQueue'),
    borsh.i64('lastHeartbeat'),
    borsh.publicKey('owner'),
    borsh.array(borsh.u8(), 992, 'ebuf'),
  ]);

  constructor(fields: QuoteAccountDataFields) {
    this.delegatedSecuredSigner = fields.delegatedSecuredSigner;
    this.bump = fields.bump;
    this.quoteRegistry = fields.quoteRegistry;
    this.registryKey = fields.registryKey;
    this.attestationQueue = fields.attestationQueue;
    this.mrEnclave = fields.mrEnclave;
    this.verificationStatus = fields.verificationStatus;
    this.verificationTimestamp = fields.verificationTimestamp;
    this.validUntil = fields.validUntil;
    this.isOnQueue = fields.isOnQueue;
    this.lastHeartbeat = fields.lastHeartbeat;
    this.owner = fields.owner;
    this.ebuf = fields.ebuf;
  }

  static async fetch(
    program: SwitchboardProgram,
    address: PublicKey
  ): Promise<QuoteAccountData | null> {
    const info = await program.connection.getAccountInfo(address);

    if (info === null) {
      return null;
    }
    if (!info.owner.equals(program.attestationProgramId)) {
      throw new Error("account doesn't belong to this program");
    }

    return this.decode(info.data);
  }

  static async fetchMultiple(
    program: SwitchboardProgram,
    addresses: PublicKey[]
  ): Promise<Array<QuoteAccountData | null>> {
    const infos = await program.connection.getMultipleAccountsInfo(addresses);

    return infos.map(info => {
      if (info === null) {
        return null;
      }
      if (!info.owner.equals(program.attestationProgramId)) {
        throw new Error("account doesn't belong to this program");
      }

      return this.decode(info.data);
    });
  }

  static decode(data: Buffer): QuoteAccountData {
    if (!data.slice(0, 8).equals(QuoteAccountData.discriminator)) {
      throw new Error('invalid account discriminator');
    }

    const dec = QuoteAccountData.layout.decode(data.slice(8));

    return new QuoteAccountData({
      delegatedSecuredSigner: dec.delegatedSecuredSigner,
      bump: dec.bump,
      quoteRegistry: dec.quoteRegistry,
      registryKey: dec.registryKey,
      attestationQueue: dec.attestationQueue,
      mrEnclave: dec.mrEnclave,
      verificationStatus: dec.verificationStatus,
      verificationTimestamp: dec.verificationTimestamp,
      validUntil: dec.validUntil,
      isOnQueue: dec.isOnQueue,
      lastHeartbeat: dec.lastHeartbeat,
      owner: dec.owner,
      ebuf: dec.ebuf,
    });
  }

  toJSON(): QuoteAccountDataJSON {
    return {
      delegatedSecuredSigner: this.delegatedSecuredSigner.toString(),
      bump: this.bump,
      quoteRegistry: this.quoteRegistry,
      registryKey: this.registryKey,
      attestationQueue: this.attestationQueue.toString(),
      mrEnclave: this.mrEnclave,
      verificationStatus: this.verificationStatus,
      verificationTimestamp: this.verificationTimestamp.toString(),
      validUntil: this.validUntil.toString(),
      isOnQueue: this.isOnQueue,
      lastHeartbeat: this.lastHeartbeat.toString(),
      owner: this.owner.toString(),
      ebuf: this.ebuf,
    };
  }

  static fromJSON(obj: QuoteAccountDataJSON): QuoteAccountData {
    return new QuoteAccountData({
      delegatedSecuredSigner: new PublicKey(obj.delegatedSecuredSigner),
      bump: obj.bump,
      quoteRegistry: obj.quoteRegistry,
      registryKey: obj.registryKey,
      attestationQueue: new PublicKey(obj.attestationQueue),
      mrEnclave: obj.mrEnclave,
      verificationStatus: obj.verificationStatus,
      verificationTimestamp: new BN(obj.verificationTimestamp),
      validUntil: new BN(obj.validUntil),
      isOnQueue: obj.isOnQueue,
      lastHeartbeat: new BN(obj.lastHeartbeat),
      owner: new PublicKey(obj.owner),
      ebuf: obj.ebuf,
    });
  }
}
