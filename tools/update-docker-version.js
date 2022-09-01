#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */

/**
 * This script will
 *  - Globally update the docker version throughout the repo
 */

const shell = require("shelljs");
const fs = require("fs");
const path = require("path");
const projectRoot = path.join(__dirname, "..", "..");

const ignorePatterns = [
  "git",
  "node_modules",
  ".anchor",
  ".switchboard",
  ".archive",
  ".docusaurus",
  "website/public",
  "target/rls",
  "target/release",
  "target/bpfel-unknown-unknown",
  "target/bpfel-unknown-unknown",
  ".fingerprint",
];
const allowedExtensions = [".md", ".mdx", ".js", ".json", ".yml", ".ts"];

// Regex: dev-v2-[0-9]{1,2}-[0-9]{1,2}-[0-9]{1,2}[A-Za-z]?
shell.cd(projectRoot);

const latestVersionRegex = fs
  .readFileSync(path.join(projectRoot, "Oracle_Version.md"), "utf8")
  .match(/dev-v2-[0-9]{1,2}-[0-9]{1,2}-[0-9]{1,2}[A-Za-z]?/);

if (!latestVersionRegex) {
  throw new Error(
    `Failed to find the latest oracle version in Oracle_Version.md`
  );
}
const latestVersion = latestVersionRegex[0];
console.log(`Latest Oracle Version: ${latestVersion}`);

shell.find(".").forEach((filePath) => {
  // check for ignore patterns
  for (const pattern of ignorePatterns) {
    if (filePath.indexOf(pattern) !== -1) {
      return;
    }
  }

  // check if its a directory
  if (fs.statSync(filePath).isDirectory()) {
    return;
  }

  // check if the extension is applicable
  if (!allowedExtensions.includes(path.parse(filePath).ext)) {
    return;
  }

  // global find and replace
  try {
    shell.sed(
      "-i",
      /dev-v2-[0-9]{1,2}-[0-9]{1,2}-[0-9]{1,2}[A-Za-z]?/g,
      latestVersion,
      filePath
    );
  } catch {}
});
