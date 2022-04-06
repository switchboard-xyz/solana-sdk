import { OracleJob } from "@switchboard-xyz/switchboard-api";
import AbstractJobTemplate from "./template";

export class Bittrex extends AbstractJobTemplate {
  public id: string;

  url(): string {
    return `https://api.bittrex.com/v3/markets/${this.id}/ticker`;
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
                path: "$.askRate",
              }),
            }),
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({
                path: "$.bidRate",
              }),
            }),
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({
                path: "$.lastTradeRate",
              }),
            }),
          ],
        }),
      }),
    ];
    return tasks;
  }
}
