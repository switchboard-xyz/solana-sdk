/* eslint-disable no-unused-vars */
import "mocha";

import assert from "assert";
import { isValidCron } from "cron-validator";

// SS MM HH DD MM YY

const cronScheduleWithoutSeconds = `5 4 * * *`; // At 04:05

const cronScheduleWithSeconds = `30 5 4 * * *`; // At 04:05:30

describe("Cron Tests", () => {
  it("Validates a cron schedule that includes seconds", async () => {
    assert(
      isValidCron(cronScheduleWithSeconds, { seconds: true }),
      "FailedToValidateCronSchedule"
    );
  });

  it("Validates a cron schedule that doesnt include seconds", async () => {
    assert(
      isValidCron(cronScheduleWithoutSeconds, { seconds: true }),
      "FailedToValidateCronSchedule"
    );
  });

  it("Fails to validate an invalid schedule", async () => {
    assert(
      isValidCron("every sunday", { seconds: true }) === false,
      "CronScheduleShouldBeInvalid"
    );
  });

  it("Fails to validate a cron schedule missing values", async () => {
    assert(
      isValidCron("* *", { seconds: true }) === false,
      "CronScheduleShouldBeInvalid"
    );
  });
});
