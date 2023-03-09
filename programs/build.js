const path = require("node:path");
const fs = require("node:fs");
const shell = require("shelljs");

function verifyBinary(binaryName, installationUrl) {
  if (!shell.which(binaryName)) {
    shell.echo(
      `Sorry, this script requires '${binaryName}' to be installed in your $PATH`
    );
    shell.echo(`See installation to get started: ${installationUrl}`);
    shell.exit(1);
  }
}

function helperText() {
  shell.echo(
    `node build.js [PACKAGE_NAME] [PUBKEY]\n\nExample:\nnode build.js anchor-buffer-parser 96punQGZDShZGkzsBa3SsfTxfUnwu4XGpzXbhF7NTgcP`
  );
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    helperText();
    throw new Error(`Incorrect number of arguements provided`);
  }
  const packageName = args[0];
  const programName = packageName.replaceAll("-", "_");

  const pubkey = args[1];
  if (pubkey.length === 0) {
    helperText();
    throw new Error(`Failed to provide the program pubkey`);
  }

  const skipBuild = args.includes("--skipBuild");

  verifyBinary(
    "solana",
    "https://docs.solana.com/cli/install-solana-cli-tools"
  );
  verifyBinary(
    "anchor",
    "https://book.anchor-lang.com/getting_started/installation.html"
  );

  // check if its a valid package name
  const packagePath = path.join(__dirname, packageName);
  if (!fs.existsSync(packagePath)) {
    throw new Error(`Failed to find directory for ${packageName}`);
  }

  // check if directory has an existing program ID keypair
  const keypairDir = path.join(packagePath, "target", "deploy");
  const keypairPath = path.join(keypairDir, `${programName}-keypair.json`);
  if (!fs.existsSync(keypairPath)) {
    if (!fs.existsSync(keypairDir)) {
      fs.mkdirSync(keypairDir, { recursive: true });
    }
    shell.exec(
      `solana-keygen new -s --no-bip39-passphrase --outfile ${keypairPath}`
    );
  }

  const programId = shell
    .exec(`solana-keygen pubkey ${keypairPath}`)
    .toString()
    .trim();

  // update the program ID
  const anchorTomlPath = path.join(packagePath, "Anchor.toml");
  if (!fs.existsSync(anchorTomlPath)) {
    throw new Error(`Package directory has no Anchor.toml file`);
  }

  const libRsPath = path.join(packagePath, "src", "lib.rs");
  if (!fs.existsSync(libRsPath)) {
    throw new Error(`Package directory has no src/lib.rs file`);
  }

  shell.sed("-i", pubkey, programId, [anchorTomlPath, libRsPath]);

  if (!skipBuild) {
    const currentDirectory = shell.pwd();
    try {
      shell.cd(packagePath);
      shell.exec(`anchor build`);
    } catch (error) {
      console.error(`Anchor build failed: ${error}`);
    }
    shell.cd(currentDirectory);
  }
}

main()
  .then()
  .catch((err) => console.error(err));
