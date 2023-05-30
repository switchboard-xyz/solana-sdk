#!/usr/bin/node

const path = require('path');
const fs = require('fs/promises');
const fsSync = require('fs');
const os = require('os');
const { execSync, spawn } = require('child_process');
const {
  Keypair,
  Connection,
  PublicKey,
  clusterApiUrl,
} = require('@solana/web3.js');
const { sleep } = require('@switchboard-xyz/common');

const getProgramDataAddress = programId => {
  return PublicKey.findProgramAddressSync(
    [programId.toBytes()],
    new PublicKey('BPFLoaderUpgradeab1e11111111111111111111111')
  )[0];
};

const getIdlAddress = programId => {
  const base = PublicKey.findProgramAddressSync([], programId)[0];

  // const buffer = Buffer.concat([
  //   base.toBuffer(),
  //   Buffer.from('anchor:idl'),
  //   programId.toBuffer(),
  // ]);
  // const publicKeyBytes = sha256(buffer);
  // return new PublicKey(publicKeyBytes);

  return PublicKey.createWithSeed(base, 'anchor:idl', new PublicKey(programId));
};

const SWITCHBOARD_PROGRAM_ID = new PublicKey(
  'SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f'
);
// const SWITCHBOARD_PROGRAM_ACCOUNTS = [
//   SWITCHBOARD_PROGRAM_ID,
//   getProgramDataAddress(SWITCHBOARD_PROGRAM_ID),
//   await getIdlAddress(SWITCHBOARD_PROGRAM_ID),
// ];

const SWITCHBOARD_ATTESTATION_PROGRAM_ID = new PublicKey(
  '2No5FVKPAAYqytpkEoq93tVh33fo4p6DgAnm4S6oZHo7'
);
// const SWITCHBOARD_ATTESTATION_PROGRAM_ACCOUNTS = [
//   SWITCHBOARD_ATTESTATION_PROGRAM_ID,
//   getProgramDataAddress(SWITCHBOARD_ATTESTATION_PROGRAM_ID),
//   await getIdlAddress(SWITCHBOARD_ATTESTATION_PROGRAM_ID),
// ];

const jsSdkRoot = path.join(__dirname, '..');
const solanaSdkRoot = path.join(jsSdkRoot, '..', '..');
const devSwitchboard = path.join(
  solanaSdkRoot,
  '..',
  'switchboard-core',
  'switchboard_v2'
);

const defaultPubkeyPath = path.join(
  os.homedir(),
  '.config',
  'solana',
  'id.json'
);

function killPort(port) {
  execSync(`lsof -t -i :${port} | xargs kill -9 || exit 0`, {
    encoding: 'utf-8',
  });
}

async function main() {
  // if dev, clone the local program version
  const isDev = process.argv.slice(2).includes('--dev');
  if (isDev) {
    console.log(`Using local switchboard programs`);
  }

  const isMainnet = process.argv.slice(2).includes('--mainnet');

  try {
    killPort(8899);
    killPort(8900);
  } catch (error) {
    console.error(`Failed to kill port 8899`);
    console.error(error);
  }

  if (!fsSync.existsSync(defaultPubkeyPath)) {
    await fs.writeFile(defaultPubkeyPath, `[${Keypair.generate().secretKey}]`);
  }

  const payerPubkey = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(await fs.readFile(defaultPubkeyPath, 'utf-8')))
  ).publicKey;

  await fs.mkdir('.anchor/test-ledger', { recursive: true });

  let rpcUrl = clusterApiUrl(isMainnet ? 'mainnet-beta' : 'devnet');
  if (isMainnet && process.env.SOLANA_MAINNET_RPC_URL) {
    rpcUrl = process.env.SOLANA_MAINNET_RPC_URL;
  } else if (!isMainnet && process.env.SOLANA_DEVNET_RPC_URL) {
    rpcUrl = process.env.SOLANA_DEVNET_RPC_URL;
  }

  if (isDev) {
    spawn(
      'solana-test-validator',
      [
        '-q',
        '-r',
        '--mint',
        payerPubkey.toBase58(),
        '--ledger',
        '.anchor/test-ledger',
        // '--url',
        // rpcUrl,
        // ...cloneAccounts,
      ],
      { cwd: jsSdkRoot, encoding: 'utf-8', stdio: 'pipe' }
    );

    await awaitValidator();

    await Promise.all([
      programDeploy(
        devSwitchboard,
        defaultPubkeyPath,
        'switchboard_v2',
        'SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f'
      ),
      programDeploy(
        devSwitchboard,
        defaultPubkeyPath,
        'switchboard_attestation_program',
        '2No5FVKPAAYqytpkEoq93tVh33fo4p6DgAnm4S6oZHo7'
      ),
    ]);
  } else {
    const cloneAccounts = [
      SWITCHBOARD_PROGRAM_ID,
      getProgramDataAddress(SWITCHBOARD_PROGRAM_ID),
      await getIdlAddress(SWITCHBOARD_PROGRAM_ID),
      SWITCHBOARD_ATTESTATION_PROGRAM_ID,
      getProgramDataAddress(SWITCHBOARD_ATTESTATION_PROGRAM_ID),
      await getIdlAddress(SWITCHBOARD_ATTESTATION_PROGRAM_ID),
    ]
      .map(a => `--clone ${a.toBase58()}`)
      .join(' ')
      .split(' ');

    spawn(
      'solana-test-validator',
      [
        '-q',
        '-r',
        '--mint',
        payerPubkey.toBase58(),
        '--ledger',
        '.anchor/test-ledger',
        '--url',
        rpcUrl,
        ...cloneAccounts,
      ],
      { cwd: jsSdkRoot, encoding: 'utf-8' }
    );

    await awaitValidator();
  }

  console.log(`\n\nLocal solana validator started ... `);
}

