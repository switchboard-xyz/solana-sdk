/* eslint-disable no-unused-vars */
import "mocha";

import { parseCronSchedule } from "../src/utils.js";

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

    const parsedSchedule = parseCronSchedule(cronScheduleWithSeconds);
    assert(
      cronScheduleWithSeconds === parsedSchedule,
      "Cron schedule should not be modified if it includes seconds already"
    );
  });

  it("Validates a cron schedule that doesnt include seconds", async () => {
    assert(
      isValidCron(cronScheduleWithoutSeconds, { seconds: true }),
      "FailedToValidateCronSchedule"
    );

    const expectedSchedule = `0 ${cronScheduleWithoutSeconds}`;
    const parsedSchedule = parseCronSchedule(cronScheduleWithoutSeconds);
    assert(
      expectedSchedule === parsedSchedule,
      `Cron schedule should add a '0' for seconds if its not included`
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

  it("Fails to validate an empty string", async () => {
    assert(
      isValidCron("", { seconds: true }) === false,
      "CronScheduleShouldBeInvalid"
    );
  });
});
