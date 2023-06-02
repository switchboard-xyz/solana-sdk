import { SwitchboardProgram } from "../../SwitchboardProgram";
import * as types from "../types"; // eslint-disable-line @typescript-eslint/no-unused-vars

import * as borsh from "@coral-xyz/borsh";
import { PublicKey } from "@solana/web3.js"; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from "@switchboard-xyz/common"; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface NoneJSON {
  kind: "None";
}

export class None {
  static readonly discriminator = 0;
  static readonly kind = "None";
  readonly discriminator = 0;
  readonly kind = "None";

  toJSON(): NoneJSON {
    return {
      kind: "None",
    };
  }

  toEncodable() {
    return {
      None: {},
    };
  }
}

export interface VerificationPendingJSON {
  kind: "VerificationPending";
}

export class VerificationPending {
  static readonly discriminator = 1;
  static readonly kind = "VerificationPending";
  readonly discriminator = 1;
  readonly kind = "VerificationPending";

  toJSON(): VerificationPendingJSON {
    return {
      kind: "VerificationPending",
    };
  }

  toEncodable() {
    return {
      VerificationPending: {},
    };
  }
}

export interface VerificationFailureJSON {
  kind: "VerificationFailure";
}

export class VerificationFailure {
  static readonly discriminator = 2;
  static readonly kind = "VerificationFailure";
  readonly discriminator = 2;
  readonly kind = "VerificationFailure";

  toJSON(): VerificationFailureJSON {
    return {
      kind: "VerificationFailure",
    };
  }

  toEncodable() {
    return {
      VerificationFailure: {},
    };
  }
}

export interface VerificationSuccessJSON {
  kind: "VerificationSuccess";
}

export class VerificationSuccess {
  static readonly discriminator = 4;
  static readonly kind = "VerificationSuccess";
  readonly discriminator = 4;
  readonly kind = "VerificationSuccess";

  toJSON(): VerificationSuccessJSON {
    return {
      kind: "VerificationSuccess",
    };
  }

  toEncodable() {
    return {
      VerificationSuccess: {},
    };
  }
}

export interface VerificationOverrideJSON {
  kind: "VerificationOverride";
}

export class VerificationOverride {
  static readonly discriminator = 8;
  static readonly kind = "VerificationOverride";
  readonly discriminator = 8;
  readonly kind = "VerificationOverride";

  toJSON(): VerificationOverrideJSON {
    return {
      kind: "VerificationOverride",
    };
  }

  toEncodable() {
    return {
      VerificationOverride: {},
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.VerificationStatusKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object");
  }

  if ("None" in obj) {
    return new None();
  }
  if ("VerificationPending" in obj) {
    return new VerificationPending();
  }
  if ("VerificationFailure" in obj) {
    return new VerificationFailure();
  }
  if ("VerificationSuccess" in obj) {
    return new VerificationSuccess();
  }
  if ("VerificationOverride" in obj) {
    return new VerificationOverride();
  }

  throw new Error("Invalid enum object");
}

export function fromJSON(
  obj: types.VerificationStatusJSON
): types.VerificationStatusKind {
  switch (obj.kind) {
    case "None": {
      return new None();
    }
    case "VerificationPending": {
      return new VerificationPending();
    }
    case "VerificationFailure": {
      return new VerificationFailure();
    }
    case "VerificationSuccess": {
      return new VerificationSuccess();
    }
    case "VerificationOverride": {
      return new VerificationOverride();
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "None"),
    borsh.struct([], "VerificationPending"),
    borsh.struct([], "VerificationFailure"),
    borsh.struct([], "VerificationSuccess"),
    borsh.struct([], "VerificationOverride"),
  ]);
  if (property !== undefined) {
    return ret.replicate(property);
  }
  return ret;
}
