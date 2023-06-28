#!/usr/bin/env tsx

import { exec, execSync } from "child_process";
import fsSync from "fs";
import fs from "fs/promises";
import _ from "lodash";
import path from "path";
import shell from "shelljs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.join(__dirname, "..");
// const shx = path.join(projectRoot, 'node_modules', '.bin', 'shx');

const v2DevnetIdlPath = path.join(projectRoot, "./idl/devnet.json");
const v2MainnetIdlPath = path.join(projectRoot, "./idl/mainnet.json");
const v2GeneratedPath = path.join(
  projectRoot,
  "./src/generated/oracle-program"
);

const attestationDevnetIdlPath = path.join(
  projectRoot,
  "./idl/attestation-devnet.json"
);
const attestationGeneratedPath = path.join(
  projectRoot,
  "./src/generated/attestation-program"
);

const switchboardCoreDir = path.join(
  projectRoot,
  "../../../switchboard-core/switchboard_v2"
);
const switchboardV2IdlPath = path.join(
  switchboardCoreDir,
  "target/idl/switchboard_v2.json"
);
const switchboardAttestationIdlPath = path.join(
  switchboardCoreDir,
  "target/idl/switchboard_attestation_program.json"
);

// Super hacky. Some files need to be reset to the previous git state and will be manually managed
const ignoreFiles = [
  `${v2GeneratedPath}/types/SwitchboardPermission.ts`, // we manually added NONE enumeration
  `${v2GeneratedPath}/types/SwitchboardDecimal.ts`, // added toBig methods
  `${v2GeneratedPath}/types/Lanes.ts`, // anchor-client-gen struggles with dual exports
  `${v2GeneratedPath}/types/index.ts`, // TODO: Need a better way to handle this. anchor-client-gen adds multiple, broken exports (for VRF builder)
  `${v2GeneratedPath}/errors/index.ts`, // need to revert the program ID check,
  `${attestationGeneratedPath}/types/VerificationStatus.ts`,
  `${attestationGeneratedPath}/errors/index.ts`,
  `${attestationGeneratedPath}/types/SwitchboardAttestationPermission.ts`,
  // `${v2GeneratedPath}/types/VerificationStatus.ts`,
];

/**
 * Fetch a list of filepaths for a given directory and desired file extension
 * @param [dirPath] Filesystem path to a directory to search.
 * @param [arrayOfFiles] An array of existing file paths for recursive calls
 * @param [extensions] Optional, an array of desired extensions with the leading separator '.'
 * @throws {String}
 * @returns {string[]}
 */
