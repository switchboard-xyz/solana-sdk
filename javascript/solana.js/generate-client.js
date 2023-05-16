const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const projectRoot = __dirname;
// const shx = path.join(projectRoot, 'node_modules', '.bin', 'shx');

const v2DevnetIdlPath = './src/idl/devnet.json';
const v2MainnetIdlPath = './src/idl/mainnet.json';
const v2GeneratedPath = './src/generated';

const attestationDevnetIdlPath = './src/idl/attestation-devnet.json';
const attestationGeneratedPath = './src/attestation-generated';

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
const getAllFiles = (dirPath, arrayOfFiles, extensions) => {
  const files = fs.readdirSync(dirPath, 'utf8');

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(file => {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(
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
  });

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

  execSync(
    `anchor idl fetch -o ${v2MainnetIdlPath} SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f --provider.cluster mainnet`,
    { encoding: 'utf-8' }
  );
  execSync(
    `anchor idl fetch -o ${v2DevnetIdlPath} SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f --provider.cluster devnet`,
    { encoding: 'utf-8' }
  );

  execSync(
    `anchor idl fetch -o ${attestationDevnetIdlPath} 2No5FVKPAAYqytpkEoq93tVh33fo4p6DgAnm4S6oZHo7 --provider.cluster devnet`,
    { encoding: 'utf-8' }
  );

  if (devMode) {
    execSync(
      `rm -rf ${v2GeneratedPath} && npx anchor-client-gen --program-id SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f ../../../switchboard-core/switchboard_v2/target/idl/switchboard_v2.json ${v2GeneratedPath}`,
      { encoding: 'utf-8' }
    );
    execSync(
      `rm -rf ${attestationGeneratedPath} && npx anchor-client-gen --program-id 2No5FVKPAAYqytpkEoq93tVh33fo4p6DgAnm4S6oZHo7 ../../../switchboard-core/switchboard_v2/target/idl/switchboard_attestation_program.json ${attestationGeneratedPath}`,
      { encoding: 'utf-8' }
    );
  } else {
    execSync(
      `rm -rf ${v2GeneratedPath} && npx anchor-client-gen --program-id SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f ${v2DevnetIdlPath} ${v2GeneratedPath}`,
      { encoding: 'utf-8' }
    );
    execSync(
      `rm -rf ${attestationGeneratedPath} && npx anchor-client-gen --program-id 2No5FVKPAAYqytpkEoq93tVh33fo4p6DgAnm4S6oZHo7 ${attestationDevnetIdlPath} ${attestationGeneratedPath}`,
      { encoding: 'utf-8' }
    );
  }

  fs.writeFileSync(
    `${v2GeneratedPath}/index.ts`,
    [
      "export * from './accounts';",
      "export * from './errors';",
      "export * from './instructions';",
      "export * from './types';",
    ].join('\n')
  );
  fs.writeFileSync(
    `${attestationGeneratedPath}/index.ts`,
    [
      "export * from './accounts';",
      "export * from './errors';",
      "export * from './instructions';",
      "export * from './types';",
    ].join('\n')
  );

  // loop through directory and run regex replaces
  for await (const file of [
    ...getAllFiles(`${v2GeneratedPath}/accounts`),
    ...getAllFiles(`${v2GeneratedPath}/errors`),
    ...getAllFiles(`${v2GeneratedPath}/instructions`),
    ...getAllFiles(`${v2GeneratedPath}/types`),
    ...getAllFiles(`${attestationGeneratedPath}/accounts`),
    ...getAllFiles(`${attestationGeneratedPath}/errors`),
    ...getAllFiles(`${attestationGeneratedPath}/instructions`),
    ...getAllFiles(`${attestationGeneratedPath}/types`),
  ]) {
    if (file.includes('index.ts')) continue;

    const fileString = fs.readFileSync(file, 'utf-8');
    fs.writeFileSync(
      file,
      `import { SwitchboardProgram } from "../../SwitchboardProgram"\n${fileString}`
    );

    console.log(file);

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
      shell.sed(
        '-i',
        'program.programId',
        'program.attestationProgramId',
        file
      );
    }
  }

  execSync(`npx prettier ${v2GeneratedPath} --write`, { encoding: 'utf-8' });
  execSync(`npx prettier ${attestationGeneratedPath} --write`, {
    encoding: 'utf-8',
  });

  // reset files
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
