import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
import type * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

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

export interface AuthorityJSON {
  kind: "Authority";
}

export class Authority {
  static readonly discriminator = 1;
  static readonly kind = "Authority";
  readonly discriminator = 1;
  readonly kind = "Authority";

  toJSON(): AuthorityJSON {
    return {
      kind: "Authority",
    };
  }

  toEncodable() {
    return {
      Authority: {},
    };
  }
}

export interface FunctionJSON {
  kind: "Function";
}

export class Function {
  static readonly discriminator = 2;
  static readonly kind = "Function";
  readonly discriminator = 2;
  readonly kind = "Function";

  toJSON(): FunctionJSON {
    return {
      kind: "Function",
    };
  }

  toEncodable() {
    return {
      Function: {},
    };
  }
}

export interface QueueJSON {
  kind: "Queue";
}

export class Queue {
  static readonly discriminator = 3;
  static readonly kind = "Queue";
  readonly discriminator = 3;
  readonly kind = "Queue";

  toJSON(): QueueJSON {
    return {
      kind: "Queue",
    };
  }

  toEncodable() {
    return {
      Queue: {},
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.ResourceLevelKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object");
  }

  if ("None" in obj) {
    return new None();
  }
  if ("Authority" in obj) {
    return new Authority();
  }
  if ("Function" in obj) {
    return new Function();
  }
  if ("Queue" in obj) {
    return new Queue();
  }

  throw new Error("Invalid enum object");
}

export function fromJSON(
  obj: types.ResourceLevelJSON
): types.ResourceLevelKind {
  switch (obj.kind) {
    case "None": {
      return new None();
    }
    case "Authority": {
      return new Authority();
    }
    case "Function": {
      return new Function();
    }
    case "Queue": {
      return new Queue();
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "None"),
    borsh.struct([], "Authority"),
    borsh.struct([], "Function"),
    borsh.struct([], "Queue"),
  ]);
  if (property !== undefined) {
    return ret.replicate(property);
  }
  return ret;
}
