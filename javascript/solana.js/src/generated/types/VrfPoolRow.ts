import { SwitchboardProgram } from "../../SwitchboardProgram";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VrfPoolRowFields {
  timestamp: BN;
  pubkey: PublicKey;
}

export interface VrfPoolRowJSON {
  timestamp: string;
  pubkey: string;
}

export class VrfPoolRow {
  readonly timestamp: BN;
  readonly pubkey: PublicKey;

  constructor(fields: VrfPoolRowFields) {
    this.timestamp = fields.timestamp;
    this.pubkey = fields.pubkey;
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.i64("timestamp"), borsh.publicKey("pubkey")],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new VrfPoolRow({
      timestamp: obj.timestamp,
      pubkey: obj.pubkey,
    });
  }

  static toEncodable(fields: VrfPoolRowFields) {
    return {
      timestamp: fields.timestamp,
      pubkey: fields.pubkey,
    };
  }

  toJSON(): VrfPoolRowJSON {
    return {
      timestamp: this.timestamp.toString(),
      pubkey: this.pubkey.toString(),
    };
  }

  static fromJSON(obj: VrfPoolRowJSON): VrfPoolRow {
    return new VrfPoolRow({
      timestamp: new BN(obj.timestamp),
      pubkey: new PublicKey(obj.pubkey),
    });
  }

  toEncodable() {
    return VrfPoolRow.toEncodable(this);
  }
}
