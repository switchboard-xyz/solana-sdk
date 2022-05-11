import { OracleJob } from "@switchboard-xyz/switchboard-v2";
import AbstractJobTemplate from "./template";

export class Ascendex extends AbstractJobTemplate {
  public id: string;

  url(): string {
    return `https://ascendex.com/api/pro/v1/ticker?symbol=${this.id}`;
  }

  async tasks(): Promise<OracleJob.Task[]> {
    const tasks = [
      OracleJob.Task.create({
        httpTask: OracleJob.HttpTask.create({
          url: ``,
        }),
      }),
      OracleJob.Task.create({
        medianTask: OracleJob.MedianTask.create({
          tasks: [
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({
                path: `$.data.ask[0]`,
              }),
            }),
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({
                path: `$.data.bid[0]`,
              }),
            }),
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({
                path: `$.data.close`,
              }),
            }),
          ],
        }),
      }),
    ];
    return tasks;
  }
}
