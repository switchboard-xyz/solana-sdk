#!/usr/bin/node

const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync, spawn } = require('child_process');
const { Keypair, clusterApiUrl, Connection } = require('@solana/web3.js');
const { sleep } = require('@switchboard-xyz/common');

const SWITCHBOARD_PROGRAM_ACCOUNTS = [
  'SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f', // sb programId
  '7nYabs9dUhvxYwdTnrWVBL9MYviKSfrEbdWCUbcnwkpF', // sb programData
  'Fi8vncGpNKbq62gPo56G4toCehWNy77GgqGkTaAF5Lkk', // sb idl
];

const SWITCHBOARD_SGX_PROGRAM_ACCOUNTS = [
  '2No5FVKPAAYqytpkEoq93tVh33fo4p6DgAnm4S6oZHo7', // sgx programId
  'BNrpbCMbBFiCEqGdWaDMqjQmwqtGdgmoFFzGJnUexSbj', // sgx programData
  'th1SbXMTX3SrWJ1kbiSKqMDpTBaXkESxpcehXRa12T4', // sgx idl
];

const SWITCHBOARD_BASE_ACCOUNTS = [
  'CyZuD7RPDcrqCGbNvLCyqk6Py9cEZTKmNKujfPi3ynDd', // sb programState
  '7hkp1xfPBcD2t1vZMoWWQPzipHVcXeLAAaiGXdPSfDie', // sb tokenVault
];

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

  if (!fs.existsSync(defaultPubkeyPath)) {
    fs.writeFileSync(defaultPubkeyPath, `[${Keypair.generate().secretKey}]`);
  }

  const payerPubkey = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(defaultPubkeyPath, 'utf-8')))
  ).publicKey;

  const switchboardAccounts = [...SWITCHBOARD_BASE_ACCOUNTS];

  const switchboardPrograms = [];
  const idls = new Map();

  if (isDev) {
    if (
      fs.existsSync(
        path.join(devSwitchboard, 'target', 'deploy', 'switchboard_v2.so')
      )
    ) {
      switchboardPrograms.push(
        ...[
          '--bpf-program',
          'SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f',
          path.join(devSwitchboard, 'target', 'deploy', 'switchboard_v2.so'),
        ]
      );

      if (
        fs.existsSync(
          path.join(devSwitchboard, 'target', 'idl', 'switchboard_v2.json')
        )
      ) {
        idls.set(
          'Fi8vncGpNKbq62gPo56G4toCehWNy77GgqGkTaAF5Lkk',
          path.join(devSwitchboard, 'target', 'idl', 'switchboard_v2.json')
        );
      } else {
        console.log(`Failed to find IDL for switchboard_v2`);
        switchboardAccounts.push(
          'Fi8vncGpNKbq62gPo56G4toCehWNy77GgqGkTaAF5Lkk'
        );
      }
    } else {
      console.log(`Did not find the switchboard_v2.so program`);
      switchboardAccounts.push(...SWITCHBOARD_PROGRAM_ACCOUNTS);
    }

    if (
      fs.existsSync(
        path.join(
          devSwitchboard,
          'target',
          'deploy',
          'switchboard_quote_verifier.so'
        )
      )
    ) {
      switchboardPrograms.push(
        ...[
          '--bpf-program',
          '2No5FVKPAAYqytpkEoq93tVh33fo4p6DgAnm4S6oZHo7',
          path.join(
            devSwitchboard,
            'target',
            'deploy',
            'switchboard_quote_verifier.so'
          ),
        ]
      );

      if (
        fs.existsSync(
          path.join(
            devSwitchboard,
            'target',
            'idl',
            'switchboard_quote_verifier.json'
          )
        )
      ) {
        idls.set(
          'th1SbXMTX3SrWJ1kbiSKqMDpTBaXkESxpcehXRa12T4',
          path.join(
            devSwitchboard,
            'target',
            'idl',
            'switchboard_quote_verifier.json'
          )
        );
      } else {
        console.log(`Failed to find IDL for switchboard_quote_verifier`);
        switchboardAccounts.push('th1SbXMTX3SrWJ1kbiSKqMDpTBaXkESxpcehXRa12T4');
      }
    } else {
      console.log(`Did not find the switchboard_quote_verifier.so program`);
      switchboardAccounts.push(...SWITCHBOARD_SGX_PROGRAM_ACCOUNTS);
    }
  } else {
    switchboardAccounts.push(
      ...SWITCHBOARD_PROGRAM_ACCOUNTS,
      ...SWITCHBOARD_SGX_PROGRAM_ACCOUNTS
    );
  }

  const cloneAccounts = switchboardAccounts
    .map(a => `--clone ${a}`)
    .join(' ')
    .split(' ');

  fs.mkdirSync('.anchor/test-ledger', { recursive: true });

  const rpcUrl = clusterApiUrl(isMainnet ? 'mainnet-beta' : 'devnet');

  spawn(
    'solana-test-validator',
    [
      '-q',
      '-r',
      '--ledger',
      '.anchor/test-ledger',
      '--mint',
      payerPubkey.toBase58(),
      '--bind-address',
      '0.0.0.0',
      '--url',
      rpcUrl,
      '--rpc-port',
      '8899',
      ...switchboardPrograms,
      ...cloneAccounts,
    ],
    { cwd: jsSdkRoot, encoding: 'utf-8' }
  );

  await awaitValidator();
  console.log(`Local solana validator started. `);

  // TODO: Fix this
  // Publish the IDLs
  for (const idl of idls) {
    const args = [
      '--provider.cluster',
      'localnet',
      '--provider.wallet',
      defaultPubkeyPath,
      'idl',
      'init',
      '--filepath',
      idl[1],
      idl[0],
    ];
    execSync(`anchor`, args, {
      encoding: 'utf-8',
      cwd: devSwitchboard,
      stdio: 'pipe',
    });
  }
}

main()
  .then()
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

async function awaitValidator(timeout = 60) {
  const connection = new Connection('http://localhost:8899');
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
