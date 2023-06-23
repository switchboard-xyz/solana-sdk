import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface FunctionRequestTriggerRoundFields {
  /** The status of the request. */
  status: types.RequestStatusKind;
  /** The SOL bounty in lamports used to incentivize a verifier to expedite the request. */
  bounty: BN;
  /** The slot the request was published */
  requestSlot: BN;
  /** The slot when the request was fulfilled */
  fulfilledSlot: BN;
  /** The slot when the request will expire and be able to be closed by the non-authority account */
  expirationSlot: BN;
  /** The EnclaveAccount who verified the enclave for this request */
  verifier: PublicKey;
  /**
   * The keypair generated in the enclave and required to sign any
   * valid transactions processed by the function.
   */
  enclaveSigner: PublicKey;
  /** Reserved. */
  ebuf: Array<number>;
}

export interface FunctionRequestTriggerRoundJSON {
  /** The status of the request. */
  status: types.RequestStatusJSON;
  /** The SOL bounty in lamports used to incentivize a verifier to expedite the request. */
  bounty: string;
  /** The slot the request was published */
  requestSlot: string;
  /** The slot when the request was fulfilled */
  fulfilledSlot: string;
  /** The slot when the request will expire and be able to be closed by the non-authority account */
  expirationSlot: string;
  /** The EnclaveAccount who verified the enclave for this request */
  verifier: string;
  /**
   * The keypair generated in the enclave and required to sign any
   * valid transactions processed by the function.
   */
  enclaveSigner: string;
  /** Reserved. */
  ebuf: Array<number>;
}

export class FunctionRequestTriggerRound {
  /** The status of the request. */
  readonly status: types.RequestStatusKind;
  /** The SOL bounty in lamports used to incentivize a verifier to expedite the request. */
  readonly bounty: BN;
  /** The slot the request was published */
  readonly requestSlot: BN;
  /** The slot when the request was fulfilled */
  readonly fulfilledSlot: BN;
  /** The slot when the request will expire and be able to be closed by the non-authority account */
  readonly expirationSlot: BN;
  /** The EnclaveAccount who verified the enclave for this request */
  readonly verifier: PublicKey;
  /**
   * The keypair generated in the enclave and required to sign any
   * valid transactions processed by the function.
   */
  readonly enclaveSigner: PublicKey;
  /** Reserved. */
  readonly ebuf: Array<number>;

  constructor(fields: FunctionRequestTriggerRoundFields) {
    this.status = fields.status;
    this.bounty = fields.bounty;
    this.requestSlot = fields.requestSlot;
    this.fulfilledSlot = fields.fulfilledSlot;
    this.expirationSlot = fields.expirationSlot;
    this.verifier = fields.verifier;
    this.enclaveSigner = fields.enclaveSigner;
    this.ebuf = fields.ebuf;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        types.RequestStatus.layout("status"),
        borsh.u64("bounty"),
        borsh.u64("requestSlot"),
        borsh.u64("fulfilledSlot"),
        borsh.u64("expirationSlot"),
        borsh.publicKey("verifier"),
        borsh.publicKey("enclaveSigner"),
        borsh.array(borsh.u8(), 128, "ebuf"),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FunctionRequestTriggerRound({
      status: types.RequestStatus.fromDecoded(obj.status),
      bounty: obj.bounty,
      requestSlot: obj.requestSlot,
      fulfilledSlot: obj.fulfilledSlot,
      expirationSlot: obj.expirationSlot,
      verifier: obj.verifier,
      enclaveSigner: obj.enclaveSigner,
      ebuf: obj.ebuf,
    });
  }

  static toEncodable(fields: FunctionRequestTriggerRoundFields) {
    return {
      status: fields.status.toEncodable(),
      bounty: fields.bounty,
      requestSlot: fields.requestSlot,
      fulfilledSlot: fields.fulfilledSlot,
      expirationSlot: fields.expirationSlot,
      verifier: fields.verifier,
      enclaveSigner: fields.enclaveSigner,
      ebuf: fields.ebuf,
    };
  }

  toJSON(): FunctionRequestTriggerRoundJSON {
    return {
      status: this.status.toJSON(),
      bounty: this.bounty.toString(),
      requestSlot: this.requestSlot.toString(),
      fulfilledSlot: this.fulfilledSlot.toString(),
      expirationSlot: this.expirationSlot.toString(),
      verifier: this.verifier.toString(),
      enclaveSigner: this.enclaveSigner.toString(),
      ebuf: this.ebuf,
    };
  }

  static fromJSON(
    obj: FunctionRequestTriggerRoundJSON
  ): FunctionRequestTriggerRound {
    return new FunctionRequestTriggerRound({
      status: types.RequestStatus.fromJSON(obj.status),
      bounty: new BN(obj.bounty),
      requestSlot: new BN(obj.requestSlot),
      fulfilledSlot: new BN(obj.fulfilledSlot),
      expirationSlot: new BN(obj.expirationSlot),
      verifier: new PublicKey(obj.verifier),
      enclaveSigner: new PublicKey(obj.enclaveSigner),
      ebuf: obj.ebuf,
    });
  }

  toEncodable() {
    return FunctionRequestTriggerRound.toEncodable(this);
  }
}
