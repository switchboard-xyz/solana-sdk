const shell = require('shelljs');
const path = require('path');
const fsSync = require('fs');
const fs = require('fs/promises');
const { exec, execSync } = require('child_process');
const _ = require('lodash');

const projectRoot = path.join(__dirname, '..');
// const shx = path.join(projectRoot, 'node_modules', '.bin', 'shx');

const v2DevnetIdlPath = path.join(projectRoot, './src/idl/devnet.json');
const v2MainnetIdlPath = path.join(projectRoot, './src/idl/mainnet.json');
const v2GeneratedPath = path.join(projectRoot, './src/generated');

const attestationDevnetIdlPath = path.join(
  projectRoot,
  './src/idl/attestation-devnet.json'
);
const attestationGeneratedPath = path.join(
  projectRoot,
  './src/attestation-generated'
);

const switchboardCoreDir = path.join(
  projectRoot,
  '../../../switchboard-core/switchboard_v2'
);
const switchboardV2IdlPath = path.join(
  switchboardCoreDir,
  'target/idl/switchboard_v2.json'
);
const switchboardAttestationIdlPath = path.join(
  switchboardCoreDir,
  'target/idl/switchboard_attestation_program.json'
);

// Super hacky. Some files need to be reset to the previous git state and will be manually managed
const ignoreFiles = [
  `${v2GeneratedPath}/types/SwitchboardPermission.ts`, // we manually added NONE enumeration
  `${v2GeneratedPath}/types/SwitchboardDecimal.ts`, // added toBig methods
  `${v2GeneratedPath}/types/Lanes.ts`, // anchor-client-gen struggles with dual exports
  `${v2GeneratedPath}/types/index.ts`, // TODO: Need a better way to handle this. anchor-client-gen adds multiple, broken exports (for VRF builder)
  `${v2GeneratedPath}/errors/index.ts`, // need to revert the program ID check,
  `${attestationGeneratedPath}/types/VerificationStatus.ts`, // need to revert the program ID check
];

/**
 * Fetch a list of filepaths for a given directory and desired file extension
 * @param [dirPath] Filesystem path to a directory to search.
 * @param [arrayOfFiles] An array of existing file paths for recursive calls
 * @param [extensions] Optional, an array of desired extensions with the leading separator '.'
 * @throws {String}
 * @returns {string[]}
 */
const getAllFiles = async (dirPath, arrayOfFiles, extensions) => {
  const files = await fs.readdir(dirPath, 'utf8');

  arrayOfFiles = arrayOfFiles || [];

  for await (const file of files) {
    if (fsSync.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = await getAllFiles(
        dirPath + '/' + file,
        arrayOfFiles,
        extensions
      );
    } else {
      const ext = path.extname(file);
      if (extensions && Array.isArray(extensions) && extensions.includes(ext)) {
        arrayOfFiles.push(path.join(dirPath, '/', file));
      } else {
        arrayOfFiles.push(path.join(dirPath, '/', file));
      }
      // if (!(extensions === undefined) || extensions.includes(ext)) {
      //   arrayOfFiles.push(path.join(dirPath, '/', file));
      // }
    }
  }

  return arrayOfFiles;
};

