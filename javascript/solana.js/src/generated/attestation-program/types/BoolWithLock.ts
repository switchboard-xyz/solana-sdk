import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import type * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface DisabledJSON {
  kind: "Disabled";
}

export class Disabled {
  static readonly discriminator = 0;
  static readonly kind = "Disabled";
  readonly discriminator = 0;
  readonly kind = "Disabled";

  toJSON(): DisabledJSON {
    return {
      kind: "Disabled",
    };
  }

  toEncodable() {
    return {
      Disabled: {},
    };
  }
}

export interface EnabledJSON {
  kind: "Enabled";
}

export class Enabled {
  static readonly discriminator = 1;
  static readonly kind = "Enabled";
  readonly discriminator = 1;
  readonly kind = "Enabled";

  toJSON(): EnabledJSON {
    return {
      kind: "Enabled",
    };
  }

  toEncodable() {
    return {
      Enabled: {},
    };
  }
}

export interface DisabledLockedJSON {
  kind: "DisabledLocked";
}

export class DisabledLocked {
  static readonly discriminator = 2;
  static readonly kind = "DisabledLocked";
  readonly discriminator = 2;
  readonly kind = "DisabledLocked";

  toJSON(): DisabledLockedJSON {
    return {
      kind: "DisabledLocked",
    };
  }

  toEncodable() {
    return {
      DisabledLocked: {},
    };
  }
}

export interface EnabledLockedJSON {
  kind: "EnabledLocked";
}

export class EnabledLocked {
  static readonly discriminator = 3;
  static readonly kind = "EnabledLocked";
  readonly discriminator = 3;
  readonly kind = "EnabledLocked";

  toJSON(): EnabledLockedJSON {
    return {
      kind: "EnabledLocked",
    };
  }

  toEncodable() {
    return {
      EnabledLocked: {},
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.BoolWithLockKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object");
  }

  if ("Disabled" in obj) {
    return new Disabled();
  }
  if ("Enabled" in obj) {
    return new Enabled();
  }
  if ("DisabledLocked" in obj) {
    return new DisabledLocked();
  }
  if ("EnabledLocked" in obj) {
    return new EnabledLocked();
  }

  throw new Error("Invalid enum object");
}

export function fromJSON(obj: types.BoolWithLockJSON): types.BoolWithLockKind {
  switch (obj.kind) {
    case "Disabled": {
      return new Disabled();
    }
    case "Enabled": {
      return new Enabled();
    }
    case "DisabledLocked": {
      return new DisabledLocked();
    }
    case "EnabledLocked": {
      return new EnabledLocked();
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Disabled"),
    borsh.struct([], "Enabled"),
    borsh.struct([], "DisabledLocked"),
    borsh.struct([], "EnabledLocked"),
  ]);
  if (property !== undefined) {
    return ret.replicate(property);
  }
  return ret;
}
