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

export interface ErrorKindJSON {
  kind: "Error";
}

export class ErrorKind {
  static readonly discriminator = 3;
  static readonly kind = "Error";
  readonly discriminator = 3;
  readonly kind = "Error";

  toJSON(): ErrorKindJSON {
    return {
      kind: "Error",
    };
  }

  toEncodable() {
    return {
      Error: {},
    };
  }
}

export interface ExpiredJSON {
  kind: "Expired";
}

export class Expired {
  static readonly discriminator = 4;
  static readonly kind = "Expired";
  readonly discriminator = 4;
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

export interface OutOfFundsJSON {
  kind: "OutOfFunds";
}

export class OutOfFunds {
  static readonly discriminator = 8;
  static readonly kind = "OutOfFunds";
  readonly discriminator = 8;
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

export interface None9JSON {
  kind: "None9";
}

export class None9 {
  static readonly discriminator = 9;
  static readonly kind = "None9";
  readonly discriminator = 9;
  readonly kind = "None9";

  toJSON(): None9JSON {
    return {
      kind: "None9",
    };
  }

  toEncodable() {
    return {
      None9: {},
    };
  }
}

export interface None10JSON {
  kind: "None10";
}

export class None10 {
  static readonly discriminator = 10;
  static readonly kind = "None10";
  readonly discriminator = 10;
  readonly kind = "None10";

  toJSON(): None10JSON {
    return {
      kind: "None10",
    };
  }

  toEncodable() {
    return {
      None10: {},
    };
  }
}

export interface None11JSON {
  kind: "None11";
}

export class None11 {
  static readonly discriminator = 11;
  static readonly kind = "None11";
  readonly discriminator = 11;
  readonly kind = "None11";

  toJSON(): None11JSON {
    return {
      kind: "None11",
    };
  }

  toEncodable() {
    return {
      None11: {},
    };
  }
}

export interface None12JSON {
  kind: "None12";
}

export class None12 {
  static readonly discriminator = 12;
  static readonly kind = "None12";
  readonly discriminator = 12;
  readonly kind = "None12";

  toJSON(): None12JSON {
    return {
      kind: "None12",
    };
  }

  toEncodable() {
    return {
      None12: {},
    };
  }
}

export interface None13JSON {
  kind: "None13";
}

export class None13 {
  static readonly discriminator = 13;
  static readonly kind = "None13";
  readonly discriminator = 13;
  readonly kind = "None13";

  toJSON(): None13JSON {
    return {
      kind: "None13",
    };
  }

  toEncodable() {
    return {
      None13: {},
    };
  }
}

export interface None14JSON {
  kind: "None14";
}

export class None14 {
  static readonly discriminator = 14;
  static readonly kind = "None14";
  readonly discriminator = 14;
  readonly kind = "None14";

  toJSON(): None14JSON {
    return {
      kind: "None14",
    };
  }

  toEncodable() {
    return {
      None14: {},
    };
  }
}

export interface None15JSON {
  kind: "None15";
}

export class None15 {
  static readonly discriminator = 15;
  static readonly kind = "None15";
  readonly discriminator = 15;
  readonly kind = "None15";

  toJSON(): None15JSON {
    return {
      kind: "None15",
    };
  }

  toEncodable() {
    return {
      None15: {},
    };
  }
}

export interface InvalidPermissionsJSON {
  kind: "InvalidPermissions";
}

export class InvalidPermissions {
  static readonly discriminator = 16;
  static readonly kind = "InvalidPermissions";
  readonly discriminator = 16;
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
  if ("Error" in obj) {
    return new ErrorKind();
  }
  if ("Expired" in obj) {
    return new Expired();
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
  if ("OutOfFunds" in obj) {
    return new OutOfFunds();
  }
  if ("None9" in obj) {
    return new None9();
  }
  if ("None10" in obj) {
    return new None10();
  }
  if ("None11" in obj) {
    return new None11();
  }
  if ("None12" in obj) {
    return new None12();
  }
  if ("None13" in obj) {
    return new None13();
  }
  if ("None14" in obj) {
    return new None14();
  }
  if ("None15" in obj) {
    return new None15();
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
    case "Error": {
      return new ErrorKind();
    }
    case "Expired": {
      return new Expired();
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
    case "OutOfFunds": {
      return new OutOfFunds();
    }
    case "None9": {
      return new None9();
    }
    case "None10": {
      return new None10();
    }
    case "None11": {
      return new None11();
    }
    case "None12": {
      return new None12();
    }
    case "None13": {
      return new None13();
    }
    case "None14": {
      return new None14();
    }
    case "None15": {
      return new None15();
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
    borsh.struct([], "Error"),
    borsh.struct([], "Expired"),
    borsh.struct([], "None5"),
    borsh.struct([], "None6"),
    borsh.struct([], "None7"),
    borsh.struct([], "OutOfFunds"),
    borsh.struct([], "None9"),
    borsh.struct([], "None10"),
    borsh.struct([], "None11"),
    borsh.struct([], "None12"),
    borsh.struct([], "None13"),
    borsh.struct([], "None14"),
    borsh.struct([], "None15"),
    borsh.struct([], "InvalidPermissions"),
  ]);
  if (property !== undefined) {
    return ret.replicate(property);
  }
  return ret;
}
