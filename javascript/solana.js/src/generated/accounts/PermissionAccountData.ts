import { SwitchboardProgram } from '../../program';
import { PublicKey, Connection } from '@solana/web3.js';
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface PermissionAccountDataFields {
  authority: PublicKey;
  permissions: number;
  granter: PublicKey;
  grantee: PublicKey;
  expiration: BN;
  ebuf: Array<number>;
}

export interface PermissionAccountDataJSON {
  authority: string;
  permissions: number;
  granter: string;
  grantee: string;
  expiration: string;
  ebuf: Array<number>;
}

export class PermissionAccountData {
  readonly authority: PublicKey;
  readonly permissions: number;
  readonly granter: PublicKey;
  readonly grantee: PublicKey;
  readonly expiration: BN;
  readonly ebuf: Array<number>;

  static readonly discriminator = Buffer.from([
    77, 37, 177, 164, 38, 39, 34, 109,
  ]);

  static readonly layout = borsh.struct([
    borsh.publicKey('authority'),
    borsh.u32('permissions'),
    borsh.publicKey('granter'),
    borsh.publicKey('grantee'),
    borsh.i64('expiration'),
    borsh.array(borsh.u8(), 256, 'ebuf'),
  ]);

  constructor(fields: PermissionAccountDataFields) {
    this.authority = fields.authority;
    this.permissions = fields.permissions;
    this.granter = fields.granter;
    this.grantee = fields.grantee;
    this.expiration = fields.expiration;
    this.ebuf = fields.ebuf;
  }

  static async fetch(
    program: SwitchboardProgram,
    address: PublicKey
  ): Promise<PermissionAccountData | null> {
    const info = await program.connection.getAccountInfo(address);

    if (info === null) {
      return null;
    }
    if (!info.owner.equals(program.programId)) {
      throw new Error("account doesn't belong to this program");
    }

    return this.decode(info.data);
  }

  static async fetchMultiple(
    program: SwitchboardProgram,
    addresses: PublicKey[]
  ): Promise<Array<PermissionAccountData | null>> {
    const infos = await program.connection.getMultipleAccountsInfo(addresses);

    return infos.map(info => {
      if (info === null) {
        return null;
      }
      if (!info.owner.equals(program.programId)) {
        throw new Error("account doesn't belong to this program");
      }

      return this.decode(info.data);
    });
  }

  static decode(data: Buffer): PermissionAccountData {
    if (!data.slice(0, 8).equals(PermissionAccountData.discriminator)) {
      throw new Error('invalid account discriminator');
    }

    const dec = PermissionAccountData.layout.decode(data.slice(8));

    return new PermissionAccountData({
      authority: dec.authority,
      permissions: dec.permissions,
      granter: dec.granter,
      grantee: dec.grantee,
      expiration: dec.expiration,
      ebuf: dec.ebuf,
    });
  }

  toJSON(): PermissionAccountDataJSON {
    return {
      authority: this.authority.toString(),
      permissions: this.permissions,
      granter: this.granter.toString(),
      grantee: this.grantee.toString(),
      expiration: this.expiration.toString(),
      ebuf: this.ebuf,
    };
  }

  static fromJSON(obj: PermissionAccountDataJSON): PermissionAccountData {
    return new PermissionAccountData({
      authority: new PublicKey(obj.authority),
      permissions: obj.permissions,
      granter: new PublicKey(obj.granter),
      grantee: new PublicKey(obj.grantee),
      expiration: new BN(obj.expiration),
      ebuf: obj.ebuf,
    });
  }
}
