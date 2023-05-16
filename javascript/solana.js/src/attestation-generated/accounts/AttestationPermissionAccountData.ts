import { SwitchboardProgram } from '../../SwitchboardProgram';
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Connection, PublicKey } from '@solana/web3.js';
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AttestationPermissionAccountDataFields {
  authority: PublicKey;
  permissions: number;
  granter: PublicKey;
  grantee: PublicKey;
  expiration: BN;
  bump: number;
  ebuf: Array<number>;
}

export interface AttestationPermissionAccountDataJSON {
  authority: string;
  permissions: number;
  granter: string;
  grantee: string;
  expiration: string;
  bump: number;
  ebuf: Array<number>;
}

export class AttestationPermissionAccountData {
  readonly authority: PublicKey;
  readonly permissions: number;
  readonly granter: PublicKey;
  readonly grantee: PublicKey;
  readonly expiration: BN;
  readonly bump: number;
  readonly ebuf: Array<number>;

  static readonly discriminator = Buffer.from([
    63, 83, 122, 184, 22, 35, 31, 70,
  ]);

  static readonly layout = borsh.struct([
    borsh.publicKey('authority'),
    borsh.u32('permissions'),
    borsh.publicKey('granter'),
    borsh.publicKey('grantee'),
    borsh.i64('expiration'),
    borsh.u8('bump'),
    borsh.array(borsh.u8(), 256, 'ebuf'),
  ]);

  constructor(fields: AttestationPermissionAccountDataFields) {
    this.authority = fields.authority;
    this.permissions = fields.permissions;
    this.granter = fields.granter;
    this.grantee = fields.grantee;
    this.expiration = fields.expiration;
    this.bump = fields.bump;
    this.ebuf = fields.ebuf;
  }

  static async fetch(
    program: SwitchboardProgram,
    address: PublicKey
  ): Promise<AttestationPermissionAccountData | null> {
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
  ): Promise<Array<AttestationPermissionAccountData | null>> {
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

  static decode(data: Buffer): AttestationPermissionAccountData {
    if (
      !data.slice(0, 8).equals(AttestationPermissionAccountData.discriminator)
    ) {
      throw new Error('invalid account discriminator');
    }

    const dec = AttestationPermissionAccountData.layout.decode(data.slice(8));

    return new AttestationPermissionAccountData({
      authority: dec.authority,
      permissions: dec.permissions,
      granter: dec.granter,
      grantee: dec.grantee,
      expiration: dec.expiration,
      bump: dec.bump,
      ebuf: dec.ebuf,
    });
  }

  toJSON(): AttestationPermissionAccountDataJSON {
    return {
      authority: this.authority.toString(),
      permissions: this.permissions,
      granter: this.granter.toString(),
      grantee: this.grantee.toString(),
      expiration: this.expiration.toString(),
      bump: this.bump,
      ebuf: this.ebuf,
    };
  }

  static fromJSON(
    obj: AttestationPermissionAccountDataJSON
  ): AttestationPermissionAccountData {
    return new AttestationPermissionAccountData({
      authority: new PublicKey(obj.authority),
      permissions: obj.permissions,
      granter: new PublicKey(obj.granter),
      grantee: new PublicKey(obj.grantee),
      expiration: new BN(obj.expiration),
      bump: obj.bump,
      ebuf: obj.ebuf,
    });
  }
}
