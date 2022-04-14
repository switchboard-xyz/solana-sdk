import type { Program } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import type { AnchorVrfParser } from "../target/types/anchor_vrf_parser";

describe("anchor-vrf-parser", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.AnchorVrfParser as Program<AnchorVrfParser>;

  it("Is initialized!", async () => {
    // Add your test here.
    console.log("No test specified");
  });
});
