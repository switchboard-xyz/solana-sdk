import { OracleJob } from "@switchboard-xyz/switchboard-api";
import AbstractJobTemplate from "./template";

export class Bitfinex extends AbstractJobTemplate {
  public id: string;

  url(): string {
    const cleanedupId =
      this.id.charAt(0).toLowerCase() + this.id.toUpperCase().slice(1);
    return `https://api-pub.bitfinex.com/v2/tickers?symbols=${cleanedupId}`;
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
                path: "$[0][1]",
              }),
            }),
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({
                path: "$[0][3]",
              }),
            }),
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({
                path: "$[0][7]",
              }),
            }),
          ],
        }),
      }),
    ];
    return tasks;
  }
}
