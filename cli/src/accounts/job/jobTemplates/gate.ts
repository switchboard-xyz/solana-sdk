import { OracleJob } from "@switchboard-xyz/v2-task-library";
import AbstractJobTemplate from "./template";

export class Gate extends AbstractJobTemplate {
  public id: string;

  url(): string {
    return `https://api.gateio.ws/api/v4/spot/tickers?currency_pair=${this.id}`;
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
                path: `$[0].lowest_ask`,
              }),
            }),
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({
                path: `$[0].highest_bid`,
              }),
            }),
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({
                path: `$[0].last`,
              }),
            }),
          ],
        }),
      }),
    ];
    return tasks;
  }
}
