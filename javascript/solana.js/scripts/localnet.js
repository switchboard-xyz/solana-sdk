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

  if (!isDev) {
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

  let rpcUrl = clusterApiUrl(isMainnet ? 'mainnet-beta' : 'devnet');
  if (isMainnet && process.env.SOLANA_MAINNET_RPC_URL) {
    rpcUrl = process.env.SOLANA_MAINNET_RPC_URL;
  } else if (!isMainnet && process.env.SOLANA_DEVNET_RPC_URL) {
    rpcUrl = process.env.SOLANA_DEVNET_RPC_URL;
  }

  spawn(
    'solana-test-validator',
    [
      '-q',
      '-r',
      '--mint',
      payerPubkey.toBase58(),
      '--url',
      rpcUrl,
      ...cloneAccounts,
      '--ledger',
      '.anchor/test-ledger',
    ],
    { cwd: jsSdkRoot, encoding: 'utf-8' }
  );

  await awaitValidator();

  if (isDev) {
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
        'switchboard_quote_verifier',
        '2No5FVKPAAYqytpkEoq93tVh33fo4p6DgAnm4S6oZHo7'
      ),
    ]);
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
  if (!fs.existsSync(sbProgramPath)) {
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
  if (!fs.existsSync(programKeypairPath)) {
    throw new Error(
      `Failed to find program keypair for ${programName} in ${switchboardDir}`
    );
  }
  const programKeypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(programKeypairPath, 'utf-8')))
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
  if (!fs.existsSync(idlPath)) {
    throw new Error(
      `Failed to find IDL ${programName}.json in ${switchboardDir}`
    );
  }

  const solanaDeployArgs = [
    'program',
    'deploy',
    '-u',
    'l',
    '--program-id',
    programKeypairPath,
    '--upgrade-authority',
    defaultPubkeyPath,
    sbProgramPath,
  ];
  execSync(`solana ${solanaDeployArgs.join(' ')}`, {
    cwd: switchboardDir,
    encoding: 'utf8',
    stdio: 'inherit',
    shell: '/bin/zsh',
  });

  const idlInitArgs = [
    'idl',
    'init',
    '--provider.cluster',
    'localnet',
    '--provider.wallet',
    defaultPubkeyPath,
    '-f',
    idlPath,
    programId,
  ];
  execSync(`anchor ${idlInitArgs.join(' ')}`, {
    cwd: switchboardDir,
    encoding: 'utf-8',
    stdio: 'inherit',
    shell: '/bin/zsh',
  });
}
