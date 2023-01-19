import { Keypair } from '@solana/web3.js';

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
