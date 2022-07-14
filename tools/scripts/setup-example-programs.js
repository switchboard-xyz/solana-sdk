#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */

/**
 * This script will
 *  - Build any anchor projects if missing
 *  - Grab anchor project IDs
 *  - Update project IDs in Anchor.toml and lib.rs
 */

const shell = require("shelljs");
const { spawn, execSync } = require("child_process");
const web3 = require("@solana/web3.js");
const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..", "..");
const targetDir = path.join(projectRoot, "target");
const idlDir = path.join(targetDir, "idl");
const anchorToml = path.join(projectRoot, "Anchor.toml");

const anchorClientGen = path.join(
  projectRoot,
  "node_modules",
  ".bin",
  "anchor-client-gen"
);
const shx = path.join(projectRoot, "node_modules", ".bin", "shx");

const anchorVrfKeypairPath = path.join(
  targetDir,
  "deploy",
  "anchor_vrf_parser-keypair.json"
);

const anchorFeedKeypairPath = path.join(
  targetDir,
  "deploy",
  "anchor_feed_parser-keypair.json"
);

const splFeedKeypairPath = path.join(
  targetDir,
  "deploy",
  "native_feed_parser-keypair.json"
);

async function main() {
  shell.cd(projectRoot);

  if (!shell.which("solana")) {
    shell.echo(
      "Sorry, this script requires 'solana' to be installed in your $PATH"
    );
    shell.exit(1);
  }

  if (!shell.which("anchor")) {
    shell.echo(
      "Sorry, this script requires 'anchor' to be installed in your $PATH"
    );
    shell.exit(1);
  }

  if (!fs.existsSync(path.join(targetDir, "deploy"))) {
    shell.echo("Missing program deploy keypairs, building projects");
    const anchorBuildSpawn = spawn("anchor", ["build"]);
    anchorBuildSpawn.stdout.on("data", function (msg) {
      console.log(msg.toString());
    });
    await new Promise((resolve) => {
      anchorBuildSpawn.on("close", resolve);
    });
  }

  const anchorVrfParserPid = web3.Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(anchorVrfKeypairPath, "utf8")))
  ).publicKey;
  const anchorFeedParserPid = web3.Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(anchorFeedKeypairPath, "utf8")))
  ).publicKey;
  const splFeedParserPid = web3.Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(splFeedKeypairPath, "utf8")))
  ).publicKey;

  // REPLACE ANCHOR-VRF-PROGRAM IDS
  console.log(`Anchor VRF Parser PID:    ${anchorVrfParserPid}`);
  shell.sed(
    "-i",
    /declare_id!(.*);/,
    `declare_id!("${anchorVrfParserPid.toString()}");`,
    path.join(projectRoot, "programs", "anchor-vrf-parser", "src", "lib.rs")
  );
  shell.sed(
    "-i",
    /anchor_vrf_parser = "(.*)"/,
    `anchor_vrf_parser = "${anchorVrfParserPid.toString()}"`,
    anchorToml
  );

  console.log(`Anchor Feed Parser PID:   ${anchorFeedParserPid}`);
  shell.sed(
    "-i",
    /declare_id!(.*);/,
    `declare_id!("${anchorFeedParserPid.toString()}");`,
    path.join(projectRoot, "programs", "anchor-feed-parser", "src", "lib.rs")
  );
  shell.sed(
    "-i",
    /anchor_feed_parser = "(.*)"/,
    `anchor_feed_parser = "${anchorFeedParserPid.toString()}"`,
    anchorToml
  );

  console.log(`SPL Feed Parser PID:      ${splFeedParserPid}`);
  shell.sed(
    "-i",
    /declare_id!(.*);/,
    `declare_id!("${splFeedParserPid.toString()}");`,
    path.join(projectRoot, "programs", "native-feed-parser", "src", "lib.rs")
  );
  shell.sed(
    "-i",
    /native_feed_parser = "(.*)"/,
    `native_feed_parser = "${splFeedParserPid.toString()}"`,
    anchorToml
  );

  // Build Anchor APIs
  const vrfClientPath = path.join(
    projectRoot,
    "programs",
    "anchor-vrf-parser",
    "client"
  );
  shell.rm("-rf", vrfClientPath);
  fs.mkdirSync(vrfClientPath, { recursive: true });
  execSync(
    `node ${anchorClientGen} ${path.join(
      idlDir,
      "anchor_vrf_parser.json"
    )} ${vrfClientPath} --program-id ${anchorVrfParserPid.toString()}`
  );
  const feedClientPath = path.join(
    projectRoot,
    "programs",
    "anchor-feed-parser",
    "client"
  );
  shell.rm("-rf", feedClientPath);
  fs.mkdirSync(feedClientPath, { recursive: true });
  execSync(
    `node ${anchorClientGen} ${path.join(
      idlDir,
      "anchor_feed_parser.json"
    )} ${feedClientPath} --program-id ${anchorFeedParserPid.toString()}`
  );
}

main()
  .then(() => {
    // console.log("Executed successfully");
  })
  .catch((err) => {
    console.error(err);
  });
