import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Connection, PublicKey } from "@solana/web3.js";
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VerifierAccountDataFields {
  /** Represents the state of the quote verifiers enclave. */
  enclave: types.QuoteFields;
  /** The authority of the EnclaveAccount which is permitted to make account changes. */
  authority: PublicKey;
  /** Queue used for attestation to verify a MRENCLAVE measurement. */
  attestationQueue: PublicKey;
  /** The unix timestamp when the quote was created. */
  createdAt: BN;
  /** Whether the quote is located on the AttestationQueues buffer. */
  isOnQueue: number;
  /** The last time the quote heartbeated on-chain. */
  lastHeartbeat: BN;
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

export interface VerifierAccountDataJSON {
  /** Represents the state of the quote verifiers enclave. */
  enclave: types.QuoteJSON;
  /** The authority of the EnclaveAccount which is permitted to make account changes. */
  authority: string;
  /** Queue used for attestation to verify a MRENCLAVE measurement. */
  attestationQueue: string;
  /** The unix timestamp when the quote was created. */
  createdAt: string;
  /** Whether the quote is located on the AttestationQueues buffer. */
  isOnQueue: number;
  /** The last time the quote heartbeated on-chain. */
  lastHeartbeat: string;
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

export class VerifierAccountData {
  /** Represents the state of the quote verifiers enclave. */
  readonly enclave: types.Quote;
  /** The authority of the EnclaveAccount which is permitted to make account changes. */
  readonly authority: PublicKey;
  /** Queue used for attestation to verify a MRENCLAVE measurement. */
  readonly attestationQueue: PublicKey;
  /** The unix timestamp when the quote was created. */
  readonly createdAt: BN;
  /** Whether the quote is located on the AttestationQueues buffer. */
  readonly isOnQueue: number;
  /** The last time the quote heartbeated on-chain. */
  readonly lastHeartbeat: BN;
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
    106, 146, 60, 232, 231, 52, 189, 253,
  ]);

  static readonly layout = borsh.struct([
    types.Quote.layout("enclave"),
    borsh.publicKey("authority"),
    borsh.publicKey("attestationQueue"),
    borsh.i64("createdAt"),
    borsh.u8("isOnQueue"),
    borsh.i64("lastHeartbeat"),
    borsh.publicKey("rewardEscrow"),
    borsh.publicKey("stakeWallet"),
    borsh.array(borsh.u8(), 1024, "ebuf"),
  ]);

  constructor(fields: VerifierAccountDataFields) {
    this.enclave = new types.Quote({ ...fields.enclave });
    this.authority = fields.authority;
    this.attestationQueue = fields.attestationQueue;
    this.createdAt = fields.createdAt;
    this.isOnQueue = fields.isOnQueue;
    this.lastHeartbeat = fields.lastHeartbeat;
    this.rewardEscrow = fields.rewardEscrow;
    this.stakeWallet = fields.stakeWallet;
    this.ebuf = fields.ebuf;
  }

  static async fetch(
    program: SwitchboardProgram,
    address: PublicKey,
    programId: PublicKey = program.attestationProgramId
  ): Promise<VerifierAccountData | null> {
    const info = await program.connection.getAccountInfo(address);

    if (info === null) {
      return null;
    }
    if (!info.owner.equals(programId)) {
      throw new Error("account doesn't belong to this program");
    }

    return this.decode(info.data);
  }

  static async fetchMultiple(
    program: SwitchboardProgram,
    addresses: PublicKey[],
    programId: PublicKey = program.attestationProgramId
  ): Promise<Array<VerifierAccountData | null>> {
    const infos = await program.connection.getMultipleAccountsInfo(addresses);

    return infos.map((info) => {
      if (info === null) {
        return null;
      }
      if (!info.owner.equals(programId)) {
        throw new Error("account doesn't belong to this program");
      }

      return this.decode(info.data);
    });
  }

  static decode(data: Buffer): VerifierAccountData {
    if (!data.slice(0, 8).equals(VerifierAccountData.discriminator)) {
      throw new Error("invalid account discriminator");
    }

    const dec = VerifierAccountData.layout.decode(data.slice(8));

    return new VerifierAccountData({
      enclave: types.Quote.fromDecoded(dec.enclave),
      authority: dec.authority,
      attestationQueue: dec.attestationQueue,
      createdAt: dec.createdAt,
      isOnQueue: dec.isOnQueue,
      lastHeartbeat: dec.lastHeartbeat,
      rewardEscrow: dec.rewardEscrow,
      stakeWallet: dec.stakeWallet,
      ebuf: dec.ebuf,
    });
  }

  toJSON(): VerifierAccountDataJSON {
    return {
      enclave: this.enclave.toJSON(),
      authority: this.authority.toString(),
      attestationQueue: this.attestationQueue.toString(),
      createdAt: this.createdAt.toString(),
      isOnQueue: this.isOnQueue,
      lastHeartbeat: this.lastHeartbeat.toString(),
      rewardEscrow: this.rewardEscrow.toString(),
      stakeWallet: this.stakeWallet.toString(),
      ebuf: this.ebuf,
    };
  }

  static fromJSON(obj: VerifierAccountDataJSON): VerifierAccountData {
    return new VerifierAccountData({
      enclave: types.Quote.fromJSON(obj.enclave),
      authority: new PublicKey(obj.authority),
      attestationQueue: new PublicKey(obj.attestationQueue),
      createdAt: new BN(obj.createdAt),
      isOnQueue: obj.isOnQueue,
      lastHeartbeat: new BN(obj.lastHeartbeat),
      rewardEscrow: new PublicKey(obj.rewardEscrow),
      stakeWallet: new PublicKey(obj.stakeWallet),
      ebuf: obj.ebuf,
    });
  }
}
