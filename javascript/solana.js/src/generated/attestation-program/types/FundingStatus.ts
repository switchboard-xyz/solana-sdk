import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface InactiveJSON {
  kind: "Inactive";
}

export class Inactive {
  static readonly discriminator = 0;
  static readonly kind = "Inactive";
  readonly discriminator = 0;
  readonly kind = "Inactive";

  toJSON(): InactiveJSON {
    return {
      kind: "Inactive",
    };
  }

  toEncodable() {
    return {
      Inactive: {},
    };
  }
}

export interface ActiveJSON {
  kind: "Active";
}

export class Active {
  static readonly discriminator = 1;
  static readonly kind = "Active";
  readonly discriminator = 1;
  readonly kind = "Active";

  toJSON(): ActiveJSON {
    return {
      kind: "Active",
    };
  }

  toEncodable() {
    return {
      Active: {},
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.FundingStatusKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object");
  }

  if ("Inactive" in obj) {
    return new Inactive();
  }
  if ("Active" in obj) {
    return new Active();
  }

  throw new Error("Invalid enum object");
}

export function fromJSON(
  obj: types.FundingStatusJSON
): types.FundingStatusKind {
  switch (obj.kind) {
    case "Inactive": {
      return new Inactive();
    }
    case "Active": {
      return new Active();
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Inactive"),
    borsh.struct([], "Active"),
  ]);
  if (property !== undefined) {
    return ret.replicate(property);
  }
  return ret;
}
