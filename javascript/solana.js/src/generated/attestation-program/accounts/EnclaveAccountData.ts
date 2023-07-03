import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Connection, PublicKey } from "@solana/web3.js";
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface EnclaveAccountDataFields {
  /** The address of the signer generated within an enclave. */
  enclaveSigner: PublicKey;
  /** The authority of the EnclaveAccount which is permitted to make account changes. */
  authority: PublicKey;
  /** Queue used for attestation to verify a MRENCLAVE measurement. */
  attestationQueue: PublicKey;
  /** The quotes MRENCLAVE measurement dictating the contents of the secure enclave. */
  mrEnclave: Array<number>;
  /** The VerificationStatus of the quote. */
  verificationStatus: number;
  /** The unix timestamp when the quote was last verified. */
  verificationTimestamp: BN;
  /** The unix timestamp when the quotes verification status expires. */
  validUntil: BN;
  /** The unix timestamp when the quote was created. */
  createdAt: BN;
  /** The off-chain registry where the verifiers quote can be located. */
  quoteRegistry: Array<number>;
  /** Key to lookup the buffer data on IPFS or an alternative decentralized storage solution. */
  registryKey: Array<number>;
  /** Whether the quote is located on the AttestationQueues buffer. */
  isOnQueue: boolean;
  /** The last time the quote heartbeated on-chain. */
  lastHeartbeat: BN;
  /** The PDA bump. Only set for FunctionAccount quotes. */
  bump: number;
  /**
   * The SwitchboardWallet account containing the reward escrow for verifying quotes on-chain.
   * We should set this whenever the operator changes so we dont need to pass another account and can verify with has_one.
   */
  rewardEscrow: PublicKey;
  /**
   * The SwitchboardWallet account containing the queues required min_stake.
   * Needs to be separate from the reward_escrow. Allows easier 3rd party management of stake from rewards.
   */
  stakeWallet: PublicKey;
  /** Reserved. */
  ebuf: Array<number>;
}

export interface EnclaveAccountDataJSON {
  /** The address of the signer generated within an enclave. */
  enclaveSigner: string;
  /** The authority of the EnclaveAccount which is permitted to make account changes. */
  authority: string;
  /** Queue used for attestation to verify a MRENCLAVE measurement. */
  attestationQueue: string;
  /** The quotes MRENCLAVE measurement dictating the contents of the secure enclave. */
  mrEnclave: Array<number>;
  /** The VerificationStatus of the quote. */
  verificationStatus: number;
  /** The unix timestamp when the quote was last verified. */
  verificationTimestamp: string;
  /** The unix timestamp when the quotes verification status expires. */
  validUntil: string;
  /** The unix timestamp when the quote was created. */
  createdAt: string;
  /** The off-chain registry where the verifiers quote can be located. */
  quoteRegistry: Array<number>;
  /** Key to lookup the buffer data on IPFS or an alternative decentralized storage solution. */
  registryKey: Array<number>;
  /** Whether the quote is located on the AttestationQueues buffer. */
  isOnQueue: boolean;
  /** The last time the quote heartbeated on-chain. */
  lastHeartbeat: string;
  /** The PDA bump. Only set for FunctionAccount quotes. */
  bump: number;
  /**
   * The SwitchboardWallet account containing the reward escrow for verifying quotes on-chain.
   * We should set this whenever the operator changes so we dont need to pass another account and can verify with has_one.
   */
  rewardEscrow: string;
  /**
   * The SwitchboardWallet account containing the queues required min_stake.
   * Needs to be separate from the reward_escrow. Allows easier 3rd party management of stake from rewards.
   */
  stakeWallet: string;
  /** Reserved. */
  ebuf: Array<number>;
}

export class EnclaveAccountData {
  /** The address of the signer generated within an enclave. */
  readonly enclaveSigner: PublicKey;
  /** The authority of the EnclaveAccount which is permitted to make account changes. */
  readonly authority: PublicKey;
  /** Queue used for attestation to verify a MRENCLAVE measurement. */
  readonly attestationQueue: PublicKey;
  /** The quotes MRENCLAVE measurement dictating the contents of the secure enclave. */
  readonly mrEnclave: Array<number>;
  /** The VerificationStatus of the quote. */
  readonly verificationStatus: number;
  /** The unix timestamp when the quote was last verified. */
  readonly verificationTimestamp: BN;
  /** The unix timestamp when the quotes verification status expires. */
  readonly validUntil: BN;
  /** The unix timestamp when the quote was created. */
  readonly createdAt: BN;
  /** The off-chain registry where the verifiers quote can be located. */
  readonly quoteRegistry: Array<number>;
  /** Key to lookup the buffer data on IPFS or an alternative decentralized storage solution. */
  readonly registryKey: Array<number>;
  /** Whether the quote is located on the AttestationQueues buffer. */
  readonly isOnQueue: boolean;
  /** The last time the quote heartbeated on-chain. */
  readonly lastHeartbeat: BN;
  /** The PDA bump. Only set for FunctionAccount quotes. */
  readonly bump: number;
  /**
   * The SwitchboardWallet account containing the reward escrow for verifying quotes on-chain.
   * We should set this whenever the operator changes so we dont need to pass another account and can verify with has_one.
   */
  readonly rewardEscrow: PublicKey;
  /**
   * The SwitchboardWallet account containing the queues required min_stake.
   * Needs to be separate from the reward_escrow. Allows easier 3rd party management of stake from rewards.
   */
  readonly stakeWallet: PublicKey;
  /** Reserved. */
  readonly ebuf: Array<number>;

