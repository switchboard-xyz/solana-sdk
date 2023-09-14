import type * as types from "./index.js";

import * as borsh from "@coral-xyz/borsh";

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

export interface None3JSON {
  kind: "None3";
}

export class None3 {
  static readonly discriminator = 3;
  static readonly kind = "None3";
  readonly discriminator = 3;
  readonly kind = "None3";

  toJSON(): None3JSON {
    return {
      kind: "None3",
    };
  }

  toEncodable() {
    return {
      None3: {},
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

export interface None5JSON {
  kind: "None5";
}

export class None5 {
  static readonly discriminator = 5;
  static readonly kind = "None5";
  readonly discriminator = 5;
  readonly kind = "None5";

  toJSON(): None5JSON {
    return {
      kind: "None5",
    };
  }

  toEncodable() {
    return {
      None5: {},
    };
  }
}

export interface None6JSON {
  kind: "None6";
}

export class None6 {
  static readonly discriminator = 6;
  static readonly kind = "None6";
  readonly discriminator = 6;
  readonly kind = "None6";

  toJSON(): None6JSON {
    return {
      kind: "None6",
    };
  }

  toEncodable() {
    return {
      None6: {},
    };
  }
}

export interface None7JSON {
  kind: "None7";
}

export class None7 {
  static readonly discriminator = 7;
  static readonly kind = "None7";
  readonly discriminator = 7;
  readonly kind = "None7";

  toJSON(): None7JSON {
    return {
      kind: "None7",
    };
  }

  toEncodable() {
    return {
      None7: {},
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
  if ("None3" in obj) {
    return new None3();
  }
  if ("VerificationSuccess" in obj) {
    return new VerificationSuccess();
  }
  if ("None5" in obj) {
    return new None5();
  }
  if ("None6" in obj) {
    return new None6();
  }
  if ("None7" in obj) {
    return new None7();
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
    case "None3": {
      return new None3();
    }
    case "VerificationSuccess": {
      return new VerificationSuccess();
    }
    case "None5": {
      return new None5();
    }
    case "None6": {
      return new None6();
    }
    case "None7": {
      return new None7();
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
    borsh.struct([], "None3"),
    borsh.struct([], "VerificationSuccess"),
    borsh.struct([], "None5"),
    borsh.struct([], "None6"),
    borsh.struct([], "None7"),
    borsh.struct([], "VerificationOverride"),
  ]);
  if (property !== undefined) {
    return ret.replicate(property);
  }
  return ret;
}
