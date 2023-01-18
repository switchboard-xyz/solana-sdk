import { SwitchboardProgram } from '../../SwitchboardProgram';
import {
  TransactionInstruction,
  PublicKey,
  AccountMeta,
} from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface VrfLiteProveAndVerifyArgs {
  params: types.VrfLiteProveAndVerifyParamsFields;
}

export interface VrfLiteProveAndVerifyAccounts {
  vrfLite: PublicKey;
  callbackPid: PublicKey;
  tokenProgram: PublicKey;
  escrow: PublicKey;
  programState: PublicKey;
  oracle: PublicKey;
  oracleAuthority: PublicKey;
  oracleWallet: PublicKey;
  instructionsSysvar: PublicKey;
}

export const layout = borsh.struct([
  types.VrfLiteProveAndVerifyParams.layout('params'),
]);

export function vrfLiteProveAndVerify(
  program: SwitchboardProgram,
  args: VrfLiteProveAndVerifyArgs,
  accounts: VrfLiteProveAndVerifyAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.vrfLite, isSigner: false, isWritable: true },
    { pubkey: accounts.callbackPid, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.escrow, isSigner: false, isWritable: true },
    { pubkey: accounts.programState, isSigner: false, isWritable: false },
    { pubkey: accounts.oracle, isSigner: false, isWritable: false },
    { pubkey: accounts.oracleAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.oracleWallet, isSigner: false, isWritable: true },
    { pubkey: accounts.instructionsSysvar, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([191, 68, 209, 152, 10, 94, 165, 11]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      params: types.VrfLiteProveAndVerifyParams.toEncodable(args.params),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({
    keys,
    programId: program.programId,
    data,
  });
  return ix;
}
