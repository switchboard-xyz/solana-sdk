import { Keypair } from '@solana/web3.js';
import fs from 'fs';
import path from 'path';

export function parseString(
  object: Record<string, any>,
  key: string,
  defaultString: string | undefined = ''
): string {
  if (key in object) {
    switch (typeof object[key]) {
      case 'string':
        return object[key];
      default:
        String(object[key]);
    }
  }

  return defaultString;
}

export function parseNumber(
  object: Record<string, any>,
  key: string,
  defaultNumber: number | undefined = 0
): number {
  if (key in object) {
    switch (typeof object[key]) {
      case 'number':
        return object[key];
      default:
        Number(object[key]);
    }
  }

  return defaultNumber;
}

export function parseBoolean(
  object: Record<string, any>,
  key: string,
  defaultBoolean: boolean | undefined = false
): boolean {
  if (key in object) {
    switch (typeof object[key]) {
      case 'boolean':
        return object[key];
      default:
        return Boolean(object[key]);
    }
  }

  return defaultBoolean;
}

export const keypairToString = (keypair: Keypair): string =>
  `[${keypair.secretKey}]`;

export function loadKeypair(keypairPath: string): Keypair {
  if (keypairPath.startsWith('[') && keypairPath.endsWith(']')) {
    const walletKeypair = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(keypairPath))
    );
    return walletKeypair;
  }

  const fullPath =
    keypairPath.startsWith('/') || keypairPath.startsWith('C:')
      ? keypairPath
      : path.join(process.cwd(), keypairPath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`keypair file does not exist, ${fullPath}`);
  }

  const keypair = Keypair.fromSecretKey(
    new Uint8Array(
      JSON.parse(
        fs.readFileSync(fullPath, {
          encoding: 'utf-8',
        })
      )
    )
  );
  return keypair;
}
