/* eslint-disable unicorn/no-process-exit */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable unicorn/prefer-module */
const PROGRAM_NAME = "anchor_vrf_parser";
const PROGRAM_ID = "FAnbznqZvZ7eijxQ6mKPoyDdM33o8cdM6wsUZtv2dFib";

import { Solita } from "@metaplex-foundation/solita";
import { spawn } from "child_process";
import { writeFile } from "fs/promises";
import path from "path";
const programDir = path.join(__dirname, "programs");
const generatedIdlDir = path.join(__dirname, "target", "idl");
const generatedSDKDir = path.join(__dirname, "src", "generated");

const anchor = spawn("anchor", ["build", "--idl", generatedIdlDir], {
  cwd: programDir,
})
  .on("error", (err) => {
    console.error(err);
    // @ts-ignore this err does have a code
    if (err.code === "ENOENT") {
      console.error(
        "Ensure that `anchor` is installed and in your path, see:\n  https://project-serum.github.io/anchor/getting-started/installation.html#install-anchor\n"
      );
    }
    process.exit(1);
  })
  .on("exit", () => {
    console.log(
      "IDL written to: %s",
      path.join(generatedIdlDir, `${PROGRAM_NAME}.json`)
    );
    generateTypeScriptSDK();
  });

anchor.stdout.on("data", (buf) => console.log(buf.toString("utf8")));
anchor.stderr.on("data", (buf) => console.error(buf.toString("utf8")));

async function generateTypeScriptSDK() {
  console.error("Generating TypeScript SDK to %s", generatedSDKDir);
  const generatedIdlPath = path.join(generatedIdlDir, `${PROGRAM_NAME}.json`);

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const idl = require(generatedIdlPath);
  if (idl.metadata?.address == undefined) {
    idl.metadata = { ...idl.metadata, address: PROGRAM_ID };
    await writeFile(generatedIdlPath, JSON.stringify(idl, undefined, 2));
  }
  const gen = new Solita(idl, { formatCode: true });
  await gen.renderAndWriteTo(generatedSDKDir);

  console.error("Success!");

  process.exit(0);
}

export {};