const getAllFiles = async (
  dirPath: string,
  arrayOfFiles: string[] = [],
  extensions: string[] = []
): Promise<string[]> => {
  const files = await fs.readdir(dirPath, "utf8");

  arrayOfFiles = arrayOfFiles || [];

  for await (const file of files) {
    if (fsSync.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = await getAllFiles(
        dirPath + "/" + file,
        arrayOfFiles,
        extensions
      );
    } else {
      const ext = path.extname(file);
      if (extensions && Array.isArray(extensions) && extensions.includes(ext)) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      } else {
        arrayOfFiles.push(path.join(dirPath, "/", file));
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
  if (process.argv.slice(2).includes("--dev")) {
    devMode = true;
  }

  if (!shell.which("anchor")) {
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
        encoding: "utf-8",
      }
    ),
    runCommandAsync(
      `anchor idl fetch -o ${v2DevnetIdlPath} SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f --provider.cluster devnet`,
      {
        encoding: "utf-8",
      }
    ),
    runCommandAsync(
      `anchor idl fetch -o ${attestationDevnetIdlPath} sbattyXrzedoNATfc4L31wC9Mhxsi1BmFhTiN8gDshx --provider.cluster devnet`,
      {
        encoding: "utf-8",
      }
    ),
    fsSync.existsSync(v2GeneratedPath)
      ? fs.rm(v2GeneratedPath, { recursive: true })
      : Promise.resolve(),
    fsSync.existsSync(attestationGeneratedPath)
      ? fs.rm(attestationGeneratedPath, { recursive: true })
      : Promise.resolve(),
  ]);

  console.log(`Running anchor-client-gen ...`);
  if (devMode) {
    await Promise.all([
      runCommandAsync(
        `npx anchor-client-gen --program-id SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f ${switchboardV2IdlPath} ${v2GeneratedPath}`,
        { encoding: "utf-8" }
      ),
      runCommandAsync(
        `npx anchor-client-gen --program-id sbattyXrzedoNATfc4L31wC9Mhxsi1BmFhTiN8gDshx ${switchboardAttestationIdlPath} ${attestationGeneratedPath}`,
        { encoding: "utf-8" }
      ),
    ]);
  } else {
    await Promise.all([
      runCommandAsync(
        `npx anchor-client-gen --program-id SW1TCH7qEPTdLsDHRgPuMQjbQxKdH2aBStViMFnt64f ${v2DevnetIdlPath} ${v2GeneratedPath}`,
        { encoding: "utf-8" }
      ),
      runCommandAsync(
        `npx anchor-client-gen --program-id sbattyXrzedoNATfc4L31wC9Mhxsi1BmFhTiN8gDshx ${attestationDevnetIdlPath} ${attestationGeneratedPath}`,
        { encoding: "utf-8" }
      ),
    ]);
  }

  await Promise.all([
    fs.writeFile(
      `${v2GeneratedPath}/index.ts`,
      [
        "export * from './accounts/index.js';",
        "export * from './errors/index.js';",
        "export * from './instructions/index.js';",
        "export * from './types/index.js';",
      ].join("\n")
    ),

    fs.writeFile(
      `${attestationGeneratedPath}/index.ts`,
      [
        "export * from './accounts/index.js';",
        "export * from './errors/index.js';",
        "export * from './instructions/index.js';",
        "export * from './types/index.js';",
      ].join("\n")
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

  await Promise.all(allGeneratedFiles.map((f) => processFile(f)));

  console.log(`Formatting generated files ...`);
  await Promise.all([
    runCommandAsync(`npx prettier ${v2GeneratedPath} --write`, {
      encoding: "utf-8",
    }),
    runCommandAsync(`npx prettier ${attestationGeneratedPath} --write`, {
      encoding: "utf-8",
    }),
  ]);

  // reset ignored files
  for (const file of ignoreFiles) {
    execSync(`git restore ${file}`, { encoding: "utf-8" });
  }

  // delete the extra VerificationStatus
  await fs.rm(path.join(v2GeneratedPath, "types", "VerificationStatus.ts"));

  // run auto fix for import ordering
  execSync(`pnpm fix`, { encoding: "utf-8" });
}

main()
  .then(() => {
    // console.log("Executed successfully");
  })
  .catch((err) => {
    console.error(err);
  });

/**
 * Process the generated file and add the SwitchboardProgram class
 */
const processFile = async (file: string) => {
  return await fs
    .readFile(file, "utf-8")
    .then(async (fileString: string): Promise<string> => {
      let updatedFileString = fileString;

      if (file.endsWith("errors/index.ts")) {
        return updatedFileString
          .replace(
            `import { PROGRAM_ID } from "../programId"`,
            `import { PROGRAM_ID } from "../programId.js"`
          )
          .replace(
            `import * as anchor from "./anchor"`,
            `import * as anchor from "./anchor.js"`
          )
          .replace(
            `import * as custom from "./custom"`,
            `import * as custom from "./custom.js"`
          );
      }
      if (file.includes("index.ts")) {
        // add the .js extension to all local import/export paths
        return updatedFileString.replace(
          /((import|export)((\s\w+)?([^'"]*))from\s['"])([^'"]+)(['"])/gm,
          "$1$6.js$7"
        );
      }

      updatedFileString =
        `import { SwitchboardProgram } from "../../../SwitchboardProgram.js"` +
        "\n" +
        fileString;

      // update the types import
      updatedFileString = updatedFileString
        // use full path
        .replace(
          `import * as types from "../types"`,
          `import * as types from "../types/index.js"`
        )

        // use our library to avoid version conflicts
        .replace(
          `import BN from "bn.js"`,
          `import { BN } from "@switchboard-xyz/common"`
        )
        // better
        .replace(
          `import * as borsh from "@project-serum/borsh"`,
          `import * as borsh from "@coral-xyz/borsh"`
        )
        // remove this import, using SwitchboardProgram
        .replace(`import { PROGRAM_ID } from "../programId"`, ``)
        .replaceAll(`PROGRAM_ID`, `program.programId`)
        .replaceAll(`c: Connection,`, `program: SwitchboardProgram,`)
        .replaceAll(`c.getAccountInfo`, `program.connection.getAccountInfo`)
        .replaceAll(
          `c.getMultipleAccountsInfo`,
          `program.connection.getMultipleAccountsInfo`
        );

      if (file.includes("/instructions/")) {
        updatedFileString = updatedFileString.replaceAll(
          `args:`,
          `program: SwitchboardProgram, args:`
        );
      }

      if (file.includes("/attestation-program/")) {
        updatedFileString = updatedFileString.replaceAll(
          `program.programId`,
          `program.attestationProgramId`
        );
      }

      return updatedFileString;
    })
    .then(async (updatedFileString: string) => {
      return await fs.writeFile(file, updatedFileString, "utf-8");
    });
};

async function runCommandAsync(
  command: string,
  options: Record<string, any>
): Promise<void> {
  return new Promise((resolve, reject) => {
    const cmd = exec(command, options);

    // cmd.stdout.on('data', data => {
    //   console.log(data.toString());
    // });

    cmd?.stderr?.on("data", (data) => {
      console.error(data.toString());
    });

    // cmd.on("message", (data) => {
    //   console.info(data.toString());
    // });

    cmd.on("error", (error) => {
      reject(error);
    });

    cmd.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Command exited with code ${code}`));
      } else {
        resolve(undefined);
      }
    });
  });
}
