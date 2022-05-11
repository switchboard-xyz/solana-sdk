import { test } from "@oclif/test";

describe("incorrect cluster provided", () => {
  test
    .stdout()
    .command([
      "job:create:template",
      "-c",
      "nocluster",
      "./dummy-keypair.json",
      "ftxUs",
      "BTC_USD",
    ])
    .catch("Invalid cluster provided nocluster")
    .it("incorrect cluster should throw an error");
});
