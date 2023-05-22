import { RawMrEnclave } from './types';

import { Keypair } from '@solana/web3.js';
import fs from 'fs';
import os from 'os';
import path from 'path';

export function loadKeypair(keypairPath: string): Keypair {
  const fullPath =
    keypairPath.startsWith('/') || keypairPath.startsWith('C:')
      ? keypairPath
      : keypairPath.startsWith('~')
      ? os.homedir() + keypairPath.slice(1)
      : path.join(process.cwd(), keypairPath);

  if (!fs.existsSync(fullPath)) {
    const keypair = Keypair.generate();
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, `[${keypair.secretKey}]`);
    return keypair;
  }

  return Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(fullPath, 'utf-8')))
  );
}

const bytesRegex = /^\[(\s)?[0-9]+((\s)?,(\s)?[0-9]+){31,}\]/g;
const hexRegex = /^(0x|0X)?[a-fA-F0-9]{64}/g;
const base64Regex =
  /^(?:[A-Za-z\d+\/]{4})*(?:[A-Za-z\d+\/]{3}=|[A-Za-z\d+\/]{2}==)?/g;

export function parseMrEnclave(mrEnclave: RawMrEnclave): Uint8Array {
  let myUint8Array: Uint8Array;

  if (typeof mrEnclave === 'string') {
    if (bytesRegex.test(mrEnclave)) {
      // check if its a string of bytes '[1,2,3]'
      myUint8Array = new Uint8Array(JSON.parse(mrEnclave));
    } else if (hexRegex.test(mrEnclave)) {
      // check if its a hex string '0x1A'
      myUint8Array = new Uint8Array(Buffer.from(mrEnclave, 'hex'));
    } else if (base64Regex.test(mrEnclave)) {
      // check if its a base64 string
      myUint8Array = new Uint8Array(Buffer.from(mrEnclave, 'base64'));
    } else {
      // assume utf-8
      myUint8Array = new Uint8Array(Buffer.from(mrEnclave));
    }
  } else if (mrEnclave instanceof Buffer) {
    myUint8Array = new Uint8Array(mrEnclave);
  } else if (mrEnclave instanceof Uint8Array) {
    myUint8Array = mrEnclave;
  } else {
    // Assume input is number[]
    myUint8Array = new Uint8Array(mrEnclave);
  }

  // make sure its always 32 bytes
  return new Uint8Array(
    Array.from(myUint8Array).concat(Array(32).fill(0)).slice(0, 32)
  );
}
