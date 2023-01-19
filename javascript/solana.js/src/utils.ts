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
