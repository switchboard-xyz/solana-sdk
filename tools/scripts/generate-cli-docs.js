#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */

/**
 * This script will
 *  - Generate OCLIF CLI documentation
 *  - Add underscores to filenames so they are hidden in docusaurus sidebar
 *  - Remove first two lines so they are partial MDX files and can be imported
 */

const shell = require("shelljs");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const projectRoot = path.join(__dirname, "..", "..");
const cliPath = path.join(projectRoot, "cli");
const cliOutPath = path.join(projectRoot, "website", "api", "cli");
const cliOutRelPath = path.relative(cliPath, cliOutPath);
const oclifBin = path.join(
  projectRoot,
  "cli",
  "node_modules",
  ".bin",
  "oclif-dev"
);

// Generate Oclif documentation
shell.cd(cliPath);
if (shell.exec(`${oclifBin} readme`).code !== 0) {
  shell.echo(`Error: Oclif failed to generate documentation`);
  shell.exit(1);
}
if (
  shell.exec(`${oclifBin} readme --multi --dir ${cliOutRelPath}`).code !== 0
) {
  shell.echo(`Error: Oclif failed to generate documentation`);
  shell.exit(1);
}

shell.cd(cliOutPath);

// Remove old underscored files
shell.ls(`_*.md`).forEach((file) => {
  shell.rm(file);
});

// Add underscores, remove first two lines, and update documentation path
shell.ls(`*.md`).forEach((file) => {
  // add underscore to filename
  const fileName = path.basename(file);
  const underscoredFileName = "_" + fileName;
  shell.mv("-f", fileName, underscoredFileName);

  // TODO: Update URL to release tag
  // update github documentation links
  shell.sed(
    "-i",
    `https://github.com/switchboard-xyz/switchboard-v2/blob/.*/src`,
    "https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src",
    underscoredFileName
  );

  // remove first two lines
  fs.writeFileSync(
    underscoredFileName,
    fs.readFileSync(underscoredFileName, "utf8").split("\n").slice(2).join("\n")
  );
});
