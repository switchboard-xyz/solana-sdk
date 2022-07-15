export type CustomError =
  | InvalidSwitchboardAccount
  | ExpectedResultMismatch
  | StaleBuffer
  | StringConversionFailed

export class InvalidSwitchboardAccount extends Error {
  readonly code = 6000
  readonly name = "InvalidSwitchboardAccount"
  readonly msg = "Not a valid Switchboard account"

  constructor() {
    super("6000: Not a valid Switchboard account")
  }
}

export class ExpectedResultMismatch extends Error {
  readonly code = 6001
  readonly name = "ExpectedResultMismatch"
  readonly msg = "Switchboard buffer does not match provided expected_result!"

  constructor() {
    super("6001: Switchboard buffer does not match provided expected_result!")
  }
}

export class StaleBuffer extends Error {
  readonly code = 6002
  readonly name = "StaleBuffer"
  readonly msg =
    "Switchboard buffer has not been updated in the last 5 minutes!"

  constructor() {
    super(
      "6002: Switchboard buffer has not been updated in the last 5 minutes!"
    )
  }
}

export class StringConversionFailed extends Error {
  readonly code = 6003
  readonly name = "StringConversionFailed"
  readonly msg = "Failed to convert the buffer to a string!"

  constructor() {
    super("6003: Failed to convert the buffer to a string!")
  }
}

export function fromCode(code: number): CustomError | null {
  switch (code) {
    case 6000:
      return new InvalidSwitchboardAccount()
    case 6001:
      return new ExpectedResultMismatch()
    case 6002:
      return new StaleBuffer()
    case 6003:
      return new StringConversionFailed()
  }

  return null
}