async function main() {
  shell.cd(projectRoot);

  // generate IDL types from local directory
  let devMode = false;
  if (process.argv.slice(2).includes('--dev')) {
    devMode = true;
  }

  if (!shell.which('anchor')) {
    shell.echo(
      "Sorry, this script requires 'anchor' to be installed in your $PATH"
    );
    shell.exit(1);
  }

  // Fetch IDLs and cleaning generated directories
  console.log(`Fetching anchor IDLs ...`);
  await Promise.all([
    runCommandAsync(
      `anchor idl fetch -o ${v2MainnetIdlPath} SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f --provider.cluster mainnet`,
      {
        encoding: 'utf-8',
      }
    ),
    runCommandAsync(
      `anchor idl fetch -o ${v2DevnetIdlPath} SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f --provider.cluster devnet`,
      {
        encoding: 'utf-8',
      }
    ),
    runCommandAsync(
      `anchor idl fetch -o ${attestationDevnetIdlPath} 2No5FVKPAAYqytpkEoq93tVh33fo4p6DgAnm4S6oZHo7 --provider.cluster devnet`,
      {
        encoding: 'utf-8',
      }
    ),
    fs.rm(v2GeneratedPath, { recursive: true }),
    fs.rm(attestationGeneratedPath, { recursive: true }),
  ]);

  console.log(`Running anchor-client-gen ...`);
  if (devMode) {
    await Promise.all([
      runCommandAsync(
        `npx anchor-client-gen --program-id SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f ${switchboardV2IdlPath} ${v2GeneratedPath}`,
        { encoding: 'utf-8' }
      ),
      runCommandAsync(
        `npx anchor-client-gen --program-id 2No5FVKPAAYqytpkEoq93tVh33fo4p6DgAnm4S6oZHo7 ${switchboardAttestationIdlPath} ${attestationGeneratedPath}`,
        { encoding: 'utf-8' }
      ),
    ]);
  } else {
    await Promise.all([
      runCommandAsync(
        `npx anchor-client-gen --program-id SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f ${v2DevnetIdlPath} ${v2GeneratedPath}`,
        { encoding: 'utf-8' }
      ),
      runCommandAsync(
        `npx anchor-client-gen --program-id 2No5FVKPAAYqytpkEoq93tVh33fo4p6DgAnm4S6oZHo7 ${attestationDevnetIdlPath} ${attestationGeneratedPath}`,
        { encoding: 'utf-8' }
      ),
    ]);
  }

  await Promise.all([
    fs.writeFile(
      `${v2GeneratedPath}/index.ts`,
      [
        "export * from './accounts';",
        "export * from './errors';",
        "export * from './instructions';",
        "export * from './types';",
      ].join('\n')
    ),

    fs.writeFile(
      `${attestationGeneratedPath}/index.ts`,
      [
        "export * from './accounts';",
        "export * from './errors';",
        "export * from './instructions';",
        "export * from './types';",
      ].join('\n')
    ),
  ]);

  // loop through directory and run regex replaces
  const allGeneratedFiles = _.flatten(
    await Promise.all([
      getAllFiles(`${v2GeneratedPath}/accounts`),
      getAllFiles(`${v2GeneratedPath}/errors`),
      getAllFiles(`${v2GeneratedPath}/instructions`),
      getAllFiles(`${v2GeneratedPath}/types`),
      getAllFiles(`${attestationGeneratedPath}/accounts`),
      getAllFiles(`${attestationGeneratedPath}/errors`),
      getAllFiles(`${attestationGeneratedPath}/instructions`),
      getAllFiles(`${attestationGeneratedPath}/types`),
    ])
  );

  console.log(`Processing ${allGeneratedFiles.length} files ...`);
  await Promise.all(allGeneratedFiles.map(f => processGeneratedFile(f)));

  console.log(`Formatting generated files ...`);
  await Promise.all([
    runCommandAsync(`npx prettier ${v2GeneratedPath} --write`, {
      encoding: 'utf-8',
    }),
    runCommandAsync(`npx prettier ${attestationGeneratedPath} --write`, {
      encoding: 'utf-8',
    }),
  ]);

  // reset ignored files
  for (const file of ignoreFiles) {
    execSync(`git restore ${file}`, { encoding: 'utf-8' });
  }

  // run auto fix for import ordering
  execSync(`pnpm fix`, { encoding: 'utf-8' });
}

main()
  .then(() => {
    // console.log("Executed successfully");
  })
  .catch(err => {
    console.error(err);
  });

/**
 * Process the generated file and add the SwitchboardProgram class
 */
async function processGeneratedFile(file) {
  if (file.includes('index.ts')) return;

  const fileString = await fs.readFile(file, 'utf-8');
  await fs.writeFile(
    file,
    `import { SwitchboardProgram } from "../../SwitchboardProgram"\n${fileString}`
  );

  // replace BN import
  shell.sed(
    '-i',
    'import BN from "bn.js"',
    'import { BN } from "@switchboard-xyz/common"',
    file
  );
  // replace borsh import
  shell.sed('-i', '@project-serum', '@coral-xyz', file);
  // remove PROGRAM_ID import, we will use SwitchboardProgram instead
  shell.sed('-i', 'import { PROGRAM_ID } from "../programId"', '', file);
  // replace PROGRAM_ID with program.programId
  shell.sed('-i', 'PROGRAM_ID', 'program.programId', file);
  // replace Connection with SwitchboardProgram
  shell.sed('-i', 'c: Connection,', 'program: SwitchboardProgram,', file);
  // replace c.getAccountInfo with the SwitchboardProgram connection
  shell.sed(
    '-i',
    'c.getAccountInfo',
    'program.connection.getAccountInfo',
    file
  );
  // replace c.getMultipleAccountsInfo with the SwitchboardProgram connection
  shell.sed(
    '-i',
    'c.getMultipleAccountsInfo',
    'program.connection.getMultipleAccountsInfo',
    file
  );

  if (file.includes('/instructions/')) {
    // add program as first arguement to instructions
    shell.sed('-i', 'args:', 'program: SwitchboardProgram, args:', file);
  }

  if (file.includes('/attestation-generated/')) {
    // attestation-generated files use the attestationProgramId instead of programId
    shell.sed('-i', 'program.programId', 'program.attestationProgramId', file);
  }
}

async function runCommandAsync(command, options) {
  return new Promise((resolve, reject) => {
    const cmd = exec(command, options);

    // cmd.stdout.on('data', data => {
    //   console.log(data.toString());
    // });

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
