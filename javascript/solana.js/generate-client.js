const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const projectRoot = __dirname;
// const shx = path.join(projectRoot, 'node_modules', '.bin', 'shx');

// Super hacky. Some files need to be reset to the previous git state and will be manually managed
const ignoreFiles = [
  './src/generated/types/SwitchboardPermission.ts', // we manually added NONE enumeration
  './src/generated/types/SwitchboardDecimal.ts', // added toBig methods
  './src/generated/types/Lanes.ts', // anchor-client-gen struggles with dual exports
  './src/generated/types/index.ts', // TODO: Need a better way to handle this. anchor-client-gen adds multiple, broken exports (for VRF builder)
  './src/generated/errors/index.ts', // need to revert the program ID check
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
    'anchor idl fetch -o ./src/idl/mainnet.json SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f --provider.cluster mainnet'
  );
  execSync(
    'anchor idl fetch -o ./src/idl/devnet.json SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f --provider.cluster devnet'
  );

  if (devMode) {
    execSync(
      'rm -rf ./src/generated && npx anchor-client-gen --program-id SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f ../../../switchboard-core/switchboard_v2/target/idl/switchboard_v2.json ./src/generated'
    );
  } else {
    execSync(
      'rm -rf ./src/generated && npx anchor-client-gen --program-id SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f ./src/idl/devnet.json ./src/generated'
    );
  }

  fs.writeFileSync(
    './src/generated/index.ts',
    [
      "export * from './accounts';",
      "export * from './errors';",
      "export * from './instructions';",
      "export * from './types';",
    ].join('\n')
  );

  // loop through directory and run regex replaces
  for await (const file of [
    ...getAllFiles('./src/generated/accounts'),
    ...getAllFiles('./src/generated/errors'),
    ...getAllFiles('./src/generated/instructions'),
    ...getAllFiles('./src/generated/types'),
  ]) {
    if (file.includes('index.ts')) {
      continue;
    }
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

    // add program as first arguement to instructions
    if (file.includes('/instructions/')) {
      shell.sed('-i', 'args:', 'program: SwitchboardProgram, args:', file);
    }
  }

  execSync('npx prettier ./src/generated --write');

  // reset files
  for (const file of ignoreFiles) {
    execSync(`git restore ${file}`);
  }
}

main()
  .then(() => {
    // console.log("Executed successfully");
  })
  .catch(err => {
    console.error(err);
  });
