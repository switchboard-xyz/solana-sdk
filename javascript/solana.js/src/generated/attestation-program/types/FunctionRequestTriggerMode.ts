import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface IndependentJSON {
  kind: "Independent";
}

export class Independent {
  static readonly discriminator = 0;
  static readonly kind = "Independent";
  readonly discriminator = 0;
  readonly kind = "Independent";

  toJSON(): IndependentJSON {
    return {
      kind: "Independent",
    };
  }

  toEncodable() {
    return {
      Independent: {},
    };
  }
}

export interface ManagedJSON {
  kind: "Managed";
}

export class Managed {
  static readonly discriminator = 1;
  static readonly kind = "Managed";
  readonly discriminator = 1;
  readonly kind = "Managed";

  toJSON(): ManagedJSON {
    return {
      kind: "Managed",
    };
  }

  toEncodable() {
    return {
      Managed: {},
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.FunctionRequestTriggerModeKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object");
  }

  if ("Independent" in obj) {
    return new Independent();
  }
  if ("Managed" in obj) {
    return new Managed();
  }

  throw new Error("Invalid enum object");
}

export function fromJSON(
  obj: types.FunctionRequestTriggerModeJSON
): types.FunctionRequestTriggerModeKind {
  switch (obj.kind) {
    case "Independent": {
      return new Independent();
    }
    case "Managed": {
      return new Managed();
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Independent"),
    borsh.struct([], "Managed"),
  ]);
  if (property !== undefined) {
    return ret.replicate(property);
  }
  return ret;
}