main()
  .then()
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

async function awaitValidator(timeout = 60) {
  const connection = new Connection('http://127.0.0.1:8899');
  let myError;
  let numRetries = timeout * 2;
  while (numRetries) {
    try {
      const id = await connection.getBlockHeight();
      if (id) {
        return;
      }
    } catch (error) {
      myError = error;
      // console.error(error);
    }

    --numRetries;
    await sleep(500);
  }

  throw new Error(
    `Failed to start Solana local validator in ${timeout} seconds${
      myError ? ': ' + myError : undefined
    }`
  );
}

async function programDeploy(
  switchboardDir,
  defaultPubkeyPath,
  programName,
  programId
) {
  const sbProgramPath = path.join(
    switchboardDir,
    'target',
    'deploy',
    `${programName}.so`
  );
  if (!fsSync.existsSync(sbProgramPath)) {
    throw new Error(
      `Failed to find BPF program ${programName}.so in ${switchboardDir}`
    );
  }

  const programKeypairPath = path.join(
    switchboardDir,
    'target',
    'deploy',
    `${programName}-keypair.json`
  );
  if (!fsSync.existsSync(programKeypairPath)) {
    throw new Error(
      `Failed to find program keypair for ${programName} in ${switchboardDir}`
    );
  }
  const programKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(await fs.readFile(programKeypairPath, 'utf-8')))
  );
  if (programKeypair.publicKey.toBase58() !== programId) {
    throw new Error(
      `Program ID mismatch for program ${programName}, expected ${programId}, received ${programKeypair.publicKey.toBase58()}`
    );
  }

  const idlPath = path.join(
    switchboardDir,
    'target',
    'idl',
    `${programName}.json`
  );
  if (!fsSync.existsSync(idlPath)) {
    throw new Error(
      `Failed to find IDL ${programName}.json in ${switchboardDir}`
    );
  }

  console.log(`Starting program deploy for ${programName} ...`);
  await runCommandAsync(
    `solana ${[
      'program',
      'deploy',
      '-u',
      'l',
      '--program-id',
      programKeypairPath,
      '--upgrade-authority',
      defaultPubkeyPath,
      sbProgramPath,
    ].join(' ')}`,
    {
      cwd: switchboardDir,
      encoding: 'utf8',
      // stdio: 'pipe',
      shell: '/bin/zsh',
    }
  );

  console.log(`Starting IDL deploy for ${programName} ...`);
  await runCommandAsync(
    `anchor ${[
      'idl',
      'init',
      '--provider.cluster',
      'localnet',
      '--provider.wallet',
      defaultPubkeyPath,
      '-f',
      idlPath,
      programId,
    ].join(' ')}`,
    {
      cwd: switchboardDir,
      encoding: 'utf8',
      // stdio: 'pipe',
      shell: '/bin/zsh',
    }
  );
}

async function runCommandAsync(command, options) {
  return new Promise((resolve, reject) => {
    const cmd = spawn(command, options);

    cmd.stdout.on('data', data => {
      console.log(data.toString());
    });

    cmd.stderr.on('data', data => {
      console.error(data.toString());
    });

    cmd.on('error', error => {
      reject(error);
    });

    cmd.on('close', code => {
      if (code !== 0) {
        reject(new Error(`Command exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}
