import { SwitchboardProgram } from "../../SwitchboardProgram.js";
import * as types from "../types/index.js"; // eslint-disable-line @typescript-eslint/no-unused-vars

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

export interface NonExecutableJSON {
  kind: "NonExecutable";
}

export class NonExecutable {
  static readonly discriminator = 2;
  static readonly kind = "NonExecutable";
  readonly discriminator = 2;
  readonly kind = "NonExecutable";

  toJSON(): NonExecutableJSON {
    return {
      kind: "NonExecutable",
    };
  }

  toEncodable() {
    return {
      NonExecutable: {},
    };
  }
}

export interface ExpiredJSON {
  kind: "Expired";
}

export class Expired {
  static readonly discriminator = 3;
  static readonly kind = "Expired";
  readonly discriminator = 3;
  readonly kind = "Expired";

  toJSON(): ExpiredJSON {
    return {
      kind: "Expired",
    };
  }

  toEncodable() {
    return {
      Expired: {},
    };
  }
}

export interface OutOfFundsJSON {
  kind: "OutOfFunds";
}

export class OutOfFunds {
  static readonly discriminator = 4;
  static readonly kind = "OutOfFunds";
  readonly discriminator = 4;
  readonly kind = "OutOfFunds";

  toJSON(): OutOfFundsJSON {
    return {
      kind: "OutOfFunds",
    };
  }

  toEncodable() {
    return {
      OutOfFunds: {},
    };
  }
}

export interface InvalidPermissionsJSON {
  kind: "InvalidPermissions";
}

export class InvalidPermissions {
  static readonly discriminator = 5;
  static readonly kind = "InvalidPermissions";
  readonly discriminator = 5;
  readonly kind = "InvalidPermissions";

  toJSON(): InvalidPermissionsJSON {
    return {
      kind: "InvalidPermissions",
    };
  }

  toEncodable() {
    return {
      InvalidPermissions: {},
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.FunctionStatusKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object");
  }

  if ("None" in obj) {
    return new None();
  }
  if ("Active" in obj) {
    return new Active();
  }
  if ("NonExecutable" in obj) {
    return new NonExecutable();
  }
  if ("Expired" in obj) {
    return new Expired();
  }
  if ("OutOfFunds" in obj) {
    return new OutOfFunds();
  }
  if ("InvalidPermissions" in obj) {
    return new InvalidPermissions();
  }

  throw new Error("Invalid enum object");
}

export function fromJSON(
  obj: types.FunctionStatusJSON
): types.FunctionStatusKind {
  switch (obj.kind) {
    case "None": {
      return new None();
    }
    case "Active": {
      return new Active();
    }
    case "NonExecutable": {
      return new NonExecutable();
    }
    case "Expired": {
      return new Expired();
    }
    case "OutOfFunds": {
      return new OutOfFunds();
    }
    case "InvalidPermissions": {
      return new InvalidPermissions();
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "None"),
    borsh.struct([], "Active"),
    borsh.struct([], "NonExecutable"),
    borsh.struct([], "Expired"),
    borsh.struct([], "OutOfFunds"),
    borsh.struct([], "InvalidPermissions"),
  ]);
  if (property !== undefined) {
    return ret.replicate(property);
  }
  return ret;
}