  static readonly discriminator = Buffer.from([
    90, 162, 39, 88, 77, 157, 156, 165,
  ]);

  static readonly layout = borsh.struct([
    borsh.publicKey("enclaveSigner"),
    borsh.publicKey("authority"),
    borsh.publicKey("attestationQueue"),
    borsh.array(borsh.u8(), 32, "mrEnclave"),
    borsh.u8("verificationStatus"),
    borsh.i64("verificationTimestamp"),
    borsh.i64("validUntil"),
    borsh.i64("createdAt"),
    borsh.array(borsh.u8(), 32, "quoteRegistry"),
    borsh.array(borsh.u8(), 64, "registryKey"),
    borsh.bool("isOnQueue"),
    borsh.i64("lastHeartbeat"),
    borsh.u8("bump"),
    borsh.publicKey("rewardEscrow"),
    borsh.publicKey("stakeWallet"),
    borsh.array(borsh.u8(), 928, "ebuf"),
  ]);

  constructor(fields: EnclaveAccountDataFields) {
    this.enclaveSigner = fields.enclaveSigner;
    this.authority = fields.authority;
    this.attestationQueue = fields.attestationQueue;
    this.mrEnclave = fields.mrEnclave;
    this.verificationStatus = fields.verificationStatus;
    this.verificationTimestamp = fields.verificationTimestamp;
    this.validUntil = fields.validUntil;
    this.createdAt = fields.createdAt;
    this.quoteRegistry = fields.quoteRegistry;
    this.registryKey = fields.registryKey;
    this.isOnQueue = fields.isOnQueue;
    this.lastHeartbeat = fields.lastHeartbeat;
    this.bump = fields.bump;
    this.rewardEscrow = fields.rewardEscrow;
    this.stakeWallet = fields.stakeWallet;
    this.ebuf = fields.ebuf;
  }

  static async fetch(
    program: SwitchboardProgram,
    address: PublicKey
  ): Promise<EnclaveAccountData | null> {
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
  ): Promise<Array<EnclaveAccountData | null>> {
    const infos = await program.connection.getMultipleAccountsInfo(addresses);

    return infos.map((info) => {
      if (info === null) {
        return null;
      }
      if (!info.owner.equals(program.attestationProgramId)) {
        throw new Error("account doesn't belong to this program");
      }

      return this.decode(info.data);
    });
  }

  static decode(data: Buffer): EnclaveAccountData {
    if (!data.slice(0, 8).equals(EnclaveAccountData.discriminator)) {
      throw new Error("invalid account discriminator");
    }

    const dec = EnclaveAccountData.layout.decode(data.slice(8));

    return new EnclaveAccountData({
      enclaveSigner: dec.enclaveSigner,
      authority: dec.authority,
      attestationQueue: dec.attestationQueue,
      mrEnclave: dec.mrEnclave,
      verificationStatus: dec.verificationStatus,
      verificationTimestamp: dec.verificationTimestamp,
      validUntil: dec.validUntil,
      createdAt: dec.createdAt,
      quoteRegistry: dec.quoteRegistry,
      registryKey: dec.registryKey,
      isOnQueue: dec.isOnQueue,
      lastHeartbeat: dec.lastHeartbeat,
      bump: dec.bump,
      rewardEscrow: dec.rewardEscrow,
      stakeWallet: dec.stakeWallet,
      ebuf: dec.ebuf,
    });
  }

  toJSON(): EnclaveAccountDataJSON {
    return {
      enclaveSigner: this.enclaveSigner.toString(),
      authority: this.authority.toString(),
      attestationQueue: this.attestationQueue.toString(),
      mrEnclave: this.mrEnclave,
      verificationStatus: this.verificationStatus,
      verificationTimestamp: this.verificationTimestamp.toString(),
      validUntil: this.validUntil.toString(),
      createdAt: this.createdAt.toString(),
      quoteRegistry: this.quoteRegistry,
      registryKey: this.registryKey,
      isOnQueue: this.isOnQueue,
      lastHeartbeat: this.lastHeartbeat.toString(),
      bump: this.bump,
      rewardEscrow: this.rewardEscrow.toString(),
      stakeWallet: this.stakeWallet.toString(),
      ebuf: this.ebuf,
    };
  }

  static fromJSON(obj: EnclaveAccountDataJSON): EnclaveAccountData {
    return new EnclaveAccountData({
      enclaveSigner: new PublicKey(obj.enclaveSigner),
      authority: new PublicKey(obj.authority),
      attestationQueue: new PublicKey(obj.attestationQueue),
      mrEnclave: obj.mrEnclave,
      verificationStatus: obj.verificationStatus,
      verificationTimestamp: new BN(obj.verificationTimestamp),
      validUntil: new BN(obj.validUntil),
      createdAt: new BN(obj.createdAt),
      quoteRegistry: obj.quoteRegistry,
      registryKey: obj.registryKey,
      isOnQueue: obj.isOnQueue,
      lastHeartbeat: new BN(obj.lastHeartbeat),
      bump: obj.bump,
      rewardEscrow: new PublicKey(obj.rewardEscrow),
      stakeWallet: new PublicKey(obj.stakeWallet),
      ebuf: obj.ebuf,
    });
  }
}
