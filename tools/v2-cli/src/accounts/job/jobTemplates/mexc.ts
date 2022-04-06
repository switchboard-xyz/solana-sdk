import { OracleJob } from "@switchboard-xyz/switchboard-api";
import AbstractJobTemplate from "./template";

export class Mexc extends AbstractJobTemplate {
  url(): string {
    return `https://www.mexc.com/open/api/v2/market/ticker?symbol=${this.id}`;
  }

  async tasks(): Promise<OracleJob.Task[]> {
    const tasks = [
      OracleJob.Task.create({
        httpTask: OracleJob.HttpTask.create({
          url: this.url(),
        }),
      }),
      OracleJob.Task.create({
        medianTask: OracleJob.MedianTask.create({
          tasks: [
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({
                path: "$.data[0].ask",
              }),
            }),
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({
                path: "$.data[0].bid",
              }),
            }),
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({
                path: "$.data[0].last",
              }),
            }),
          ],
        }),
      }),
    ];
    return tasks;
  }
}
