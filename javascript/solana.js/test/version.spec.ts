/* eslint-disable no-unused-vars */
import "mocha";

import type { TestContext } from "./utils.js";
import { setupTest } from "./utils.js";

import assert from "assert";

describe("Git Version Tests", () => {
  let ctx: TestContext;

  before(async () => {
    ctx = await setupTest();
  });

  it("Gets the oracle program's git version", async () => {
    const version = await ctx.program.getGitVersion();
    console.log(`Oracle Version: ${version}`);
  });

  it("Gets the attestation program's git version", async () => {
    const version = await ctx.program.getAttestationGitVersion();
    console.log(`Attestation Version: ${version}`);
  });
});
