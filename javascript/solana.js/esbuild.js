/* eslint node/no-unpublished-require: 0 */
/* eslint no-unused-vars: 0 */

import { build } from "esbuild";
import path from "path";
import fs from "fs";
import shell from "shelljs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildFiles = ["tsconfig.tsbuildinfo"];

const isCI =
  process.env.CI && process.env.CI.length > 0 ? Boolean(process.env.CI) : false;

const tscPath = path.relative(
  process.cwd(),
  path.join(__dirname, "node_modules", "typescript", "bin", "tsc")
);

const outDir = path.join(__dirname, "lib");

const commonOptions = {
  bundle: true,
  minify: true,
  treeShaking: true,
  platform: "node",
  sourcemap: true,
  sourcesContent: false,
  target: "node16",
  plugins: [],
  legalComments: "none",
};

const entrypoints = {
  index: "index",
  SwitchboardProgram: "SwitchboardProgram",
  TransactionObject: "TransactionObject",
  AggregatorAccount: "accounts/AggregatorAccount",
  generated: "generated/index",
  "generated/accounts": "generated/accounts",
  "generated/instructions": "generated/instructions",
  "generated/types": "generated/types",
  "generated/oracle": "generated/oracle-program/index",
  "generated/oracle/accounts": "generated/oracle-program/accounts/index",
  "generated/oracle/instructions":
    "generated/oracle-program/instructions/index",
  "generated/oracle/types": "generated/oracle-program/types/index",
  "generated/attestation": "generated/attestation-program/index",
  "generated/attestation/accounts":
    "generated/attestation-program/accounts/index",
  "generated/attestation/instructions":
    "generated/attestation-program/instructions/index",
  "generated/attestation/types": "generated/attestation-program/types/index",
};

const updateJsonFile = (relativePath, updateFunction) => {
  const contents = fs.readFileSync(relativePath).toString();
  const res = updateFunction(JSON.parse(contents));
  fs.writeFileSync(relativePath, JSON.stringify(res, null, 2) + "\n");
};

const generateFiles = () => {
  const files = [...Object.entries(entrypoints), ["index", "index"]].flatMap(
    ([key, value]) => {
      const nrOfDots = key.split("/").length - 1;
      const relativePath = "../".repeat(nrOfDots) || "./";
      const compiledPath = `${relativePath}lib/${value}.js`;
      return [
        [
          `${key}.cjs`,
          `module.exports = require('${relativePath}lib/${value}.cjs');`,
        ],
        [`${key}.js`, `export * from '${compiledPath}'`],
        [`${key}.d.ts`, `export * from '${compiledPath}'`],
      ];
    }
  );

  return Object.fromEntries(files);
};

const updateConfig = () => {
  // Update tsconfig.json `typedocOptions.entryPoints` field
  updateJsonFile("./tsconfig.json", (json) => ({
    ...json,
    typedocOptions: {
      ...json.typedocOptions,
      entryPoints: [...Object.keys(entrypoints)].map(
        (key) => `src/${entrypoints[key]}.ts`
      ),
    },
  }));

  const generatedFiles = generateFiles();
  const filenames = Object.keys(generatedFiles);

  // Update package.json `exports` and `files` fields
  updateJsonFile("./package.json", (json) => ({
    ...json,
    exports: Object.assign(
      Object.fromEntries(
        ["index", ...Object.keys(entrypoints)].map((key) => {
          const entryPoint = {
            types: `./${key}.d.ts`,
            import: `./${key}.js`,
            require: `./${key}.cjs`,
          };

          return [key === "index" ? "." : `./${key}`, entryPoint];
        })
      ),
      { "./package.json": "./package.json" }
    ),
    files: ["lib/", "package.json", ...filenames],
  }));

  // Write generated files
  Object.entries(generatedFiles).forEach(([filename, content]) => {
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    fs.writeFileSync(filename, content);
  });

  // Update .gitignore
  fs.writeFileSync("./.gitignore", filenames.join("\n") + "\n");
};

async function main() {
  fs.rmSync(outDir, {
    force: true,
    recursive: true,
  });
  for (const file of buildFiles) {
    if (fs.existsSync(file)) {
      fs.rmSync(file);
    }
  }

  fs.mkdirSync(outDir, { recursive: true });

  execSync(`${tscPath} --outDir lib`, { encoding: "utf-8" });

  execSync(`${tscPath} --outDir lib-cjs -p tsconfig.cjs.json`, {
    encoding: "utf-8",
  });
  execSync(`tsx scripts/move-cjs-to-lib`, {
    encoding: "utf-8",
  });
  fs.rmSync("lib-cjs", { recursive: true });

  console.log(`Generating entrypoints ...`);
  updateConfig();
}

main().catch((error) => {
  console.error(error);
  throw error;
});
