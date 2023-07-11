import type { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Connection, PublicKey } from "@solana/web3.js";
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface SwitchboardWalletFields {
  bump: number;
  initialized: number;
  mint: PublicKey;
  attestationQueue: PublicKey;
  authority: PublicKey;
  name: Array<number>;
  resourceCount: number;
  withdrawAuthority: PublicKey;
  tokenWallet: PublicKey;
  resources: Array<PublicKey>;
  resourcesMaxLen: number;
  /** Reserved. */
  ebuf: Array<number>;
}

export interface SwitchboardWalletJSON {
  bump: number;
  initialized: number;
  mint: string;
  attestationQueue: string;
  authority: string;
  name: Array<number>;
  resourceCount: number;
  withdrawAuthority: string;
  tokenWallet: string;
  resources: Array<string>;
  resourcesMaxLen: number;
  /** Reserved. */
  ebuf: Array<number>;
}

export class SwitchboardWallet {
  readonly bump: number;
  readonly initialized: number;
  readonly mint: PublicKey;
  readonly attestationQueue: PublicKey;
  readonly authority: PublicKey;
  readonly name: Array<number>;
  readonly resourceCount: number;
  readonly withdrawAuthority: PublicKey;
  readonly tokenWallet: PublicKey;
  readonly resources: Array<PublicKey>;
  readonly resourcesMaxLen: number;
  /** Reserved. */
  readonly ebuf: Array<number>;

  static readonly discriminator = Buffer.from([210, 5, 94, 50, 69, 33, 74, 13]);

  static readonly layout = borsh.struct([
    borsh.u8("bump"),
    borsh.u8("initialized"),
    borsh.publicKey("mint"),
    borsh.publicKey("attestationQueue"),
    borsh.publicKey("authority"),
    borsh.array(borsh.u8(), 32, "name"),
    borsh.u32("resourceCount"),
    borsh.publicKey("withdrawAuthority"),
    borsh.publicKey("tokenWallet"),
    borsh.vec(borsh.publicKey(), "resources"),
    borsh.u32("resourcesMaxLen"),
    borsh.array(borsh.u8(), 64, "ebuf"),
  ]);

  constructor(fields: SwitchboardWalletFields) {
    this.bump = fields.bump;
    this.initialized = fields.initialized;
    this.mint = fields.mint;
    this.attestationQueue = fields.attestationQueue;
    this.authority = fields.authority;
    this.name = fields.name;
    this.resourceCount = fields.resourceCount;
    this.withdrawAuthority = fields.withdrawAuthority;
    this.tokenWallet = fields.tokenWallet;
    this.resources = fields.resources;
    this.resourcesMaxLen = fields.resourcesMaxLen;
    this.ebuf = fields.ebuf;
  }

  static async fetch(
    program: SwitchboardProgram,
    address: PublicKey,
    programId: PublicKey = program.attestationProgramId
  ): Promise<SwitchboardWallet | null> {
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
  ): Promise<Array<SwitchboardWallet | null>> {
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

  static decode(data: Buffer): SwitchboardWallet {
    if (!data.slice(0, 8).equals(SwitchboardWallet.discriminator)) {
      throw new Error("invalid account discriminator");
    }

    const dec = SwitchboardWallet.layout.decode(data.slice(8));

    return new SwitchboardWallet({
      bump: dec.bump,
      initialized: dec.initialized,
      mint: dec.mint,
      attestationQueue: dec.attestationQueue,
      authority: dec.authority,
      name: dec.name,
      resourceCount: dec.resourceCount,
      withdrawAuthority: dec.withdrawAuthority,
      tokenWallet: dec.tokenWallet,
      resources: dec.resources,
      resourcesMaxLen: dec.resourcesMaxLen,
      ebuf: dec.ebuf,
    });
  }

  toJSON(): SwitchboardWalletJSON {
    return {
      bump: this.bump,
      initialized: this.initialized,
      mint: this.mint.toString(),
      attestationQueue: this.attestationQueue.toString(),
      authority: this.authority.toString(),
      name: this.name,
      resourceCount: this.resourceCount,
      withdrawAuthority: this.withdrawAuthority.toString(),
      tokenWallet: this.tokenWallet.toString(),
      resources: this.resources.map((item) => item.toString()),
      resourcesMaxLen: this.resourcesMaxLen,
      ebuf: this.ebuf,
    };
  }

  static fromJSON(obj: SwitchboardWalletJSON): SwitchboardWallet {
    return new SwitchboardWallet({
      bump: obj.bump,
      initialized: obj.initialized,
      mint: new PublicKey(obj.mint),
      attestationQueue: new PublicKey(obj.attestationQueue),
      authority: new PublicKey(obj.authority),
      name: obj.name,
      resourceCount: obj.resourceCount,
      withdrawAuthority: new PublicKey(obj.withdrawAuthority),
      tokenWallet: new PublicKey(obj.tokenWallet),
      resources: obj.resources.map((item) => new PublicKey(item)),
      resourcesMaxLen: obj.resourcesMaxLen,
      ebuf: obj.ebuf,
    });
  }
}
