import { SwitchboardProgram } from "../../../SwitchboardProgram.js";
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

export interface RequestPendingJSON {
  kind: "RequestPending";
}

export class RequestPending {
  static readonly discriminator = 1;
  static readonly kind = "RequestPending";
  readonly discriminator = 1;
  readonly kind = "RequestPending";

  toJSON(): RequestPendingJSON {
    return {
      kind: "RequestPending",
    };
  }

  toEncodable() {
    return {
      RequestPending: {},
    };
  }
}

export interface RequestCancelledJSON {
  kind: "RequestCancelled";
}

export class RequestCancelled {
  static readonly discriminator = 2;
  static readonly kind = "RequestCancelled";
  readonly discriminator = 2;
  readonly kind = "RequestCancelled";

  toJSON(): RequestCancelledJSON {
    return {
      kind: "RequestCancelled",
    };
  }

  toEncodable() {
    return {
      RequestCancelled: {},
    };
  }
}

export interface RequestFailureJSON {
  kind: "RequestFailure";
}

export class RequestFailure {
  static readonly discriminator = 3;
  static readonly kind = "RequestFailure";
  readonly discriminator = 3;
  readonly kind = "RequestFailure";

  toJSON(): RequestFailureJSON {
    return {
      kind: "RequestFailure",
    };
  }

  toEncodable() {
    return {
      RequestFailure: {},
    };
  }
}

export interface RequestExpiredJSON {
  kind: "RequestExpired";
}

export class RequestExpired {
  static readonly discriminator = 4;
  static readonly kind = "RequestExpired";
  readonly discriminator = 4;
  readonly kind = "RequestExpired";

  toJSON(): RequestExpiredJSON {
    return {
      kind: "RequestExpired",
    };
  }

  toEncodable() {
    return {
      RequestExpired: {},
    };
  }
}

export interface RequestSuccessJSON {
  kind: "RequestSuccess";
}

export class RequestSuccess {
  static readonly discriminator = 5;
  static readonly kind = "RequestSuccess";
  readonly discriminator = 5;
  readonly kind = "RequestSuccess";

  toJSON(): RequestSuccessJSON {
    return {
      kind: "RequestSuccess",
    };
  }

  toEncodable() {
    return {
      RequestSuccess: {},
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.RequestStatusKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object");
  }

  if ("None" in obj) {
    return new None();
  }
  if ("RequestPending" in obj) {
    return new RequestPending();
  }
  if ("RequestCancelled" in obj) {
    return new RequestCancelled();
  }
  if ("RequestFailure" in obj) {
    return new RequestFailure();
  }
  if ("RequestExpired" in obj) {
    return new RequestExpired();
  }
  if ("RequestSuccess" in obj) {
    return new RequestSuccess();
  }

  throw new Error("Invalid enum object");
}

export function fromJSON(
  obj: types.RequestStatusJSON
): types.RequestStatusKind {
  switch (obj.kind) {
    case "None": {
      return new None();
    }
    case "RequestPending": {
      return new RequestPending();
    }
    case "RequestCancelled": {
      return new RequestCancelled();
    }
    case "RequestFailure": {
      return new RequestFailure();
    }
    case "RequestExpired": {
      return new RequestExpired();
    }
    case "RequestSuccess": {
      return new RequestSuccess();
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "None"),
    borsh.struct([], "RequestPending"),
    borsh.struct([], "RequestCancelled"),
    borsh.struct([], "RequestFailure"),
    borsh.struct([], "RequestExpired"),
    borsh.struct([], "RequestSuccess"),
  ]);
  if (property !== undefined) {
    return ret.replicate(property);
  }
  return ret;
}
