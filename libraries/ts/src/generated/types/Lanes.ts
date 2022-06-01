import * as borsh from "@project-serum/borsh"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface DJSON {
  kind: "D"
}

export class D {
  readonly discriminator = 0
  readonly kind = "D"

  toJSON(): DJSON {
    return {
      kind: "D",
    }
  }

  toEncodable() {
    return {
      D: {},
    }
  }
}

export interface CJSON {
  kind: "C"
}

export class C {
  readonly discriminator = 1
  readonly kind = "C"

  toJSON(): CJSON {
    return {
      kind: "C",
    }
  }

  toEncodable() {
    return {
      C: {},
    }
  }
}

export interface ABJSON {
  kind: "AB"
}

export class AB {
  readonly discriminator = 2
  readonly kind = "AB"

  toJSON(): ABJSON {
    return {
      kind: "AB",
    }
  }

  toEncodable() {
    return {
      AB: {},
    }
  }
}

export interface ACJSON {
  kind: "AC"
}

export class AC {
  readonly discriminator = 3
  readonly kind = "AC"

  toJSON(): ACJSON {
    return {
      kind: "AC",
    }
  }

  toEncodable() {
    return {
      AC: {},
    }
  }
}

export interface ADJSON {
  kind: "AD"
}

export class AD {
  readonly discriminator = 4
  readonly kind = "AD"

  toJSON(): ADJSON {
    return {
      kind: "AD",
    }
  }

  toEncodable() {
    return {
      AD: {},
    }
  }
}

export interface BCDJSON {
  kind: "BCD"
}

export class BCD {
  readonly discriminator = 5
  readonly kind = "BCD"

  toJSON(): BCDJSON {
    return {
      kind: "BCD",
    }
  }

  toEncodable() {
    return {
      BCD: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.LanesKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("D" in obj) {
    return new D()
  }
  if ("C" in obj) {
    return new C()
  }
  if ("AB" in obj) {
    return new AB()
  }
  if ("AC" in obj) {
    return new AC()
  }
  if ("AD" in obj) {
    return new AD()
  }
  if ("BCD" in obj) {
    return new BCD()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.LanesJSON): types.LanesKind {
  switch (obj.kind) {
    case "D": {
      return new D()
    }
    case "C": {
      return new C()
    }
    case "AB": {
      return new AB()
    }
    case "AC": {
      return new AC()
    }
    case "AD": {
      return new AD()
    }
    case "BCD": {
      return new BCD()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "D"),
    borsh.struct([], "C"),
    borsh.struct([], "AB"),
    borsh.struct([], "AC"),
    borsh.struct([], "AD"),
    borsh.struct([], "BCD"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
