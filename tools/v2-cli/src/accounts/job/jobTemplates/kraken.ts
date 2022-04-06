import { OracleJob } from "@switchboard-xyz/switchboard-api";
import AbstractJobTemplate from "./template";

export class Kraken extends AbstractJobTemplate {
  url(): string {
    return `https://api.kraken.com/0/public/Ticker?pair=${this.id}`;
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
                path: `$.result.${this.id}.a[0]`,
              }),
            }),
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({
                path: `$.result.${this.id}.b[0]`,
              }),
            }),
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({
                path: `$.result.${this.id}.c[0]`,
              }),
            }),
          ],
        }),
      }),
    ];
    return tasks;
  }
}
