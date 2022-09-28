export type CustomError =
  | InvalidSwitchboardAccount
  | StaleFeed
  | ConfidenceIntervalExceeded

export class InvalidSwitchboardAccount extends Error {
  readonly code = 6000
  readonly name = "InvalidSwitchboardAccount"
  readonly msg = "Not a valid Switchboard account"

  constructor() {
    super("6000: Not a valid Switchboard account")
  }
}

export class StaleFeed extends Error {
  readonly code = 6001
  readonly name = "StaleFeed"
  readonly msg = "Switchboard feed has not been updated in 5 minutes"

  constructor() {
    super("6001: Switchboard feed has not been updated in 5 minutes")
  }
}

export class ConfidenceIntervalExceeded extends Error {
  readonly code = 6002
  readonly name = "ConfidenceIntervalExceeded"
  readonly msg = "Switchboard feed exceeded provided confidence interval"

  constructor() {
    super("6002: Switchboard feed exceeded provided confidence interval")
  }
}

export function fromCode(code: number): CustomError | null {
  switch (code) {
    case 6000:
      return new InvalidSwitchboardAccount()
    case 6001:
      return new StaleFeed()
    case 6002:
      return new ConfidenceIntervalExceeded()
  }

  return null
}
