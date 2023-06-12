import "mocha";

import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider } from "@coral-xyz/anchor";

import { SwitchboardFeedClient } from "../target/types/switchboard_feed_client";

describe("switchboard-feed-client test", () => {
  const provider = AnchorProvider.env();
  anchor.setProvider(provider);

  const program: anchor.Program<SwitchboardFeedClient> =
    anchor.workspace.AnchorVrfParser;

  before(async () => {});

  it("Reads a Switchboard data feed", async () => {});
});
