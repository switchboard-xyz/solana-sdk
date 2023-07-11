import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface QuoteFields {
  /** The address of the signer generated within an enclave. */
  enclaveSigner: PublicKey;
  /** The quotes MRENCLAVE measurement dictating the contents of the secure enclave. */
  mrEnclave: Array<number>;
  /** The VerificationStatus of the quote. */
  verificationStatus: number;
  /** The unix timestamp when the quote was last verified. */
  verificationTimestamp: BN;
  /** The unix timestamp when the quotes verification status expires. */
  validUntil: BN;
  /** The off-chain registry where the verifiers quote can be located. */
  quoteRegistry: Array<number>;
  /** Key to lookup the buffer data on IPFS or an alternative decentralized storage solution. */
  registryKey: Array<number>;
  /** Reserved. */
  ebuf: Array<number>;
}

export interface QuoteJSON {
  /** The address of the signer generated within an enclave. */
  enclaveSigner: string;
  /** The quotes MRENCLAVE measurement dictating the contents of the secure enclave. */
  mrEnclave: Array<number>;
  /** The VerificationStatus of the quote. */
  verificationStatus: number;
  /** The unix timestamp when the quote was last verified. */
  verificationTimestamp: string;
  /** The unix timestamp when the quotes verification status expires. */
  validUntil: string;
  /** The off-chain registry where the verifiers quote can be located. */
  quoteRegistry: Array<number>;
  /** Key to lookup the buffer data on IPFS or an alternative decentralized storage solution. */
  registryKey: Array<number>;
  /** Reserved. */
  ebuf: Array<number>;
}

export class Quote {
  /** The address of the signer generated within an enclave. */
  readonly enclaveSigner: PublicKey;
  /** The quotes MRENCLAVE measurement dictating the contents of the secure enclave. */
  readonly mrEnclave: Array<number>;
  /** The VerificationStatus of the quote. */
  readonly verificationStatus: number;
  /** The unix timestamp when the quote was last verified. */
  readonly verificationTimestamp: BN;
  /** The unix timestamp when the quotes verification status expires. */
  readonly validUntil: BN;
  /** The off-chain registry where the verifiers quote can be located. */
  readonly quoteRegistry: Array<number>;
  /** Key to lookup the buffer data on IPFS or an alternative decentralized storage solution. */
  readonly registryKey: Array<number>;
  /** Reserved. */
  readonly ebuf: Array<number>;

  constructor(fields: QuoteFields) {
    this.enclaveSigner = fields.enclaveSigner;
    this.mrEnclave = fields.mrEnclave;
    this.verificationStatus = fields.verificationStatus;
    this.verificationTimestamp = fields.verificationTimestamp;
    this.validUntil = fields.validUntil;
    this.quoteRegistry = fields.quoteRegistry;
    this.registryKey = fields.registryKey;
    this.ebuf = fields.ebuf;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.publicKey("enclaveSigner"),
        borsh.array(borsh.u8(), 32, "mrEnclave"),
        borsh.u8("verificationStatus"),
        borsh.i64("verificationTimestamp"),
        borsh.i64("validUntil"),
        borsh.array(borsh.u8(), 32, "quoteRegistry"),
        borsh.array(borsh.u8(), 64, "registryKey"),
        borsh.array(borsh.u8(), 256, "ebuf"),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new Quote({
      enclaveSigner: obj.enclaveSigner,
      mrEnclave: obj.mrEnclave,
      verificationStatus: obj.verificationStatus,
      verificationTimestamp: obj.verificationTimestamp,
      validUntil: obj.validUntil,
      quoteRegistry: obj.quoteRegistry,
      registryKey: obj.registryKey,
      ebuf: obj.ebuf,
    });
  }

  static toEncodable(fields: QuoteFields) {
    return {
      enclaveSigner: fields.enclaveSigner,
      mrEnclave: fields.mrEnclave,
      verificationStatus: fields.verificationStatus,
      verificationTimestamp: fields.verificationTimestamp,
      validUntil: fields.validUntil,
      quoteRegistry: fields.quoteRegistry,
      registryKey: fields.registryKey,
      ebuf: fields.ebuf,
    };
  }

  toJSON(): QuoteJSON {
    return {
      enclaveSigner: this.enclaveSigner.toString(),
      mrEnclave: this.mrEnclave,
      verificationStatus: this.verificationStatus,
      verificationTimestamp: this.verificationTimestamp.toString(),
      validUntil: this.validUntil.toString(),
      quoteRegistry: this.quoteRegistry,
      registryKey: this.registryKey,
      ebuf: this.ebuf,
    };
  }

  static fromJSON(obj: QuoteJSON): Quote {
    return new Quote({
      enclaveSigner: new PublicKey(obj.enclaveSigner),
      mrEnclave: obj.mrEnclave,
      verificationStatus: obj.verificationStatus,
      verificationTimestamp: new BN(obj.verificationTimestamp),
      validUntil: new BN(obj.validUntil),
      quoteRegistry: obj.quoteRegistry,
      registryKey: obj.registryKey,
      ebuf: obj.ebuf,
    });
  }

  toEncodable() {
    return Quote.toEncodable(this);
  }
}
