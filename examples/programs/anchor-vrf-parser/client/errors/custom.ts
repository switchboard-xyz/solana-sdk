export type CustomError =
  | InvalidSwitchboardVrfAccount
  | MaxResultExceedsMaximum
  | EmptyCurrentRoundResult
  | InvalidAuthorityError

export class InvalidSwitchboardVrfAccount extends Error {
  readonly code = 6000
  readonly name = "InvalidSwitchboardVrfAccount"
  readonly msg = "Not a valid Switchboard VRF account"

  constructor() {
    super("6000: Not a valid Switchboard VRF account")
  }
}

export class MaxResultExceedsMaximum extends Error {
  readonly code = 6001
  readonly name = "MaxResultExceedsMaximum"
  readonly msg = "The max result must not exceed u64"

  constructor() {
    super("6001: The max result must not exceed u64")
  }
}

export class EmptyCurrentRoundResult extends Error {
  readonly code = 6002
  readonly name = "EmptyCurrentRoundResult"
  readonly msg = "Current round result is empty"

  constructor() {
    super("6002: Current round result is empty")
  }
}

export class InvalidAuthorityError extends Error {
  readonly code = 6003
  readonly name = "InvalidAuthorityError"
  readonly msg = "Invalid authority account provided."

  constructor() {
    super("6003: Invalid authority account provided.")
  }
}

export function fromCode(code: number): CustomError | null {
  switch (code) {
    case 6000:
      return new InvalidSwitchboardVrfAccount()
    case 6001:
      return new MaxResultExceedsMaximum()
    case 6002:
      return new EmptyCurrentRoundResult()
    case 6003:
      return new InvalidAuthorityError()
  }

  return null
}
